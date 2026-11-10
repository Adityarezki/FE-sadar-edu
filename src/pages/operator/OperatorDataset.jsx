import { useMemo, useRef, useState } from 'react';
import { Check, Database, Search } from 'lucide-react';
import { useOperatorStore } from '../../store/useOperatorStore';
import {
  BTN_PRIMARY,
  CARD,
  Dialog,
  EMPTY,
  FOCUS,
  PageHeader,
  StatusPill,
  TD,
  TH,
} from '../../components/operator/Ui';

const REQUIREMENTS = [
  { title: 'NPSN', text: 'String; nol di depan dipertahankan' },
  { title: 'Identitas', text: 'Nama sekolah wajib' },
  { title: 'Koordinat', text: 'Boleh kosong; invalid tanpa marker' },
  { title: 'Numerik', text: 'Null tidak diubah menjadi 0' },
  { title: 'Provenance', text: 'Sumber, periode, cakupan, lisensi' },
];

const TEMPLATE_ROW = {
  id: 'template',
  name: 'Template skema SADAR EDU',
  source: 'Internal',
  period: EMPTY,
  status: 'Siap digunakan',
};

const PLACEHOLDER_ROW = {
  id: 'placeholder',
  name: 'Belum ada dataset',
  source: EMPTY,
  period: EMPTY,
  status: 'Belum tersedia',
};

const STATUS_FILTERS = ['Menunggu validasi', 'Siap digunakan', 'Belum tersedia'];
const EMPTY_FORM = { fileName: '', name: '', source: '', period: '' };

const fieldClass = `h-11 w-full rounded-lg border border-[#d7e1e8] bg-white px-[13px] text-sm text-[#173042] placeholder:text-[#445665] ${FOCUS}`;

export default function OperatorDataset() {
  const versions = useOperatorStore((state) => state.versions);
  const importVersion = useOperatorStore((state) => state.importVersion);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const rows = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const all = [...versions, ...(versions.length === 0 ? [PLACEHOLDER_ROW] : []), TEMPLATE_ROW];
    return all.filter(
      (row) =>
        (statusFilter === '' || row.status === statusFilter) &&
        `${row.name} ${row.source}`.toLowerCase().includes(keyword)
    );
  }, [versions, query, statusFilter]);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-7">
      <PageHeader
        eyebrow="Dataset"
        title="Kelola dataset sekolah"
        description="Pilih versi sumber, periksa metadata, lalu mulai impor atau pembaruan."
        action={
          <button
            type="button"
            onClick={() => setIsImporting(true)}
            className={`${BTN_PRIMARY} w-[172px]`}
          >
            Impor / perbarui
          </button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] max-w-[620px] flex-1">
          <label htmlFor="cari-dataset" className="sr-only">Cari nama file atau versi dataset</label>
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-[#445665]"
          />
          <input
            id="cari-dataset"
            type="search"
            placeholder="Cari nama file atau versi dataset"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`h-11 w-full rounded-lg border border-[#d7e1e8] bg-white pl-[43px] pr-3 text-xs placeholder:text-[#445665] ${FOCUS}`}
          />
        </div>
        <div>
          <label htmlFor="filter-dataset" className="sr-only">Filter status</label>
          <select
            id="filter-dataset"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`h-[42px] cursor-pointer rounded-lg border border-[#d7e1e8] bg-white px-3 text-sm font-semibold text-[#173042] ${FOCUS}`}
          >
            <option value="">Filter: semua</option>
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          <StatusPill>Belum terhubung</StatusPill>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section aria-labelledby="judul-versi" className={`${CARD} min-w-0 p-[17px]`}>
          <h2 id="judul-versi" className="text-base font-semibold leading-6">Versi dataset</h2>
          <p className="text-xs leading-[18px] text-[#445665]">Riwayat sumber dan status pemrosesan.</p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr>
                  <th scope="col" className={`${TH} w-[34%]`}>Nama / versi</th>
                  <th scope="col" className={`${TH} w-[23%]`}>Sumber</th>
                  <th scope="col" className={`${TH} w-[18%]`}>Periode</th>
                  <th scope="col" className={`${TH} w-[25%]`}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className={TD}>{row.name}</td>
                    <td className={TD}>{row.source}</td>
                    <td className={TD}>{row.period}</td>
                    <td
                      className={`${TD} ${
                        row.status === 'Siap digunakan' ? 'text-[#126552]' : ''
                      } ${row.status === 'Belum tersedia' ? 'text-[#445665]' : ''}`}
                    >
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && (
              <p className="px-3 py-6 text-center text-xs text-[#445665]">
                Tidak ada versi dataset yang cocok dengan pencarian atau filter ini.
              </p>
            )}
          </div>

          {versions.length === 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-4 rounded-lg border border-[#d7e1e8] bg-[#edf3f6] p-6">
              <Database size={34} aria-hidden="true" className="shrink-0 text-[#2c6e8e]" />
              <div className="min-w-[200px] flex-1">
                <h3 className="text-base font-semibold leading-6">Hubungkan dataset pertama</h3>
                <p className="text-xs leading-[18px] text-[#445665]">
                  Impor CSV atau XLSX, lalu petakan kolom wajib.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsImporting(true)}
                className={`${BTN_PRIMARY} w-[170px]`}
              >
                Mulai impor
              </button>
            </div>
          )}
        </section>

        <section aria-labelledby="judul-syarat" className={`${CARD} p-[17px]`}>
          <h2 id="judul-syarat" className="text-base font-semibold leading-6">Persyaratan sumber</h2>
          <p className="text-xs leading-[18px] text-[#445665]">Selesaikan sebelum validasi.</p>
          <ul className="mt-5 flex flex-col gap-2.5">
            {REQUIREMENTS.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-3 rounded-lg border border-[#d7e1e8] bg-[#f9fafb] p-3"
              >
                <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#126552]" />
                <span>
                  <span className="block text-sm font-semibold leading-5">{item.title}</span>
                  <span className="block text-[11px] font-medium leading-4 text-[#445665]">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {isImporting && (
        <ImportDialog
          onClose={() => setIsImporting(false)}
          onSubmit={(data) => {
            importVersion(data);
            setIsImporting(false);
          }}
        />
      )}
    </div>
  );
}

