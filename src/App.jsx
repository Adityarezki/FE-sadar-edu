import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import MapCanvas from "./components/map/MapCanvas";
import SearchPanel from "./components/ui/SearchPanel";
import CompareModal from "./components/ui/CompareModal";
import { useMapStore } from "./store/useMapStore";

// Import Halaman Baru
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import StakeholderDashboard from "./pages/stakeholder/StakeholderDashboard";
import OperatorDashboard from "./pages/operator/OperatorDashboard";

// --- COMPONENT HALAMAN LANDING PAGE SEMENTARA ---
const Beranda = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
    <h1 className="text-2xl font-bold text-[#1F6F5F]">
      SADAR EDU - Landing Page
    </h1>
    <div className="flex gap-3">
      <Link
        to="/peta"
        className="px-6 py-2 bg-[#1F6F5F] text-white font-medium rounded-lg shadow hover:bg-emerald-700 transition-colors text-sm"
      >
        Jelajahi Peta 3D (Warga)
      </Link>
      <Link
        to="/login"
        className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg shadow-sm hover:bg-slate-100 transition-colors text-sm"
      >
        Login Stakeholder / Operator
      </Link>
    </div>
  </div>
);
const EksplorasiPeta = () => {
  const { comparedSchools, setIsCompareOpen } = useMapStore();

  return (
    <div className="relative w-full h-screen bg-[#F8FAFC]">
      <MapCanvas />

      <div className="absolute top-5 left-5 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-auto">
          <h2 className="text-[#1F6F5F] font-bold mb-2">Eksplorasi Warga</h2>
          <SearchPanel />
        </div>
      </div>

      {comparedSchools.length > 0 && (
        <div className="absolute bottom-8 right-16 z-20">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="bg-[#1F6F5F] hover:bg-emerald-800 text-white font-medium px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs transition-all transform hover:scale-105"
          >
            <span>Bandingkan Sekolah</span>
            <span className="bg-white text-[#1F6F5F] font-bold px-2 py-0.5 rounded-full">
              {comparedSchools.length}
            </span>
          </button>
        </div>
      )}

      <CompareModal />
    </div>
  );
};

// --- ROUTER UTAMA ---
export default function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased">
        <Routes>
          {/* LANDING PAGE UTAMA */}
          <Route path="/" element={<LandingPage />} />

          {/* FLOW WARGA */}
          <Route path="/peta" element={<EksplorasiPeta />} />

          {/* FLOW AUTENTIKASI */}
          <Route path="/login" element={<Login />} />

          {/* FLOW STAKEHOLDER */}
          <Route path="/stakeholder">
            <Route
              index
              element={<Navigate to="/stakeholder/dashboard" replace />}
            />
            <Route path="dashboard" element={<StakeholderDashboard />} />
          </Route>

          {/* FLOW OPERATOR */}
          <Route path="/operator">
            <Route
              index
              element={<Navigate to="/operator/dataset" replace />}
            />
            <Route path="dataset" element={<OperatorDashboard />} />
          </Route>

          {/* FALLBACK 404 */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center">
                404 - Halaman Tidak Ditemukan
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
