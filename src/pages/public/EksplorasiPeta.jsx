import React from "react";
import MapCanvas from "../../components/map/MapCanvas";
import SearchPanel from "../../components/ui/SearchPanel";

export default function EksplorasiPeta() {
  return (
    <div className="relative w-full h-screen bg-[#F8FAFC]">
      <MapCanvas />

      <div className="absolute top-5 left-5 z-10 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-auto">
          <h2 className="text-[#1F6F5F] font-bold text-lg">Eksplorasi Warga</h2>

          {/* Memasukkan komponen UI Panel di sini */}
          <SearchPanel />
        </div>
      </div>
    </div>
  );
}
