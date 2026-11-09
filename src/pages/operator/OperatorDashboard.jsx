import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  Database,
  Eye,
  Funnel,
  GraduationCap,
  History,
  Layers,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Mountain,
  Network,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  TriangleAlert,
  Users,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

// TODO: ganti seluruh data contoh di bawah dengan data dari API backend.
const ago = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();

const SAMPLE_DATASETS = [
  {
    id: 'DS-001',
    icon: 'map',
    name: 'Batas Administrasi Kecamatan dan Desa',
    description: 'Batas wilayah resmi Bappedalitbang dan Kemendagri Kab. Bogor.',
    format: 'GeoJSON',
    records: '40 kecamatan, 435 desa',
    status: 'Terpublikasi',
    updatedAt: ago(1),
  },
  {
    id: 'DS-002',
    icon: 'school',
    name: 'Sebaran Titik Fasilitas SMP Negeri dan Swasta',
    description: 'Koordinat verifikasi lapangan Dapodik Disdik wilayah Barat dan Timur.',
    format: 'Shapefile',
    records: '1.428 sekolah',
    status: 'Menunggu Validasi',
    updatedAt: ago(20),
  },
  {
    id: 'DS-003',
    icon: 'users',
    name: 'Data Rombel dan Kuota PPDB Zonasi 2025/2026',
    description: 'Sinkronisasi tabular kapasitas rombel Dapodik semester baru.',
    format: 'CSV',
    records: '38.450 siswa',
    status: 'Draf Update',
    updatedAt: ago(24 * 180),
  },
  {
    id: 'DS-004',
    icon: 'terrain',
    name: 'Peta Tutupan Lahan dan Fasos/Fasum BPN',
    description: 'Data spasial pendukung keterjangkauan aksesibilitas jalan dan kontur.',
    format: 'KML',
    records: 'Wilayah Barat, 12 kecamatan',
    status: 'Terpublikasi',
    updatedAt: ago(24 * 182),
  },
];

const SYNC_SOURCES = [
  { name: 'Dapodik Kemdikbud', time: '06:00 WIB' },
  { name: 'GIS Simpul Jaringan BPN', time: '04:30 WIB' },
];

const INTEGRITY = { value: '99,4%', crs: 'WGS84 dan UTM 48S (EPSG:32748)' };

const DATASET_MODULE_STATS = [
  { value: '40', label: 'Kecamatan' },
  { value: '1.428', label: 'SMP terdata' },
  { value: '435', label: 'Desa / Kel.' },
];

const METADATA_MODULE_STATS = [
  { value: '12', label: 'Indikator IKIP' },
  { value: '54', label: 'Atribut baku' },
  { value: '100%', label: 'Log tervalidasi' },
];

const ROW_ICONS = { map: MapIcon, school: GraduationCap, users: Users, terrain: Mountain };

const STATUS_OPTIONS = ['Terpublikasi', 'Menunggu Validasi', 'Draf Update'];

const STATUS_STYLE = {
  Terpublikasi: 'bg-emerald-100 text-emerald-800',
  'Menunggu Validasi': 'bg-[#ffd9d6] text-[#ba1a1a]',
  'Draf Update': 'bg-[#d6ebff] text-[#00324b]',
};

const FORMAT_BY_EXTENSION = {
  geojson: 'GeoJSON',
  json: 'GeoJSON',
  kml: 'KML',
  csv: 'CSV',
  zip: 'Shapefile',
};

const PAGE_SIZE = 4;
const EMPTY_FORM = { name: '', category: 'Fasilitas Pendidikan', fileName: '' };

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00324b]';
const BTN_PRIMARY = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#00324b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1c4966] ${FOCUS_RING}`;
const BTN_SOFT = `inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#d6ebff]/60 px-4 py-2.5 text-sm font-semibold text-[#00324b] transition-colors hover:bg-[#d6ebff] ${FOCUS_RING}`;
const CARD = 'rounded-xl border border-slate-200 bg-white';

