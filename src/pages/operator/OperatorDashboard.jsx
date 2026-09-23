import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function OperatorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // State Simulasi Dataset GIS
  const [datasets, setDatasets] = useState([
    {
      id: 'DS-001',
      name: 'Data Sekolah DKI Jakarta 2026',
      category: 'Fasilitas Pendidikan',
      format: 'GeoJSON',
      featuresCount: 1420,
      updatedAt: '2026-09-10',
      status: 'Aktif',
    },
    {
      id: 'DS-002',
      name: 'Batas Wilayah Kecamatan',
      category: 'Batas Administrasi',
      format: 'GeoJSON',
      featuresCount: 44,
      updatedAt: '2026-08-25',
      status: 'Aktif',
    },
    {
      id: 'DS-003',
      name: 'Peta Rawan Banjir Disdik',
      category: 'Infrastruktur & Kebencanaan',
      format: 'KML',
      featuresCount: 18,
      updatedAt: '2026-07-14',
      status: 'Nonaktif',
    },
  ]);

  // State Modal / Form Upload
  const [isUploading, setIsUploading] = useState(false);
  const [newDataset, setNewDataset] = useState({
    name: '',
    category: 'Fasilitas Pendidikan',
    fileName: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleStatus = (id) => {
    setDatasets(prev =>
      prev.map(ds =>
        ds.id === id ? { ...ds, status: ds.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : ds
      )
    );
  };

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus dataset ini?')) {
      setDatasets(prev => prev.filter(ds => ds.id !== id));
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newDataset.name || !newDataset.fileName) return;

    const addedItem = {
      id: `DS-00${datasets.length + 1}`,
      name: newDataset.name,
      category: newDataset.category,
      format: newDataset.fileName.split('.').pop().toUpperCase() || 'GeoJSON',
      featuresCount: Math.floor(Math.random() * 500) + 50,
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'Aktif',
    };

    setDatasets([addedItem, ...datasets]);
    setNewDataset({ name: '', category: 'Fasilitas Pendidikan', fileName: '' });
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* TOPBAR NAVIGATION */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-amber-600 text-white p-2 rounded-lg font-bold text-xs">
            GIS
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">Dashboard Operator Data</h1>
            <p className="text-xs text-slate-500">SADAR EDU — Panel Pengelolaan Dataset Spasial</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-semibold text-slate-700">{user?.name || 'Operator GIS'}</span>
            <span className="block text-[10px] text-slate-400">{user?.email || 'admin.gis@jakarta.go.id'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* STATS SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Dataset</span>
            <div className="text-2xl font-bold text-slate-800 mt-1">{datasets.length} Berkas</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Layer Aktif di Peta</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {datasets.filter(d => d.status === 'Aktif').length} Layer
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Geometri Data</span>
            <div className="text-2xl font-bold text-[#1F6F5F] mt-1">
              {datasets.reduce((acc, curr) => acc + curr.featuresCount, 0).toLocaleString()} Objek
            </div>
          </div>
        </div>

        {/* DATASET MANAGEMENT TABLE HEADER */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-slate-800 text-base">Manajemen Layer Dataset</h2>
              <p className="text-xs text-slate-500">Unggah, aktifkan, atau perbarui dataset spasial wilayah.</p>
            </div>
            <button
              onClick={() => setIsUploading(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs px-4 py-2 rounded-lg shadow transition-colors flex items-center gap-2"
            >
              <span>+ Unggah Dataset Baru</span>
            </button>
          </div>

          {/* TABEL DATASET */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Nama Dataset</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Format</th>
                  <th className="py-3.5 px-4">Jumlah Fitur</th>
                  <th className="py-3.5 px-4">Terakhir Diperbarui</th>
                  <th className="py-3.5 px-4">Status Layer</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {datasets.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{item.name}</td>
                    <td className="py-3.5 px-4">{item.category}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {item.format}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{item.featuresCount.toLocaleString()} objek</td>
                    <td className="py-3.5 px-4">{item.updatedAt}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatus(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          item.status === 'Aktif'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* MODAL SIMULASI UPLOAD */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-1">Unggah Dataset Spasial</h3>
            <p className="text-xs text-slate-500 mb-4">Format yang didukung: GeoJSON, KML, CSV, Shapefile (.zip)</p>

            <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Dataset</label>
                <input
                  type="text"
                  required
                  placeholder="cth: Lokasi Posko Bencana Disdik"
                  value={newDataset.name}
                  onChange={(e) => setNewDataset({ ...newDataset, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Dataset</label>
                <select
                  value={newDataset.category}
                  onChange={(e) => setNewDataset({ ...newDataset, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Fasilitas Pendidikan">Fasilitas Pendidikan</option>
                  <option value="Batas Administrasi">Batas Administrasi</option>
                  <option value="Infrastruktur & Kebencanaan">Infrastruktur & Kebencanaan</option>
                  <option value="Demografi">Demografi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Berkas GIS</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setNewDataset({ ...newDataset, fileName: e.target.files[0]?.name || '' })}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow transition-colors"
                >
                  Simpan & Unggah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}