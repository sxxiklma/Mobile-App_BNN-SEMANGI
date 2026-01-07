export const fetchBerita = async () => {
  return getDummyBerita();
};

const getDummyBerita = () => {
  return [
    {
      id: 1,
      title: 'BNN Kota Surabaya Gelar Sosialisasi P4GN di Sekolah',
      excerpt: 'BNN Kota Surabaya menggelar kegiatan sosialisasi Pencegahan dan Pemberantasan Penyalahgunaan dan Peredaran Gelap Narkotika (P4GN) di berbagai sekolah...',
      image: 'https://via.placeholder.com/400x200/1E3A8A/FFFFFF?text=BNN+Surabaya',
      date: '15 November 2025',
      link: 'https://surabayakota.bnn.go.id/berita/sosialisasi-p4gn',
    },
    {
      id: 2,
      title: 'Ratusan Warga Ikuti Tes Urine Gratis BNN',
      excerpt: 'Sebanyak 200 warga mengikuti kegiatan tes urine gratis yang diselenggarakan oleh BNN Kota Surabaya dalam rangka deteksi dini penyalahgunaan narkoba...',
      image: 'https://via.placeholder.com/400x200/2563EB/FFFFFF?text=Tes+Urine',
      date: '12 November 2025',
      link: 'https://surabayakota.bnn.go.id/berita/tes-urine-gratis',
    },
    {
      id: 3,
      title: 'BNN Tangkap Pengedar Narkoba di Wilayah Surabaya Timur',
      excerpt: 'Petugas BNN Kota Surabaya berhasil menangkap seorang pengedar narkoba jenis sabu-sabu di kawasan Surabaya Timur. Barang bukti yang disita...',
      image: 'https://via.placeholder.com/400x200/DC2626/FFFFFF?text=Penangkapan',
      date: '10 November 2025',
      link: 'https://surabayakota.bnn.go.id/berita/penangkapan-pengedar',
    },
    {
      id: 4,
      title: 'Webinar Anti Narkoba untuk Mahasiswa',
      excerpt: 'BNN Kota Surabaya mengadakan webinar bertema "Generasi Bersih Narkoba" yang diikuti oleh ratusan mahasiswa dari berbagai universitas di Surabaya...',
      image: 'https://via.placeholder.com/400x200/059669/FFFFFF?text=Webinar',
      date: '8 November 2025',
      link: 'https://surabayakota.bnn.go.id/berita/webinar-anti-narkoba',
    },
    {
      id: 5,
      title: 'Kampanye Say No To Drugs di Car Free Day',
      excerpt: 'Dalam rangka meningkatkan kesadaran masyarakat, BNN Kota Surabaya menggelar kampanye anti narkoba di acara Car Free Day Taman Bungkul...',
      image: 'https://via.placeholder.com/400x200/7C3AED/FFFFFF?text=Kampanye',
      date: '5 November 2025',
      link: 'https://surabayakota.bnn.go.id/berita/kampanye-cfd',
    },
  ];
};

export default { fetchBerita };
