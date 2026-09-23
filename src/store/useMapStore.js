import { create } from "zustand";

export const useMapStore = create((set) => ({
  // State Peta (Sudah disesuaikan ke Bogor)
  viewState: {
    longitude: 106.7996, // Longitude Bogor Tengah
    latitude: -6.5976,   // Latitude Bogor Tengah
    zoom: 12,
    pitch: 45,
    bearing: 0,
  },
  setViewState: (viewState) => set({ viewState }),

  // FIX: Fungsi flyToRegion ditambahkan untuk mengupdate viewState
  flyToRegion: (lng, lat, zoom = 14) =>
    set((state) => ({
      viewState: {
        ...state.viewState,
        longitude: lng,
        latitude: lat,
        zoom: zoom,
        // Memberikan durasi animasi jika menggunakan react-map-gl / deck.gl
        transitionDuration: 1000, 
      },
    })),

  // Layer Aktif
  activeLayers: {
    showSchools: true,
    show3DBuildings: true,
    mcdaLayer: true,
  },
  toggleLayer: (layerKey) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layerKey]: !state.activeLayers[layerKey],
      },
    })),

  // State Bobot MCDA (Total harus ~100%)
  mcdaWeights: {
    demokrasi: 40, // Kepadatan Usia Sekolah
    aksesibilitas: 35, // Jarak ke Sekolah Terdekat
    rtrw: 25, // Kesesuaian Lahan
  },
  setMcdaWeights: (weights) => set({ mcdaWeights: weights }),

  // State Fitur Terpilih & Perbandingan
  selectedFeature: null,
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),

  comparedSchools: [],
  addToCompare: (school) =>
    set((state) => {
      if (state.comparedSchools.some((s) => s.id === school.id)) return state;
      return { comparedSchools: [...state.comparedSchools, school] };
    }),
  removeFromCompare: (id) =>
    set((state) => ({
      comparedSchools: state.comparedSchools.filter((s) => s.id !== id),
    })),

  isCompareOpen: false,
  setIsCompareOpen: (isOpen) => set({ isCompareOpen: isOpen }),
}));