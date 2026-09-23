export const dummySchools = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [106.8438, -6.6452] }, // Sindangsari, Bogor Timur
      properties: {
        id: 1,
        npsn: "20220308",
        nama: "SMK Wikrama Bogor",
        status: "Swasta",
        jumlahSiswa: 1550,
        jumlahGuru: 75,
        ruangKelas: 36,
        akreditasi: "A",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [106.7932, -6.5932] }, // Jl. Juanda, Bogor Tengah
      properties: {
        id: 2,
        npsn: "20220201",
        nama: "SMPN 1 Bogor",
        status: "Negeri",
        jumlahSiswa: 850,
        jumlahGuru: 45,
        ruangKelas: 24,
        akreditasi: "A",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [106.7901, -6.5902] }, // Jl. Kapten Muslihat, Bogor Tengah
      properties: {
        id: 3,
        npsn: "20220220",
        nama: "SMAN 1 Bogor",
        status: "Negeri",
        jumlahSiswa: 1020,
        jumlahGuru: 58,
        ruangKelas: 30,
        akreditasi: "A",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [106.7981, -6.5788] }, // Jl. He配置/Cimanggu, Tanahsareal
      properties: {
        id: 4,
        npsn: "20220235",
        nama: "SMKN 1 Bogor",
        status: "Negeri",
        jumlahSiswa: 1200,
        jumlahGuru: 68,
        ruangKelas: 32,
        akreditasi: "A",
      },
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [106.812, -6.571] }, // Bantarjati, Bogor Utara
      properties: {
        id: 5,
        npsn: "20220202",
        nama: "SMPN 2 Bogor",
        status: "Negeri",
        jumlahSiswa: 780,
        jumlahGuru: 40,
        ruangKelas: 22,
        akreditasi: "A",
      },
    },
  ],
};