function formatUpdated(iso) {
  const date = new Date(iso);
  const time = date
    .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
    .replace('.', ':');
  if (date.toDateString() === new Date().toDateString()) return `Hari ini, ${time} WIB`;
  if (date.toDateString() === new Date(Date.now() - 86400000).toDateString()) {
    return `Kemarin, ${time} WIB`;
  }
  const day = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${day}, ${time} WIB`;
}

export default function OperatorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [datasets, setDatasets] = useState(SAMPLE_DATASETS);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const closeDialog = useCallback(() => {
    setDialog(null);
    setForm(EMPTY_FORM);
  }, []);

  const operatorName = user?.name ?? 'Operator';
  const initials = operatorName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleValidate = (id) => {
    setDatasets((prev) =>
      prev.map((ds) =>
        ds.id === id ? { ...ds, status: 'Terpublikasi', updatedAt: new Date().toISOString() } : ds
      )
    );
  };

  const handleDelete = (item) => {
    if (window.confirm(`Hapus dataset "${item.name}"?`)) {
      setDatasets((prev) => prev.filter((ds) => ds.id !== item.id));
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const extension = form.fileName.split('.').pop().toLowerCase();
    setDatasets((prev) => [
      {
        id: `DS-${Date.now()}`,
        icon: 'map',
        name: form.name,
        description: form.category,
        format: FORMAT_BY_EXTENSION[extension] ?? extension.toUpperCase(),
        records: 'Sedang diproses',
        status: 'Menunggu Validasi',
        updatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setPage(1);
    closeDialog();
  };

  const scrollToTable = () =>
    document.getElementById('dataset')?.scrollIntoView({ behavior: 'smooth' });

  const showValidationQueue = () => {
    setStatusFilter('Menunggu Validasi');
    setPage(1);
    scrollToTable();
  };

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return datasets.filter(
      (ds) =>
        (statusFilter === 'Semua' || ds.status === statusFilter) &&
        ds.name.toLowerCase().includes(keyword)
    );
  }, [datasets, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleDatasets = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pending = datasets.filter((ds) => ds.status === 'Menunggu Validasi');
  const tabularCount = datasets.filter((ds) => ds.format === 'CSV').length;

  return (
    <div
      data-lenis-prevent
      className="flex h-screen flex-col overflow-y-auto bg-[#f6f9ff] text-slate-800 [font-family:'Public_Sans',system-ui,sans-serif]"
    >
      <header className="bg-[#1c4966] text-white">
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-lg font-bold leading-tight">
                SADAR Edu
                <span className="hidden rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold md:inline">
                  Mode Operator Data
                </span>
              </p>
              <p className="truncate text-xs text-slate-200">
                Sistem Analisis Spasial dan Pemutakhiran Dataset Pendidikan Kab. Bogor
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs lg:flex">
            <LayoutDashboard size={14} aria-hidden="true" />
            <span>Dashboard Operator</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold">Manajemen Dataset dan Sinkronisasi</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{operatorName}</p>
              <p className="text-xs text-slate-200">Operator Data Spasial dan Dapodik</p>
            </div>
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold"
            >
              {initials}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/40 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:border-[#ba1a1a] hover:bg-[#ba1a1a] active:border-[#8f1313] active:bg-[#8f1313] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <LogOut size={16} aria-hidden="true" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="grid flex-1 lg:grid-cols-[16rem_1fr]">
        <aside className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4 lg:border-b-0 lg:border-r">
          <div>
            <p className="px-2 text-sm font-semibold text-[#1c4966]">Alur kerja data</p>
            <p className="px-2 text-xs text-slate-600">Siklus pemutakhiran GIS</p>
            <nav aria-label="Alur kerja data" className="mt-3 flex gap-2 overflow-x-auto lg:flex-col">
              <NavItem number={1} active>Dashboard Operator</NavItem>
              <NavItem number={2} onClick={() => setDialog('upload')}>Import / Update Dataset</NavItem>
              <NavItem number={3} onClick={showValidationQueue}>Validasi Data</NavItem>
              <NavItem number={4} disabled>Simpan dan Publish</NavItem>
            </nav>
          </div>

          <div className="rounded-xl bg-[#d6ebff]/50 p-4 lg:mt-auto">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#00324b]">
              <BookOpen size={16} aria-hidden="true" />
              Panduan Operator
            </p>
            <p className="mt-2 text-xs text-slate-700">
              Petunjuk integrasi Shapefile dan sinkronisasi koordinat Dapodik.
            </p>
            <p className="mt-3 flex justify-between text-xs font-semibold text-[#1c4966]">
              <span>Kab. Bogor</span>
              <span>TA 2025/2026</span>
            </p>
          </div>
        </aside>

        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="inline-flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="rounded-full bg-[#d6ebff] px-2.5 py-1 font-semibold text-[#00324b]">
                  Kabupaten Bogor, Sektor Pendidikan
                </span>
                <span>Siklus sinkronisasi Semester Ganjil 2025/2026</span>
              </p>
              <h1 className="mt-2 text-2xl font-bold text-[#00324b] sm:text-3xl">
                Dashboard Operator Data Spasial dan Dapodik, Kab. Bogor
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Pantau status dataset, layer spasial, dan antrean validasi data pendidikan TA
                2025/2026 untuk perencanaan zonasi dan alokasi sarpras.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setDialog('sync')} className={BTN_SOFT}>
                <History size={16} aria-hidden="true" />
                Lihat jadwal sinkronisasi
              </button>
              <button type="button" onClick={() => setDialog('upload')} className={BTN_PRIMARY}>
                <Plus size={16} aria-hidden="true" />
                Import dataset baru
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total dataset" icon={Layers}>
              <p className="text-4xl font-bold text-[#00324b]">
                {datasets.length} <span className="text-sm font-medium text-slate-600">dataset</span>
              </p>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                Spasial: {datasets.length - tabularCount}, tabular: {tabularCount}
              </p>
            </StatCard>

            <StatCard label="Status sinkronisasi" icon={RefreshCw}>
              <p className="text-2xl font-bold text-[#00324b]">Online, terjadwal</p>
              <ul className="mt-3 space-y-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                {SYNC_SOURCES.map((source) => (
                  <li key={source.name} className="flex justify-between gap-2">
                    <span>{source.name}</span>
                    <span className="font-semibold">{source.time}</span>
                  </li>
                ))}
              </ul>
            </StatCard>

            <StatCard label="Antrean validasi" icon={ClipboardList} alert={pending.length > 0}>
              <p className={`text-4xl font-bold ${pending.length > 0 ? 'text-[#ba1a1a]' : 'text-[#00324b]'}`}>
                {pending.length}{' '}
                <span className="text-sm font-medium text-slate-600">berkas menunggu</span>
              </p>
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                {pending.length > 0 ? (
                  <>
                    <TriangleAlert size={14} className="mt-0.5 shrink-0 text-[#ba1a1a]" aria-hidden="true" />
                    <span>Berikutnya: {pending[0].name}</span>
                  </>
                ) : (
                  <span>Tidak ada antrean</span>
                )}
              </p>
            </StatCard>

            <StatCard label="Integritas data spasial" icon={ShieldCheck}>
              <p className="text-4xl font-bold text-[#00324b]">
                {INTEGRITY.value}{' '}
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 align-middle text-xs font-semibold text-emerald-800">
                  Optimal
                </span>
              </p>
              <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                CRS terverifikasi: {INTEGRITY.crs}
              </p>
            </StatCard>
          </div>

          <section aria-labelledby="judul-alur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="judul-alur" className="text-xl font-bold text-[#00324b]">
                  Pilih alur kerja operasional
                </h2>
                <p className="text-sm text-slate-600">
                  Tentukan jalur kerja data sesuai diagram alir manajemen sistem SADAR Edu.
                </p>
              </div>
              <button type="button" onClick={() => setDialog('guide')} className={BTN_SOFT}>
                <Network size={16} aria-hidden="true" />
                Panduan memilih modul
              </button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <ModuleCard
                icon={Database}
                dark
                title="Modul Manajemen Dataset"
                description="Import berkas GIS (Shapefile, GeoJSON, KML), pembaruan layer zonasi wilayah, sinkronisasi tabular Dapodik, konversi proyeksi koordinat CRS, serta validasi topologi data."
                stats={DATASET_MODULE_STATS}
              >
                <button type="button" onClick={scrollToTable} className={`${BTN_PRIMARY} w-full`}>
                  Buka modul dataset
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </ModuleCard>

              <ModuleCard
                icon={SlidersHorizontal}
                title="Modul Indikator, Metadata dan Log"
                description="Kelola kamus data, kustomisasi bobot parameter skoring MCDA/IKIP (Indeks Kebutuhan Intervensi Pendidikan), tinjau riwayat perubahan atribut, dan inspeksi audit aktivitas log operator."
                stats={METADATA_MODULE_STATS}
              >
                <button
                  type="button"
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-[#d6ebff]/60 px-4 py-2.5 text-sm font-semibold text-[#00324b] opacity-70"
                >
                  Segera hadir
                </button>
              </ModuleCard>
            </div>
          </section>

          <section id="dataset" className={CARD}>
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#00324b]">Ringkasan pemutakhiran dataset terkini</h2>
                <p className="text-sm text-slate-600">
                  Catatan berkas layer geospasial dan rekonsiliasi Dapodik yang baru diperbarui atau
                  membutuhkan tindakan operasional.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <label htmlFor="cari-dataset" className="sr-only">Cari nama layer</label>
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <input
                    id="cari-dataset"
                    type="search"
                    placeholder="Cari nama layer"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    className={`w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm placeholder:text-slate-500 ${FOCUS_RING}`}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="filter-status" className="sr-only">Filter status</label>
                  <Funnel
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <select
                    id="filter-status"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className={`w-full cursor-pointer rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm ${FOCUS_RING}`}
                  >
                    <option value="Semua">Semua status</option>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-[#d6ebff]/60 text-xs font-semibold tracking-wide text-[#00324b]">
                  <tr>
                    <th scope="col" className="px-5 py-3">Nama dataset dan deskripsi</th>
                    <th scope="col" className="px-3 py-3">Format</th>
                    <th scope="col" className="px-3 py-3">Jumlah rekor</th>
                    <th scope="col" className="px-3 py-3">Status publikasi</th>
                    <th scope="col" className="px-3 py-3">Waktu update</th>
                    <th scope="col" className="px-5 py-3 text-right">Aksi operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleDatasets.map((item) => {
                    const RowIcon = ROW_ICONS[item.icon] ?? MapIcon;
                    const isPending = item.status === 'Menunggu Validasi';
                    return (
                      <tr key={item.id} className={isPending ? 'bg-red-50/50' : undefined}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-start gap-3">
                            <span
                              aria-hidden="true"
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                isPending ? 'bg-[#ffd9d6] text-[#ba1a1a]' : 'bg-[#d6ebff] text-[#00324b]'
                              }`}
                            >
                              <RowIcon size={18} />
                            </span>
                            <div>
                              <p className="font-semibold text-slate-800">{item.name}</p>
                              <p className="text-xs text-slate-600">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3.5">
                          <span className="rounded bg-[#d6ebff]/60 px-2 py-0.5 text-xs font-medium text-[#00324b]">
                            {item.format}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 font-semibold text-slate-700">{item.records}</td>
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[item.status]}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-slate-700">{formatUpdated(item.updatedAt)}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setDialog({ detail: item })}
                              aria-label={`Lihat detail ${item.name}`}
                              className={`cursor-pointer rounded-lg p-2 text-[#1c4966] transition-colors hover:bg-[#d6ebff] ${FOCUS_RING}`}
                            >
                              <Eye size={18} aria-hidden="true" />
                            </button>
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => handleValidate(item.id)}
                                aria-label={`Validasi ${item.name}`}
                                className={`cursor-pointer rounded-lg bg-[#ba1a1a] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#8f1313] ${FOCUS_RING}`}
                              >
                                Validasi sekarang
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              aria-label={`Hapus ${item.name}`}
                              className={`cursor-pointer rounded-lg p-2 text-[#ba1a1a] transition-colors hover:bg-[#ffd9d6] ${FOCUS_RING}`}
                            >
                              <Trash2 size={18} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-slate-700">
                    Tidak ada dataset yang cocok dengan pencarian atau filter ini.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setStatusFilter('Semua');
                      setPage(1);
                    }}
                    className={`${BTN_SOFT} mt-3`}
                  >
                    Hapus pencarian dan filter
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-600">
                Menampilkan <strong>{visibleDatasets.length}</strong> dari{' '}
                <strong>{filtered.length}</strong> dataset layer terdaftar
              </p>
              {totalPages > 1 && (
                <nav aria-label="Halaman tabel" className="flex items-center gap-1 text-xs font-semibold">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                    className={`cursor-pointer rounded-lg bg-[#d6ebff]/60 px-3 py-1.5 text-[#00324b] disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
                  >
                    Sebelumnya
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setPage(number)}
                      aria-current={number === currentPage ? 'page' : undefined}
                      aria-label={`Halaman ${number}`}
                      className={`cursor-pointer rounded-lg px-3 py-1.5 ${FOCUS_RING} ${
                        number === currentPage
                          ? 'bg-[#00324b] text-white'
                          : 'bg-[#d6ebff]/60 text-[#00324b] hover:bg-[#d6ebff]'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    className={`cursor-pointer rounded-lg bg-[#d6ebff]/60 px-3 py-1.5 text-[#00324b] disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
                  >
                    Berikutnya
                  </button>
                </nav>
              )}
            </div>
            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-600">
              Data contoh: angka, daftar, dan jadwal di halaman ini belum tersambung ke server.
            </p>
          </section>
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white px-4 py-4 text-xs text-slate-600 sm:px-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>Sinkronisasi basis data spasial dan Dapodik Kabupaten Bogor: online</p>
          <p>Format data: Shapefile, GeoJSON, dan CSV Dapodik</p>
          <p>
            &copy; {new Date().getFullYear()} Dinas Pendidikan dan Bappedalitbang Kab. Bogor
          </p>
        </div>
      </footer>

      {dialog === 'upload' && (
        <UploadDialog
          form={form}
          onChange={setForm}
          onSubmit={handleUploadSubmit}
          onClose={closeDialog}
        />
      )}
      {dialog === 'sync' && (
        <Dialog title="Jadwal sinkronisasi" onClose={closeDialog}>
          <p className="mt-1 text-sm text-slate-600">
            Sumber data yang disinkronkan otomatis setiap hari.
          </p>
          <ul className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 text-sm">
            {SYNC_SOURCES.map((source) => (
              <li key={source.name} className="flex justify-between gap-3 px-4 py-3">
                <span>{source.name}</span>
                <span className="font-semibold">{source.time}</span>
              </li>
            ))}
          </ul>
          <DialogClose onClose={closeDialog} />
        </Dialog>
      )}
      {dialog === 'guide' && (
        <Dialog title="Panduan memilih modul" onClose={closeDialog}>
          <div className="mt-3 space-y-3 text-sm text-slate-700">
            <p>
              <strong>Modul Manajemen Dataset:</strong> pilih bila Anda akan mengimpor,
              memperbarui, atau memvalidasi berkas layer dan data tabular.
            </p>
            <p>
              <strong>Modul Indikator, Metadata dan Log:</strong> pilih bila Anda perlu mengubah
              kamus data, bobot skoring, atau memeriksa riwayat aktivitas. Modul ini belum tersedia.
            </p>
          </div>
          <DialogClose onClose={closeDialog} />
        </Dialog>
      )}
      {dialog?.detail && (
        <Dialog title="Detail dataset" onClose={closeDialog}>
          <dl className="mt-4 space-y-3 text-sm">
            <DetailRow label="Nama">{dialog.detail.name}</DetailRow>
            <DetailRow label="Deskripsi">{dialog.detail.description}</DetailRow>
            <DetailRow label="Format">{dialog.detail.format}</DetailRow>
            <DetailRow label="Jumlah rekor">{dialog.detail.records}</DetailRow>
            <DetailRow label="Status">{dialog.detail.status}</DetailRow>
            <DetailRow label="Diperbarui">{formatUpdated(dialog.detail.updatedAt)}</DetailRow>
          </dl>
          <DialogClose onClose={closeDialog} />
        </Dialog>
      )}
    </div>
  );
}

function NavItem({ number, active = false, disabled = false, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-current={active ? 'page' : undefined}
      className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${FOCUS_RING} ${
        active
          ? 'bg-[#d6ebff] text-[#00324b]'
          : disabled
            ? 'cursor-not-allowed text-slate-500'
            : 'cursor-pointer text-slate-700 hover:bg-slate-100'
      }`}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d6ebff] text-xs text-[#00324b]">
        {number}
      </span>
      <span>
        {children}
        {disabled && <span className="block text-xs font-normal">Segera hadir</span>}
      </span>
    </button>
  );
}

function StatCard({ label, icon: Icon, alert = false, children }) {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#1c4966]">{label}</p>
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            alert ? 'bg-[#ffd9d6] text-[#ba1a1a]' : 'bg-[#d6ebff] text-[#00324b]'
          }`}
        >
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ModuleCard({ icon: Icon, dark = false, title, description, stats, children }) {
  return (
    <section className={`${CARD} flex flex-col p-5`}>
      <span
        aria-hidden="true"
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          dark ? 'bg-[#00324b] text-white' : 'bg-[#1c4966] text-white'
        }`}
      >
        <Icon size={22} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-[#00324b]">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <dl className="mt-4 grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-[#d6ebff]/40 px-2 py-3 text-center">
            <dt className="order-2 text-xs text-slate-700">{stat.label}</dt>
            <dd className="text-lg font-bold text-[#00324b]">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto pt-5">{children}</div>
    </section>
  );
}

