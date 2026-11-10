import { create } from 'zustand';

// TODO: ganti dengan data dari API backend. Untuk sementara tersimpan di memori
// browser dan hilang saat halaman dimuat ulang.
export const useOperatorStore = create((set) => ({
  versions: [],
  activity: [],

  importVersion: ({ name, source, period, fileName }) => {
    const now = new Date().toISOString();
    const stamp = Date.now();

    set((state) => ({
      versions: [
        { id: `V-${stamp}`, name, source, period, fileName, status: 'Menunggu validasi', importedAt: now },
        ...state.versions,
      ],
      activity: [
        {
          id: `A-${stamp}`,
          stage: 'Dataset',
          text: `Mengimpor ${name} (${fileName})`,
          at: now,
          status: 'Menunggu',
        },
        ...state.activity,
      ],
    }));
  },
}));