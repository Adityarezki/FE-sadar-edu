import React, { useState } from 'react';
import { useMapStore } from '../../store/useMapStore';
import { dummyDistricts } from '../../data/dummyDistrict';

export default function SearchPanel() {
  // Ambil state dan action dari Zustand
  const mapStore = useMapStore();
  const { activeLayers, toggleLayer, flyToRegion } = mapStore;

  const [selectedDistrict, setSelectedDistrict] = useState('');

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    
    if (!districtId) return;

    // Cari kecamatan berdasarkan ID (pasti kompatibel String & Number)
    const target = dummyDistricts.find((d) => String(d.id) === String(districtId));

    if (target && target.coordinates) {
      // Pengecekan aman: Cek apakah flyToRegion beneran ada sebagai fungsi
      if (typeof flyToRegion === 'function') {
        flyToRegion(target.coordinates[0], target.coordinates[1], target.zoom || 14);
      } else {
        console.error(
          'Fungsi flyToRegion belum dibuat di useMapStore.js! Isi mapStore saat ini:',
          mapStore
        );
      }
    }
  };

  return (
    <div className="w-72 flex flex-col gap-3 text-slate-800">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Cari Kecamatan (Bogor)
        </label>
        <select
          value={selectedDistrict}
          onChange={handleDistrictChange}
          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F] cursor-pointer shadow-sm"
        >
          <option value="">-- Pilih Wilayah --</option>
          {dummyDistricts.map((d) => (
            <option key={d.id} value={d.id}>
              Kecamatan {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className=" pt-3 flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Kontrol Peta
        </span>
        
        <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={activeLayers?.show3DBuildings || false}
            onChange={() => toggleLayer && toggleLayer('show3DBuildings')}
            className="w-4 h-4 rounded accent-[#1F6F5F]"
          />
          Bangunan 3D
        </label>

        <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={activeLayers?.showSchools || false}
            onChange={() => toggleLayer && toggleLayer('showSchools')}
            className="w-4 h-4 rounded accent-[#1F6F5F]"
          />
          Titik Sekolah Eksisting
        </label>
      </div>
    </div>
  );
}