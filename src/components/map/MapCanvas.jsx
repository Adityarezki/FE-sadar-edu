import React, { useRef, useCallback, useEffect, useMemo } from "react";
import Map, {
  NavigationControl,
  Source,
  Layer,
  Popup,
} from "react-map-gl/mapbox";
import { useMapStore } from "../../store/useMapStore";
import { dummySchools } from "../../data/dummySchools";
import { dummyKecamatan } from "../../data/dummyKecamatan";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// Style Layer Sekolah
const schoolLayerStyle = {
  id: "schools-layer",
  type: "circle",
  paint: {
    "circle-radius": 7,
    "circle-color": [
      "match",
      ["get", "status"],
      "Negeri",
      "#1F6F5F",
      "Swasta",
      "#F59E0B",
      "#64748B",
    ],
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};

// Style Layer MCDA (Choropleth Polygon)
const mcdaFillStyle = {
  id: "mcda-layer-fill",
  type: "fill",
  paint: {
    "fill-color": ["get", "color"],
    "fill-opacity": 0.55,
  },
};

const mcdaLineStyle = {
  id: "mcda-layer-line",
  type: "line",
  paint: {
    "line-color": "#ffffff",
    "line-width": 1.5,
  },
};

// Helper Penentuan Warna berdasarkan Skor Defisit (0-100)
function getScoreColor(score) {
  if (score > 70) return "#ef4444"; // Merah (Defisit Tinggi)
  if (score > 45) return "#f59e0b"; // Kuning (Defisit Sedang)
  return "#10b981";                // Hijau (Cukup / Baik)
}

export default function MapCanvas() {
  const mapRef = useRef();

  // State Store Global
  const {
    viewState,
    setViewState,
    activeLayers,
    mcdaWeights,
    selectedFeature,
    setSelectedFeature,
    addToCompare,
  } = useMapStore();

  // Kalkulasi Skor Defisit & Warna per Polygon Kecamatan secara Dinamis
  const processedKecamatanGeoJson = useMemo(() => {
    if (!dummyKecamatan || !mcdaWeights) return dummyKecamatan;

    const totalWeight =
      (mcdaWeights.demokrasi || 0) +
      (mcdaWeights.aksesibilitas || 0) +
      (mcdaWeights.rtrw || 0) || 1;

    return {
      ...dummyKecamatan,
      features: dummyKecamatan.features.map((feature) => {
        const { valDemokrasi = 0, valAksesibilitas = 0, valRtrw = 0 } =
          feature.properties;

        const calculatedScore =
          (valDemokrasi * mcdaWeights.demokrasi +
            valAksesibilitas * mcdaWeights.aksesibilitas +
            valRtrw * mcdaWeights.rtrw) /
          totalWeight;

        return {
          ...feature,
          properties: {
            ...feature.properties,
            score: calculatedScore,
            color: getScoreColor(calculatedScore),
          },
        };
      }),
    };
  }, [mcdaWeights]);

  // Load 3D Buildings & Pencahayaan Peta
  const onMapLoad = useCallback((evt) => {
    const map = evt.target;
    map.setLight({
      anchor: "viewport",
      color: "#ffffff",
      intensity: 0.35,
      position: [1.5, 90, 80],
    });

    if (map.getLayer("3d-buildings")) return;

    map.addLayer({
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 14,
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"],
          ["get", "height"],
          0,
          "#e2e8f0",
          15,
          "#a7f3d0",
          40,
          "#2FA084",
          80,
          "#1F6F5F",
        ],
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"],
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"],
        ],
        "fill-extrusion-opacity": 0.85,
      },
    });
  }, []);

  // Toggle Visibility 3D Buildings
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    if (map.getStyle() && map.getLayer("3d-buildings")) {
      map.setLayoutProperty(
        "3d-buildings",
        "visibility",
        activeLayers?.show3DBuildings ? "visible" : "none"
      );
    }
  }, [activeLayers?.show3DBuildings]);

  // Handler Klik Pada Peta
  const onMapClick = useCallback(
    (event) => {
      const feature = event.features && event.features[0];
      if (feature && feature.layer.id === "schools-layer") {
        setSelectedFeature({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          properties: feature.properties,
        });
      } else {
        setSelectedFeature(null);
      }
    },
    [setSelectedFeature]
  );

  const onMouseEnter = useCallback(() => {
    if (mapRef.current) mapRef.current.getCanvas().style.cursor = "pointer";
  }, []);

  const onMouseLeave = useCallback(() => {
    if (mapRef.current) mapRef.current.getCanvas().style.cursor = "";
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={onMapLoad}
        terrain={{ source: "mapbox-dem", exaggeration: 1.2 }}
        interactiveLayerIds={activeLayers?.showSchools ? ["schools-layer"] : []}
        onClick={onMapClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        reuseMaps
      >
        <NavigationControl position="bottom-right" visualizePitch={true} />

        {/* Source Terrain 3D */}
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />

        {/* --- LAYER MCDA CHOROPLETH (POLYGON KECAMATAN) --- */}
        {activeLayers?.mcdaLayer && processedKecamatanGeoJson && (
          <Source id="mcda-source" type="geojson" data={processedKecamatanGeoJson}>
            <Layer {...mcdaFillStyle} />
            <Layer {...mcdaLineStyle} />
          </Source>
        )}

        {/* --- LAYER SEKOLAH (POINT) --- */}
        {activeLayers?.showSchools && (
          <Source id="schools-source" type="geojson" data={dummySchools}>
            <Layer {...schoolLayerStyle} />
          </Source>
        )}

        {/* --- POPUP DETAIL SEKOLAH --- */}
        {selectedFeature && (
          <Popup
            longitude={selectedFeature.longitude}
            latitude={selectedFeature.latitude}
            anchor="bottom"
            offset={12}
            onClose={() => setSelectedFeature(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-1 min-w-[180px] text-slate-800">
              <h3 className="font-bold text-[#1F6F5F] text-sm mb-1">
                {selectedFeature.properties.nama}
              </h3>

              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-1 mb-2">
                <span className="text-slate-500">Status</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded ${
                    selectedFeature.properties.status === "Negeri"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {selectedFeature.properties.status}
                </span>
              </div>

              <button
                onClick={() => {
                  addToCompare(selectedFeature.properties);
                  setSelectedFeature(null);
                }}
                className="w-full bg-[#1F6F5F] hover:bg-emerald-800 text-white text-xs py-1.5 rounded transition-colors font-medium"
              >
                + Tambah ke Perbandingan
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}