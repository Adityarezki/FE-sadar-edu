import { useState } from 'react';

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/figma/logo-sadar.svg';
import {
  Bell,
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  FileText,
  House,
  LogOut,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { FOCUS } from './ui';


// Item tanpa `to` belum punya halaman, jadi tampil nonaktif.
const NAV_ITEMS = [
  { label: 'Ringkasan', title: 'Dashboard', to: '/operator/dashboard', icon: House },
  { label: 'Dataset sekolah', title: 'Dataset sekolah', to: '/operator/dataset', icon: Database },
  { label: 'Validasi data', icon: ShieldCheck },
  { label: 'Indikator & metadata', icon: ChartColumn },
  { label: 'Status pengajuan', icon: Clock },
];

function BrandMark() {
  const [failed, setFailed] = useState(false);

  return (
    <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-[10px]">
      {failed ? (
        <span className="flex h-full w-full items-center justify-center bg-[#1b4965] text-white">
          <House size={18} aria-hidden="true" />
        </span>
      ) : (
        <img
          src={logo}
          alt=""
          width="34"
          height="34"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export default function OperatorLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 1024);

  const pageTitle = NAV_ITEMS.find((item) => item.to === pathname)?.title ?? 'Ruang kerja operator';
  const hide = collapsed ? 'sr-only' : '';
  const itemShape = `relative flex h-[42px] items-center rounded-lg text-xs ${
    collapsed ? 'justify-center' : 'gap-[13px] px-[14px]'
  }`;

  const handleLogout = () => {
    logout();
    navigate('/operator/login');
  };

  return (
    <div className="h-screen bg-[#edf3f6] p-3 text-[#173042] [font-family:'Public_Sans',system-ui,sans-serif] sm:p-6">
      <div className="flex h-full min-h-0 overflow-hidden rounded-[20px] border border-[#d7e1e8] bg-white shadow-[0_12px_30px_rgba(10,36,51,0.1)] sm:rounded-[28px]">
        <aside
          className={`flex shrink-0 flex-col overflow-y-auto border-r border-[#d7e1e8] bg-white transition-[width] duration-200 motion-reduce:transition-none ${
            collapsed ? 'w-[76px]' : 'w-[230px]'
          }`}
        >
          <div
            className={`flex pt-[22px] ${
              collapsed ? 'flex-col items-center gap-3' : 'items-start justify-between px-[22px]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BrandMark />
              <span className={`text-base font-semibold leading-6 text-[#1b4965] ${hide}`}>
                SADAR EDU
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              aria-expanded={!collapsed}
              aria-label={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
              className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[#d7e1e8] bg-[#edf3f6] text-[#445665] transition-colors hover:bg-[#e1eaee] ${FOCUS}`}
            >
              {collapsed ? (
                <ChevronRight size={18} aria-hidden="true" />
              ) : (
                <ChevronLeft size={18} aria-hidden="true" />
              )}
            </button>
          </div>

          <p className={`mt-[26px] px-[22px] text-[11px] font-medium leading-4 text-[#445665] ${hide}`}>
            MENU
          </p>
          <nav
            aria-label="Menu operator"
            className={`mt-3 flex flex-col gap-2 ${collapsed ? 'px-3' : 'px-5'}`}
          >
            {NAV_ITEMS.map(({ label, to, icon: Icon }) =>
              to ? (
                <NavLink
                  key={label}
                  to={to}
                  title={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    `${itemShape} ${FOCUS} ${
                      isActive
                        ? 'bg-[#e8f3f0] text-[#1b4965] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-sm before:bg-[#3fa796]'
                        : 'text-[#445665] hover:bg-[#edf3f6]'
                    }`
                  }
                >
                  <Icon size={17} aria-hidden="true" className="shrink-0" />
                  <span className={hide}>{label}</span>
                </NavLink>
              ) : (
                <button
                  key={label}
                  type="button"
                  disabled
                  title="Segera hadir"
                  className={`${itemShape} w-full cursor-not-allowed text-left text-[#445665] opacity-70`}
                >
                  <Icon size={17} aria-hidden="true" className="shrink-0" />
                  <span className={hide}>{label}</span>
                  <span className="sr-only">, segera hadir</span>
                </button>
              )
            )}
          </nav>

          <div className={`mt-auto pb-4 pt-8 ${collapsed ? 'px-3' : 'px-5'}`}>
            <p className={`px-0.5 text-[11px] font-medium leading-4 text-[#445665] ${hide}`}>AKUN</p>
            <div className="my-3 h-px bg-[#d7e1e8]" />
            <button
              type="button"
              onClick={handleLogout}
              aria-label={collapsed ? 'Keluar dari akun' : undefined}
              className={`flex h-[46px] w-full cursor-pointer items-center rounded-lg border border-[#a12b31] bg-[#fff0f0] text-sm font-semibold text-[#a12b31] transition-colors hover:bg-[#ffe3e3] active:bg-[#ffd6d6] ${
                collapsed ? 'justify-center' : 'gap-3.5 px-[13px]'
              } ${FOCUS}`}
            >
              <LogOut size={20} aria-hidden="true" className="shrink-0" />
              <span className={hide}>Keluar dari akun</span>
            </button>
            <button
              type="button"
              disabled
              title="Segera hadir"
              className={`mt-3 flex h-10 w-full cursor-not-allowed items-center text-xs text-[#445665] opacity-70 ${
                collapsed ? 'justify-center' : 'gap-2.5 px-3'
              }`}
            >
              <FileText size={16} aria-hidden="true" className="shrink-0" />
              <span className={hide}>Panduan operator</span>
              <span className="sr-only">, segera hadir</span>
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[76px] shrink-0 items-center gap-3 border-b border-[#d7e1e8] bg-white px-4 sm:px-7">
            <p className="mr-auto truncate text-xl font-semibold leading-7">{pageTitle}</p>

            <div className="relative hidden md:block">
              <label htmlFor="cari-menu" className="sr-only">Cari menu atau data</label>
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-[#445665]"
              />
              <input
                id="cari-menu"
                type="search"
                disabled
                title="Segera hadir"
                placeholder="Cari menu atau data"
                className="h-[42px] w-[300px] cursor-not-allowed rounded-lg border border-[#d7e1e8] bg-[#f9fafb] pl-[43px] pr-3 text-xs placeholder:text-[#445665]"
              />
            </div>

            <button
              type="button"
              disabled
              aria-label="Notifikasi, segera hadir"
              title="Segera hadir"
              className="hidden h-[42px] w-[42px] cursor-not-allowed items-center justify-center rounded-lg border border-[#d7e1e8] bg-white text-[#445665] sm:flex"
            >
              <Bell size={18} aria-hidden="true" />
            </button>

            <div className="flex h-[50px] items-center gap-3 rounded-[10px] bg-[#edf3f6] pl-2 pr-4">
              <span
                aria-hidden="true"
                className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#1b4965] text-white"
              >
                <User size={18} />
              </span>
              <span className="hidden sm:block">
                <span className="block text-xs leading-[18px]">{user?.name ?? 'Operator data'}</span>
                <span className="block text-[11px] font-medium leading-4 text-[#445665]">
                  Ruang kerja internal
                </span>
              </span>
            </div>
          </header>

          <main data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto bg-[#f9fafb]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}