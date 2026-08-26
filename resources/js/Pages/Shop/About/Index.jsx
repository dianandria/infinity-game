import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

export default function AboutIndex() {
  const { about, sliders = [] } = usePage().props
  const banner = sliders?.[0]?.image_path ? `/storage/${sliders[0].image_path}` : '/images/about-us.jpg'

  return (
    <AppLayout>
      <Head title="Tentang Kami - Infinity Game" />

      <main className="about-page">
        <div className="about-header">
          <div className="about-banner">
            <img src={banner} alt="Tentang Infinity Game Banner" className="banner-img" />
            <div className="banner-overlay"></div>
            <div className="banner-text">
              <p>KUALITAS, TERPERCAYA, DAN TANPA BATAS.</p>
              <h1>Tentang Infinity Game</h1>
            </div>
          </div>
        </div>

        <div className="about-content">
          <p>
            Selamat datang di <strong>Infinity Game</strong>. Kami adalah destinasi utama untuk memenuhi segala kebutuhan hiburan digital Anda. Berawal dari hobi dan kecintaan terhadap dunia visual, kami hadir dengan visi memberikan pengalaman hiburan terbaik lewat produk berkualitas tinggi tanpa batas.
          </p>

          <p>
            Kami memahami bahwa kenyamanan dan kepuasan dalam bermain game serta menonton film adalah prioritas. Oleh karena itu, Infinity Game menyediakan koleksi produk unggulan terlengkap pilihan yang meliputi:
          </p>

          <div className="about-features">
            <ul>
              <li>Konsol Game Terbaru (Xbox, PlayStation, Nintendo)</li>
              <li>Aksesoris Gaming Premium (Controller, Headset, dll)</li>
              <li>Game Fisik &amp; Digital Original</li>
              <li>Koleksi Film Terlengkap &amp; Berkualitas</li>
            </ul>

            <p>
              Untuk memastikan pengalaman berbelanja yang aman dan menyenangkan, kami selalu berkomitmen menghadirkan layanan terbaik:
            </p>
            <ul>
              <li>
                <strong>Pengiriman Cepat &amp; Aman</strong> ke seluruh penjuru Indonesia.
              </li>
              <li>
                <strong>Produk 100% Original</strong> dan terpercaya demi kepuasan pelanggan.
              </li>
              <li>
                <strong>Layanan Pelanggan Responsif</strong> yang siap membantu menjawab pertanyaan Anda.
              </li>
            </ul>
          </div>

          <p>
            Apapun jenis platform gaming favorit Anda atau genre film yang Anda sukai, Infinity Game siap menemani waktu luang dan mewujudkan ruang hiburan impian di rumah Anda.
          </p>

          <div className="about-cta">
            <Link href={route('products.index')} className="btn-primary">Lihat Koleksi Produk</Link>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
