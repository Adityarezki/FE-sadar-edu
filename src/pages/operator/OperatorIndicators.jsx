import { useState } from 'react';
import { FileText, Clock, Search } from 'lucide-react';
import {
  BTN_OUTLINE,
  CARD,
  EMPTY,
  FOCUS,
  PageHeader,
  StatusPill,
  TD,
  TH,
} from '../../components/operator/ui';

const TABS = ['Indikator', 'Metadata', 'Log perubahan'];

const INDICATORS = [
  { name: 'Peserta didik', type: 'Numerik', source: 'Dataset sekolah', status: 'Belum tersedia' },
  { name: 'Guru', type: 'Numerik', source: 'Dataset sekolah', status: 'Belum tersedia' },
  { name: 'Ruang kelas', type: 'Kelompok', source: 'Dataset sekolah', status: 'Belum tersedia' },
  { name: 'Lokasi sekolah', type: 'Koordinat', source: 'Dataset sekolah', status: 'Belum tersedia' },
];

const LOGS = [
  { title: 'Perubahan skema', text: 'Belum ada peristiwa' },
  { title: 'Pemetaan kolom', text: 'Belum ada peristiwa' },
  { title: 'Keputusan review', text: 'Belum ada peristiwa' },
];

function IndicatorList() {
  const [query, setQuery] = useState('');
  const rows = INDICATORS.filter((row) =>
    `${row.name} ${row.type} ${row.source}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section aria-labelledby="judul-indikator" className={`${CARD} p-[17px]`}>
      <h2 id="judul-indikator" className="text-base font-semibold leading-6 text-[#173042]">
        Daftar indikator
      </h2>

      <label className="relative mt-4 block max-w-[420px]">
        <span className="sr-only">Cari indikator atau field</span>
        <Search
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#445665]"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari indikator atau field"
          className={`h-[38px] w-full rounded-lg border border-[#d7e1e8] bg-[#f8fafc] pl-10 pr-3 text-xs text-[#173042] placeholder:text-[#445665] ${FOCUS}`}
        />
      </label>

      <div
        role="region"
        aria-label="Tabel daftar indikator"
        tabIndex={0}
        className={`mt-5 overflow-x-auto ${FOCUS}`}
      >
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr>
              <th scope="col" className={`${TH} w-[34%]`}>Indikator</th>
              <th scope="col" className={`${TH} w-[17%]`}>Tipe</th>
              <th scope="col" className={`${TH} w-[25%]`}>Sumber</th>
              <th scope="col" className={`${TH} w-[24%]`}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className={TD}>Tidak ada indikator yang cocok.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.name}>
                  <th
                    scope="row"
                    className="border-b border-[#d7e1e8] px-3 py-[17px] text-sm font-semibold text-[#173042]"
                  >
                    {row.name}
                  </th>
                  <td className={TD}>{row.type}</td>
                  <td className={TD}>{row.source}</td>
                  <td className={TD}>{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#d7e1e8] bg-[#e8f3f0] px-4 py-3.5">
        <FileText size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#445665]" />
        <p className="text-xs leading-[18px] text-[#173042]">
          Definisi indikator harus mengikuti kontrak dataset dan provenance.
        </p>
      </div>
    </section>
  );
}

function EmptyTab({ title }) {
  return (
    <section className={`${CARD} p-[17px]`}>
      <h2 className="text-base font-semibold leading-6 text-[#173042]">{title}</h2>
      <p className="mt-1 text-xs leading-[18px] text-[#445665]">Belum ada data untuk ditampilkan.</p>
    </section>
  );
}

function LatestLog() {
  return (
    <section aria-labelledby="judul-log" className={`${CARD} p-[17px]`}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="judul-log" className="text-base font-semibold leading-6 text-[#173042]">
          Log terbaru
        </h2>
        <StatusPill>Peristiwa {EMPTY}</StatusPill>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {LOGS.map((log) => (
          <li
            key={log.title}
            className="flex items-start gap-3 rounded-lg border border-[#d7e1e8] bg-[#f8fafc] p-3.5"
          >
            <Clock size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#2c6e8e]" />
            <span>
              <span className="block text-sm font-semibold leading-5 text-[#173042]">{log.title}</span>
              <span className="mt-1 block text-xs leading-[18px] text-[#445665]">{log.text}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-lg border border-[#d7e1e8] bg-[#edf3f6] p-4 text-xs leading-[18px] text-[#445665]">
        Audit menyimpan siapa, kapan, apa yang berubah, dan versi terkait.
      </p>
    </section>
  );
}

export default function OperatorIndicators() {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-7">
      <PageHeader
        eyebrow="Data lainnya"
        title="Indikator, metadata, dan log"
        description="Tinjau definisi field, provenance, serta perubahan yang tercatat."
        action={
          <button type="button" className={`${BTN_OUTLINE} w-[172px]`}>
            Ekspor log
          </button>
        }
      />

      <div role="tablist" aria-label="Bagian data" className="flex flex-wrap gap-3">
        {TABS.map((name) => {
          const active = tab === name;
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(name)}
              className={`h-[42px] min-w-[132px] cursor-pointer rounded-lg border px-5 text-sm font-semibold transition-colors ${FOCUS} ${
                active
                  ? 'border-[#d7e1e8] bg-[#e8f3f0] text-[#1b4965]'
                  : 'border-[#d7e1e8] bg-white text-[#173042] hover:bg-[#edf3f6]'
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_344px]">
        <div role="tabpanel" className="min-w-0">
          {tab === 'Indikator' && <IndicatorList />}
          {tab === 'Metadata' && <EmptyTab title="Metadata" />}
          {tab === 'Log perubahan' && <EmptyTab title="Log perubahan" />}
        </div>
        <LatestLog />
      </div>
    </div>
  );
}