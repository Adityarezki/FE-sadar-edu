import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Layers,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  X,
  Compass,
  School,
  CheckCircle2,
  Maximize2,
  ChevronDown,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import MapCanvas from "../../components/map/MapCanvas";
import CompareModal from "../../components/ui/CompareModal";
import { useMapStore } from "../../store/useMapStore";
import { dummyDistricts } from "../../data/dummyDistrict";
import { dummySchools } from "../../data/dummySchools";

// React Bits Components
import ShinyText from "../../components/reactbits/ShinyText";
import SpotlightCard from "../../components/reactbits/SpotlightCard";
import AnimatedCounter from "../../components/reactbits/AnimatedCounter";

// Asset Figma & foto sekolah
import logo from "../../assets/figma/logo-sadar.svg";
import schoolA from "../../assets/figma/school-a.png";
import schoolB from "../../assets/figma/school-b.png";
import schoolC from "../../assets/figma/school-c.png";
import schoolHero from "../../assets/figma/school-hero.png";

const schoolImages = [schoolA, schoolB, schoolC];

export default function EksplorasiPeta() {
  const {
    activeLayers,
    toggleLayer,
    flyToRegion,
    comparedSchools,
    setIsCompareOpen,
    setSelectedFeature,
    addToCompare,
  } = useMapStore();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'Negeri' | 'Swasta'
  const [activeTab, setActiveTab] = useState("search"); // 'search' | 'list' | 'layers'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedSchoolDetail, setSelectedSchoolDetail] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // List sekolah SMP Kota Bogor yang terfilter
  const filteredSchools = useMemo(() => {
    return dummySchools.features.filter((f) => {
      const nama = f.properties.nama.toLowerCase();
      const matchKeyword = nama.includes(searchKeyword.toLowerCase()) || (f.properties.npsn && f.properties.npsn.includes(searchKeyword));
      const matchStatus = filterStatus === "all" || f.properties.status === filterStatus;
      
      let matchDistrict = true;
      if (selectedDistrict) {
        const districtObj = dummyDistricts.find((d) => String(d.id) === String(selectedDistrict));
        if (districtObj && f.properties.kecamatan) {
          matchDistrict = f.properties.kecamatan.toLowerCase() === districtObj.name.toLowerCase();
        }
      }

      return matchKeyword && matchStatus && matchDistrict;
    });
  }, [searchKeyword, filterStatus, selectedDistrict]);

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    if (!districtId) return;

    const target = dummyDistricts.find(
      (d) => String(d.id) === String(districtId)
    );
    if (target && target.coordinates) {
      flyToRegion(target.coordinates[0], target.coordinates[1], target.zoom || 14.5);
    }
  };

  const handleSelectSchool = (schoolFeature) => {
    const [lng, lat] = schoolFeature.geometry.coordinates;
    flyToRegion(lng, lat, 16.5);
    setSelectedFeature({
      longitude: lng,
      latitude: lat,
      properties: schoolFeature.properties,
    });
  };

  const openSchoolDetail = (schoolFeature) => {
    setSelectedSchoolDetail(schoolFeature);
    handleSelectSchool(schoolFeature);
  };

  const resetFilters = () => {
    setSearchKeyword("");
    setFilterStatus("all");
    setSelectedDistrict("");
  };

  return (
    <div className="relative w-full h-screen bg-[#F8FAFC] overflow-hidden flex flex-col font-sans select-none">
      {/* ================= TOP EDITORIAL NAVIGATION HEADER ================= */}
      <header className="absolute top-4 left-4 right-4 z-30 pointer-events-none flex items-center justify-between">
        {/* Brand & Navigasi Kiri */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white/95 hover:bg-white text-slate-700 hover:text-[#1F6F5F] rounded-2xl shadow-md border border-slate-200/80 backdrop-blur-md transition-all text-xs font-semibold group"
            title="Kembali ke Beranda"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Beranda</span>
          </Link>

          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/95 rounded-2xl shadow-md border border-slate-200/80 backdrop-blur-md">
            <img src={logo} alt="SADAR EDU" className="w-7 h-7 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <ShinyText text="SADAR EDU" className="font-bold text-xs tracking-tight" />
                <span className="bg-[#1F6F5F]/10 text-[#1F6F5F] text-[10px] font-bold px-2 py-0.5 rounded-md">
                  SMP Kota Bogor
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Peta geospasial & profil fasilitas SMP Kota Bogor</p>
            </div>
          </div>
        </div>

        {/* Action Kanan: Toggle Panel & Login Pengelola */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl shadow-md border text-xs font-semibold backdrop-blur-md transition-all ${
              isSidebarOpen
                ? "bg-[#1F6F5F] text-white border-[#1F6F5F] hover:bg-emerald-800"
                : "bg-white/95 text-slate-700 border-slate-200/80 hover:bg-white"
            }`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">{isSidebarOpen ? "Sembunyikan Panel" : "Buka Eksplorasi"}</span>
          </button>

          <Link
            to="/login"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white/95 hover:bg-white text-slate-700 hover:text-[#1F6F5F] rounded-2xl shadow-md border border-slate-200/80 backdrop-blur-md transition-all text-xs font-semibold"
          >
            <span>Masuk Pengelola</span>
            <ExternalLink size={13} className="text-slate-400" />
          </Link>
        </div>
      </header>

      {/* ================= LEFT FLOATING WORKSPACE PANEL ================= */}
      <div
        className={`absolute top-20 left-4 bottom-5 z-20 w-88 sm:w-[420px] transition-all duration-300 pointer-events-none flex flex-col ${
          isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden pointer-events-auto">
          {/* Header Panel */}
          <div className="p-4 pb-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={13} className="text-[#1F6F5F]" /> Persempit Pencarian
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                {filteredSchools.length} Sekolah Terdaftar
              </span>
            </div>

            {/* Field Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari nama sekolah atau NPSN..."
                className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]/30 focus:border-[#1F6F5F] transition-all shadow-sm"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Navigasi 3 Tab */}
            <div className="flex gap-1 mt-3 bg-slate-200/70 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("search")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "search"
                    ? "bg-white text-[#1F6F5F] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <SlidersHorizontal size={13} /> Filter
              </button>
              <button
                onClick={() => setActiveTab("list")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "list"
                    ? "bg-white text-[#1F6F5F] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <School size={13} /> Daftar ({filteredSchools.length})
              </button>
              <button
                onClick={() => setActiveTab("layers")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "layers"
                    ? "bg-white text-[#1F6F5F] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers size={13} /> Lapisan
              </button>
            </div>
          </div>

          {/* Konten Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* TAB 1: FILTER WILAYAH DAN STATUS */}
            {activeTab === "search" && (
              <div className="space-y-4">
                {/* Wilayah / Kecamatan */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Kecamatan (Kota Bogor)
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]/30 focus:border-[#1F6F5F] cursor-pointer shadow-sm appearance-none transition-all"
                    >
                      <option value="">Semua Kecamatan</option>
                      {dummyDistricts.map((d) => (
                        <option key={d.id} value={d.id}>
                          Kecamatan {d.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                </div>

                {/* Status Sekolah */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Status Sekolah
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        filterStatus === "all"
                          ? "bg-[#1F6F5F] text-white border-[#1F6F5F] shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setFilterStatus("Negeri")}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        filterStatus === "Negeri"
                          ? "bg-[#1F6F5F] text-white border-[#1F6F5F] shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      Negeri
                    </button>
                    <button
                      onClick={() => setFilterStatus("Swasta")}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        filterStatus === "Swasta"
                          ? "bg-[#1F6F5F] text-white border-[#1F6F5F] shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                      Swasta
                    </button>
                  </div>
                </div>

                {/* Quick District Chips */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Jalan Pintas Wilayah
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {dummyDistricts.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setSelectedDistrict(d.id);
                          flyToRegion(d.coordinates[0], d.coordinates[1], d.zoom || 14.5);
                        }}
                        className={`text-[11px] font-medium px-2.5 py-1.5 rounded-xl border transition-all ${
                          selectedDistrict === d.id
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tip Navigasi 3D */}
                <div className="p-3.5 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-100 rounded-2xl text-slate-700 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F6F5F]">
                    <Sparkles size={14} /> Tip Navigasi 3D
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Gunakan <strong>Klik Kanan + Tarik Mouse</strong> untuk memiringkan kamera (*pitch 3D*) atau putar sudut pandang wilayah Bogor.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: DAFTAR SEKOLAH BERGAYA CARD FIGMA */}
            {activeTab === "list" && (
              <div className="space-y-3">
                {/* Ringkasan Hasil */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                  <div>
                    <strong className="block text-base font-bold text-slate-800">
                      <AnimatedCounter to={filteredSchools.length} />
                    </strong>
                    <small className="text-[10px] text-slate-400 font-medium">Total Hasil</small>
                  </div>
                  <div>
                    <strong className="block text-base font-bold text-[#1F6F5F]">
                      <AnimatedCounter to={filteredSchools.length} />
                    </strong>
                    <small className="text-[10px] text-slate-400 font-medium">Terpetakan</small>
                  </div>
                  <div>
                    <strong className="block text-base font-bold text-slate-400">0</strong>
                    <small className="text-[10px] text-slate-400 font-medium">Tanpa Titik</small>
                  </div>
                </div>

                {filteredSchools.length === 0 ? (
                  <div className="text-center py-10 px-4 text-slate-400">
                    <p className="text-xs font-medium">Tidak ada sekolah yang cocok dengan filter aktif.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-3 py-1.5 bg-[#1F6F5F] text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition"
                    >
                      Hapus semua filter
                    </button>
                  </div>
                ) : (
                  filteredSchools.map((item, idx) => {
                    const isCompared = comparedSchools.some(
                      (s) => s.id === item.properties.id
                    );
                    const photo = schoolImages[idx % schoolImages.length];

                    return (
                      <SpotlightCard
                        key={item.properties.id}
                        className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-2xl shadow-sm hover:shadow-md transition-all group"
                        spotlightColor="rgba(31, 111, 95, 0.15)"
                      >
                        {/* Gambar Sekolah */}
                        <div className="h-28 relative overflow-hidden bg-slate-100">
                          <img
                            src={photo}
                            alt={item.properties.nama}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-2 right-2 text-[9px] font-semibold text-white bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded">
                            Foto ilustrasi
                          </span>
                          <span
                            className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm ${
                              item.properties.status === "Negeri"
                                ? "bg-emerald-600 text-white"
                                : "bg-amber-500 text-white"
                            }`}
                          >
                            {item.properties.status}
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-3.5 space-y-2">
                          <div>
                            <h3 className="font-bold text-sm text-slate-800 group-hover:text-[#1F6F5F] transition-colors">
                              {item.properties.nama}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              NPSN: {item.properties.npsn} • Akreditasi {item.properties.akreditasi}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {item.properties.jumlahSiswa} Siswa • {item.properties.ruangKelas} Kelas
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => openSchoolDetail(item)}
                              className="text-xs font-semibold text-[#1F6F5F] hover:text-emerald-800 flex items-center gap-1"
                            >
                              Detail profil <ChevronRight size={13} />
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleSelectSchool(item)}
                                className="p-1.5 bg-slate-100 hover:bg-[#1F6F5F] text-slate-600 hover:text-white rounded-lg transition-colors"
                                title="Fokuskan di Peta"
                              >
                                <Maximize2 size={13} />
                              </button>
                              <button
                                onClick={() => addToCompare(item.properties)}
                                disabled={isCompared}
                                className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all ${
                                  isCompared
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                }`}
                              >
                                {isCompared ? "✓ Dibandingkan" : "+ Banding"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </SpotlightCard>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 3: LAYER DAN ANALISIS MCDA */}
            {activeTab === "layers" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Visibilitas Objek Geospasial
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1F6F5F] flex items-center justify-center">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">Bangunan 3D Extrusion</p>
                          <p className="text-[10px] text-slate-400">Model elevasi massa bangunan</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={activeLayers?.show3DBuildings || false}
                        onChange={() => toggleLayer("show3DBuildings")}
                        className="w-4 h-4 rounded accent-[#1F6F5F] cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1F6F5F] flex items-center justify-center">
                          <GraduationCap size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">Titik Sebaran Sekolah</p>
                          <p className="text-[10px] text-slate-400">Marker lokasi sekolah aktif</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={activeLayers?.showSchools || false}
                        onChange={() => toggleLayer("showSchools")}
                        className="w-4 h-4 rounded accent-[#1F6F5F] cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                          <Layers size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">Poligon Kebutuhan Wilayah</p>
                          <p className="text-[10px] text-slate-400">Choropleth defisit & prioritas</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={activeLayers?.mcdaLayer || false}
                        onChange={() => toggleLayer("mcdaLayer")}
                        className="w-4 h-4 rounded accent-[#1F6F5F] cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Legenda Tingkat Kebutuhan (MCDA) */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-600 block mb-2">
                    Indikator Defisit Wilayah (MCDA)
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                      <span>Cukup / Baik</span>
                      <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 mx-1"></div>
                      <span>Prioritas Tinggi</span>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 px-0.5">
                      <span>Hijau: Fasilitas Memadai</span>
                      <span>Merah: Butuh Sekolah</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Status Panel */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Peta Bogor Aktif
            </span>
            <button
              onClick={resetFilters}
              className="text-[#1F6F5F] hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL DETAIL SEKOLAH ================= */}
      {selectedSchoolDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedSchoolDetail.properties.status === "Negeri"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {selectedSchoolDetail.properties.status}
                </span>
                <span className="text-xs text-slate-400">
                  NPSN {selectedSchoolDetail.properties.npsn}
                </span>
              </div>
              <button
                onClick={() => setSelectedSchoolDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/50 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 space-y-4">
              {/* Gambar Hero Sekolah */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={schoolHero}
                  alt={selectedSchoolDetail.properties.nama}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">
                      {selectedSchoolDetail.properties.nama}
                    </h2>
                    <p className="text-xs text-white/80 mt-0.5">
                      Kota Bogor • Akreditasi {selectedSchoolDetail.properties.akreditasi}
                    </p>
                  </div>
                </div>
              </div>

              {/* Peringatan Verifikasi Data */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-center gap-2 text-xs text-amber-800">
                <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                <span>Sebagian data profil & fasilitas adalah sampel dan dapat dikonfirmasi langsung ke pihak sekolah.</span>
              </div>

              {/* Metrik Statistik Sekolah */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-xs text-slate-400 block font-medium">Peserta Didik</span>
                  <strong className="text-lg font-bold text-[#1F6F5F]">
                    <AnimatedCounter to={selectedSchoolDetail.properties.jumlahSiswa} />
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-xs text-slate-400 block font-medium">Tenaga Pendidik</span>
                  <strong className="text-lg font-bold text-[#1F6F5F]">
                    <AnimatedCounter to={selectedSchoolDetail.properties.jumlahGuru} />
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-xs text-slate-400 block font-medium">Ruang Kelas</span>
                  <strong className="text-lg font-bold text-[#1F6F5F]">
                    <AnimatedCounter to={selectedSchoolDetail.properties.ruangKelas} />
                  </strong>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                  <span className="text-xs text-slate-400 block font-medium">Rasio Guru-Siswa</span>
                  <strong className="text-lg font-bold text-[#1F6F5F]">
                    1 : {Math.round(selectedSchoolDetail.properties.jumlahSiswa / selectedSchoolDetail.properties.jumlahGuru)}
                  </strong>
                </div>
              </div>

              {/* Fakta & Informasi */}
              <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Informasi Sekolah
                </h4>
                <div className="flex justify-between text-xs py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Nama Resmi</span>
                  <strong className="text-slate-800">{selectedSchoolDetail.properties.nama}</strong>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">NPSN</span>
                  <strong className="text-slate-800">{selectedSchoolDetail.properties.npsn}</strong>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Status Pengelolaan</span>
                  <strong className="text-slate-800">{selectedSchoolDetail.properties.status}</strong>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-slate-500">Koordinat SIG</span>
                  <strong className="text-slate-800 font-mono text-[11px]">
                    {selectedSchoolDetail.geometry.coordinates[1].toFixed(4)}, {selectedSchoolDetail.geometry.coordinates[0].toFixed(4)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  addToCompare(selectedSchoolDetail.properties);
                  setSelectedSchoolDetail(null);
                }}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition"
              >
                + Tambah ke Perbandingan
              </button>
              <button
                onClick={() => setSelectedSchoolDetail(null)}
                className="px-4 py-2 bg-[#1F6F5F] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOATING BOTTOM LEGEND ================= */}
      <div className="absolute bottom-5 left-4 z-10 pointer-events-none hidden md:block">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 pointer-events-auto flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1F6F5F] ring-2 ring-emerald-200 inline-block" />
            <span className="text-slate-700 font-medium">Negeri</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-amber-200 inline-block" />
            <span className="text-slate-700 font-medium">Swasta</span>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <span className="text-[11px] text-slate-400">Klik titik sekolah untuk aksi cepat</span>
        </div>
      </div>

      {/* ================= FLOATING BUTTON PERBANDINGAN ================= */}
      {comparedSchools.length > 0 && (
        <div className="absolute bottom-6 right-16 z-20 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="bg-[#1F6F5F] hover:bg-emerald-800 text-white font-medium px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs transition-all transform hover:scale-105 border border-emerald-400/30 backdrop-blur-md"
          >
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 size={16} /> Bandingkan Sekolah
            </span>
            <span className="bg-white text-[#1F6F5F] font-bold px-2 py-0.5 rounded-full text-[11px]">
              {comparedSchools.length}
            </span>
          </button>
        </div>
      )}

      {/* ================= MAP CANVAS ================= */}
      <main className="flex-1 w-full h-full relative">
        <MapCanvas onMapLoaded={() => setIsMapLoaded(true)} />
      </main>

      {/* ================= MODAL PERBANDINGAN ================= */}
      <CompareModal />
    </div>
  );
}