function Dialog({ title, onClose, focusRef, children }) {
  const boxRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    (focusRef?.current ?? boxRef.current)?.focus();
  }, [focusRef]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={boxRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl outline-none"
      >
        <h2 id={titleId} className="text-lg font-bold text-[#00324b]">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function DialogClose({ onClose }) {
  return (
    <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
      <button type="button" onClick={onClose} className={BTN_SOFT}>
        Tutup
      </button>
    </div>
  );
}

function DetailRow({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-600">{label}</dt>
      <dd className="text-slate-800">{children}</dd>
    </div>
  );
}

function UploadDialog({ form, onChange, onSubmit, onClose }) {
  const nameRef = useRef(null);
  const fieldClass = `w-full rounded-lg border border-slate-300 px-3 py-2 text-sm ${FOCUS_RING}`;

  return (
    <Dialog title="Import dataset baru" onClose={onClose} focusRef={nameRef}>
      <p className="mt-1 text-sm text-slate-600">
        Format yang didukung: GeoJSON, KML, CSV, dan Shapefile (.zip). Untuk sementara berkas hanya
        masuk ke daftar di halaman ini dan belum dikirim ke server.
      </p>

      <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
        <div>
          <label htmlFor="nama-dataset" className="mb-1 block text-sm font-semibold">Nama dataset</label>
          <input
            id="nama-dataset"
            ref={nameRef}
            type="text"
            required
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="kategori-dataset" className="mb-1 block text-sm font-semibold">Kategori</label>
          <select
            id="kategori-dataset"
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            className={`${fieldClass} cursor-pointer bg-white`}
          >
            <option>Fasilitas Pendidikan</option>
            <option>Batas Administrasi</option>
            <option>Infrastruktur dan Kebencanaan</option>
            <option>Demografi</option>
          </select>
        </div>

        <div>
          <label htmlFor="berkas-gis" className="mb-1 block text-sm font-semibold">Berkas GIS</label>
          <input
            id="berkas-gis"
            type="file"
            required
            accept=".geojson,.json,.kml,.csv,.zip"
            onChange={(e) => onChange({ ...form, fileName: e.target.files[0]?.name ?? '' })}
            className={`${fieldClass} cursor-pointer`}
          />
        </div>

        <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button type="button" onClick={onClose} className={BTN_SOFT}>
            Batal
          </button>
          <button type="submit" className={BTN_PRIMARY}>
            Tambahkan ke daftar
          </button>
        </div>
      </form>
    </Dialog>
  );
}