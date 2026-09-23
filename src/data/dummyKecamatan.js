export const dummyKecamatan = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "1",
        nama: "Kecamatan Bogor Tengah",
        valDemokrasi: 85, // Kepadatan usia sekolah sangat tinggi
        valAksesibilitas: 90, // Defisit fasilitas/jarak sekolah tinggi
        valRtrw: 70, // Ketersediaan lahan layak
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.785, -6.585],
            [106.808, -6.585],
            [106.808, -6.608],
            [106.785, -6.608],
            [106.785, -6.585],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "2",
        nama: "Kecamatan Bogor Utara",
        valDemokrasi: 75,
        valAksesibilitas: 65,
        valRtrw: 80,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.795, -6.550],
            [106.830, -6.550],
            [106.830, -6.585],
            [106.795, -6.585],
            [106.795, -6.550],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "3",
        nama: "Kecamatan Bogor Selatan",
        valDemokrasi: 60,
        valAksesibilitas: 70,
        valRtrw: 85,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.785, -6.608],
            [106.835, -6.608],
            [106.835, -6.640],
            [106.785, -6.640],
            [106.785, -6.608],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "4",
        nama: "Kecamatan Bogor Timur",
        valDemokrasi: 50,
        valAksesibilitas: 45,
        valRtrw: 60,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.808, -6.585],
            [106.845, -6.585],
            [106.845, -6.615],
            [106.808, -6.615],
            [106.808, -6.585],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "5",
        nama: "Kecamatan Bogor Barat",
        valDemokrasi: 80,
        valAksesibilitas: 85,
        valRtrw: 75,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.740, -6.570],
            [106.785, -6.570],
            [106.785, -6.610],
            [106.740, -6.610],
            [106.740, -6.570],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "6",
        nama: "Kecamatan Tanah Sareal",
        valDemokrasi: 70,
        valAksesibilitas: 60,
        valRtrw: 90,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [106.760, -6.540],
            [106.795, -6.540],
            [106.795, -6.585],
            [106.760, -6.585],
            [106.760, -6.540],
          ],
        ],
      },
    },
  ],
};