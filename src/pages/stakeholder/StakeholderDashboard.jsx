import React from "react";
import { useNavigate } from "react-router-dom";
import MapCanvas from "../../components/map/MapCanvas";
import { useAuthStore } from "../../store/useAuthStore";
import { useMapStore } from "../../store/useMapStore";

export default function StakeholderDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { mcdaWeights, setMcdaWeights } = useMapStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSliderChange = (key, value) => {
    setMcdaWeights({
      ...mcdaWeights,
      [key]: Number(value),
    });
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR ANALISIS */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shadow-md">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFC]">
          <div>
            <h1 className="font-bold text-[#1F6F5F] text-base">
              Dashboard Analisis
            </h1>
            <p className="text-xs text-slate-500">
              {user?.name || "Stakeholder Disdik"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Keluar
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-6 text-slate-800">
          <div>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Simulasi Kriteria (MCDA)
            </h2>
            <p className="text-xs text-slate-400">
              Geser bobot untuk memperbarui indikator warna peta secara
              langsung.
            </p>
          </div>

          {/* Slider 1: Kepadatan Usia Sekolah */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-medium">
              <span>Kepadatan Usia Sekolah</span>
              <span className="text-[#1F6F5F] font-bold">
                {mcdaWeights.demokrasi}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mcdaWeights.demokrasi}
              onChange={(e) => handleSliderChange("demokrasi", e.target.value)}
              className="accent-[#1F6F5F] cursor-pointer"
            />
          </div>

          {/* Slider 2: Aksesibilitas */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-medium">
              <span>Jarak / Aksesibilitas</span>
              <span className="text-[#1F6F5F] font-bold">
                {mcdaWeights.aksesibilitas}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mcdaWeights.aksesibilitas}
              onChange={(e) =>
                handleSliderChange("aksesibilitas", e.target.value)
              }
              className="accent-[#1F6F5F] cursor-pointer"
            />
          </div>

          {/* Slider 3: RTRW */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-medium">
              <span>Kesesuaian Lahan (RTRW)</span>
              <span className="text-[#1F6F5F] font-bold">
                {mcdaWeights.rtrw}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={mcdaWeights.rtrw}
              onChange={(e) => handleSliderChange("rtrw", e.target.value)}
              className="accent-[#1F6F5F] cursor-pointer"
            />
          </div>

          {/* Legenda Warna Peta */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-600 block mb-2">
              Tingkat Defisit Sekolah
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-600">
              <span>Rendah</span>
              <div className="flex-1 h-3 rounded bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500"></div>
              <span>Tinggi</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAP AREA */}
      <main className="flex-1 relative h-full">
        <MapCanvas />
      </main>
    </div>
  );
}
    