function ImportDialog({ onClose, onSubmit }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      fileName: file.name,
      name: prev.name || file.name.replace(/\.[^.]+$/, ''),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      fileName: form.fileName,
      name: form.name.trim(),
      source: form.source.trim(),
      period: form.period.trim(),
    });
  };

  return (
    <Dialog title="Impor dataset sekolah" onClose={onClose} focusRef={fileRef}>
      <p className="mt-1 text-xs leading-[18px] text-[#445665]">
        Format yang didukung: CSV dan XLSX. Berkas belum dikirim ke server, jadi versi hanya tercatat
        di halaman ini. Pemetaan kolom wajib dan validasi berjalan setelah server tersambung.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div>
          <label htmlFor="impor-berkas" className="mb-1.5 block text-[11px] font-medium text-[#445665]">
            Berkas dataset
          </label>
          <input
            id="impor-berkas"
            ref={fileRef}
            type="file"
            required
            accept=".csv,.xlsx"
            onChange={handleFile}
            className={`${fieldClass} h-auto cursor-pointer py-2.5 text-xs`}
          />
        </div>
        <div>
          <label htmlFor="impor-nama" className="mb-1.5 block text-[11px] font-medium text-[#445665]">
            Nama / versi
          </label>
          <input
            id="impor-nama"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="impor-sumber" className="mb-1.5 block text-[11px] font-medium text-[#445665]">
            Sumber
          </label>
          <input
            id="impor-sumber"
            type="text"
            required
            placeholder="Contoh: Dapodik Kemdikbud"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="impor-periode" className="mb-1.5 block text-[11px] font-medium text-[#445665]">
            Periode
          </label>
          <input
            id="impor-periode"
            type="text"
            required
            placeholder="Contoh: Semester ganjil 2025/2026"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            className={fieldClass}
          />
        </div>

        <div className="mt-1 flex justify-end gap-2 border-t border-[#d7e1e8] pt-4">
          <button
            type="button"
            onClick={onClose}
            className={`h-[42px] cursor-pointer rounded-lg border border-[#d7e1e8] bg-white px-5 text-sm font-semibold text-[#173042] hover:bg-[#edf3f6] ${FOCUS}`}
          >
            Batal
          </button>
          <button type="submit" className={BTN_PRIMARY}>
            Tambahkan versi
          </button>
        </div>
      </form>
    </Dialog>
  );
}