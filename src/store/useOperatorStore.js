import { create } from 'zustand';

// TODO: ganti dengan data dari API backend. Untuk sementara tersimpan di memori
// browser dan hilang saat halaman dimuat ulang.

const fileLabel = (fileName) => fileName.replace(/\.[^.]+$/, '');

function upsertVersion(versions, draft, status, at) {
  const id = `V-${draft.fileName}`;
  const next = {
    id,
    name: fileLabel(draft.fileName),
    fileName: draft.fileName,
    source: null,
    period: null,
    status,
    updatedAt: at,
  };
  return versions.some((version) => version.id === id)
    ? versions.map((version) => (version.id === id ? next : version))
    : [next, ...versions];
}

export const useOperatorStore = create((set, get) => ({
  versions: [],
  activity: [],
  draft: null,
  validation: null,
  // Usulan perbaikan per temuan. Kunci: `${baris}:${kolom}`.
  corrections: {},

  saveDraft: (draft) => {
    const at = new Date().toISOString();
    set((state) => ({
      draft,
      versions: upsertVersion(state.versions, draft, 'Draf', at),
      activity: [
        { id: `A-${Date.now()}`, stage: 'Dataset', text: `Menyimpan draf ${draft.fileName}`, at, status: 'Draf' },
        ...state.activity,
      ],
    }));
  },

  runValidation: (draft, result) => {
    const at = result.ranAt;
    const status = result.needsFixRows > 0 ? 'Perlu perbaikan' : 'Siap ditinjau';
    set((state) => ({
      draft,
      corrections: {},
      validation: { ...result, fileName: draft.fileName },
      versions: upsertVersion(state.versions, draft, status, at),
      activity: [
        {
          id: `A-${Date.now()}`,
          stage: 'Validasi',
          text: `Memvalidasi ${draft.fileName}: ${result.passedRows} dari ${result.totalRows} baris lolos`,
          at,
          status: result.needsFixRows > 0 ? 'Perlu perbaikan' : 'Selesai',
        },
        ...state.activity,
      ],
    }));
  },

  setCorrection: (key, correction) =>
    set((state) => ({
      corrections: { ...state.corrections, [key]: { ...correction, status: 'Diusulkan' } },
    })),

  // Menulis semua usulan ke baris draf. Mengembalikan draf yang sudah diperbarui.
  applyCorrections: () => {
    const { draft, corrections } = get();
    const pending = Object.entries(corrections).filter(([, item]) => item.status === 'Diusulkan');
    if (!draft || pending.length === 0) return draft;

    const rows = draft.rows.map((row) => row.slice());
    pending.forEach(([, item]) => {
      item.patches.forEach(({ column, value }) => {
        rows[item.line - 2][column] = value;
      });
    });
    const nextDraft = { ...draft, rows };
    const at = new Date().toISOString();

    set((state) => ({
      draft: nextDraft,
      corrections: Object.fromEntries(
        Object.entries(state.corrections).map(([key, item]) => [
          key,
          item.status === 'Diusulkan' ? { ...item, status: 'Diterapkan' } : item,
        ])
      ),
      activity: [
        {
          id: `A-${Date.now()}`,
          stage: 'Perbaikan',
          text: `Menerapkan ${pending.length} perbaikan pada ${draft.fileName}`,
          at,
          status: 'Diterapkan',
        },
        ...state.activity,
      ],
    }));
    return nextDraft;
  },
}));