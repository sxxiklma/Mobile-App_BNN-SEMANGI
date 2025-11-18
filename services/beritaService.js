import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://surabayakota.bnn.go.id';

export const fetchBerita = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/berita/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const $ = cheerio.load(response.data);
    const beritaList = [];

    $('.blog-post, .post-item, article, .news-item').each((index, element) => {
      if (index >= 10) return false; 

      const $element = $(element);

      const title = $element.find('h2, h3, .title, .post-title').first().text().trim() ||
                   $element.find('a').first().text().trim();
      
      const link = $element.find('a').first().attr('href');
      const fullLink = link?.startsWith('http') ? link : `${BASE_URL}${link}`;
      
      const image = $element.find('img').first().attr('src');
      const fullImage = image?.startsWith('http') ? image : 
                       image?.startsWith('/') ? `${BASE_URL}${image}` : 
                       image ? `${BASE_URL}/${image}` : 
                       'https://via.placeholder.com/400x200?text=BNN+Surabaya';
      
      const excerpt = $element.find('p, .excerpt, .description').first().text().trim() ||
                     $element.text().replace(title, '').trim().substring(0, 150);
      
      const date = $element.find('.date, .post-date, time').first().text().trim() ||
                  new Date().toLocaleDateString('id-ID');

      if (title && link) {
        beritaList.push({
          id: index + 1,
          title: title.substring(0, 100),
          excerpt: excerpt.substring(0, 150) + '...',
          image: fullImage,
          date: date,
          link: fullLink,
        });
      }
    });

    if (beritaList.length === 0) {
      return getDummyBerita();
    }

    return beritaList;
  } catch (error) {
    console.error('Error fetching berita:', error.message);

    return getDummyBerita();
  }
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
