import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState('stakeholder');

  const handleLogin = (e) => {
    e.preventDefault();
    login(selectedRole);
    
    // Redirect sesuai role
    if (selectedRole === 'stakeholder') {
      navigate('/stakeholder/dashboard');
    } else {
      navigate('/operator/dataset');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1F6F5F]">SADAR EDU</h1>
          <p className="text-xs text-slate-500 mt-1">Sistem Analisis Distribusi & Aksebilitas Ruang Edukasi</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          {/* Radio / Selector Role Simulasi */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Pilih Akses Masuk
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('stakeholder')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  selectedRole === 'stakeholder'
                    ? 'bg-[#1F6F5F] text-white border-[#1F6F5F] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Stakeholder / Dinas
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedRole('operator')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  selectedRole === 'operator'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Operator Data
              </button>
            </div>
          </div>

          {/* Form Input Formal */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Instansi</label>
            <input 
              type="email" 
              defaultValue={selectedRole === 'stakeholder' ? 'disdik@jakarta.go.id' : 'admin.gis@jakarta.go.id'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kata Sandi</label>
            <input 
              type="password" 
              defaultValue="12345678"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1F6F5F]"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-[#1F6F5F] hover:bg-emerald-800 text-white font-medium rounded-lg text-sm shadow transition-colors"
          >
            Masuk ke Dashboard
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/peta" className="text-xs text-[#1F6F5F] hover:underline">
            ← Kembali ke Eksplorasi Warga
          </a>
        </div>

      </div>
    </div>
  );
}