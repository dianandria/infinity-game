import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import PageSlider from '@/Components/PageSlider'

export default function AboutIndex() {
  const { about, sliders = [] } = usePage().props

  return (
    <AppLayout>
      <Head title="Tentang Kami - Twig Souvenir" />
      <PageSlider sliders={sliders} />

      <div className="mx-auto max-w-3xl px-4 py-12 lg:py-16">
      

        {sliders.length === 0 && (
          <div className="mb-12 aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
            <img
              src="/images/about-us.jpg"
              alt="Koleksi Twig Souvenir"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Konten Utama */}
        <div className="space-y-8 text-gray-600 leading-relaxed md:text-lg">
          <p>
            Selamat datang di <strong className="text-gray-900 font-semibold">Twig Souvenir</strong>. Kami memahami bahwa sebuah suvenir bukan sekadar barang, melainkan pembawa cerita dan kenangan dari suatu tempat. Oleh karena itu, kami hadir untuk memudahkan Anda mendapatkan suvenir mancanegara berkualitas tanpa harus repot bepergian jauh.
          </p>

          <p>
            Kami secara khusus mengkurasi berbagai pilihan oleh-oleh otentik dan unik dari berbagai penjuru dunia. Mulai dari keindahan tradisi <span className="text-gray-900 font-medium">Jepang dan Korea</span>, keunikan khas <span className="text-gray-900 font-medium">Thailand dan China</span>, hingga pesona klasik dari <span className="text-gray-900 font-medium">Eropa</span> dan berbagai negara lainnya.
          </p>

          <div className="my-10 rounded-2xl bg-gray-50 p-8 border border-gray-100">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Mengapa Memilih Kami?
            </h3>
            <ul className="space-y-3 list-disc pl-5">
              <li>
                <strong className="text-gray-900">Koleksi Terkurasi:</strong> Setiap barang kami pilih dengan cermat untuk memastikan keaslian dan kualitas yang premium.
              </li>
              <li>
                <strong className="text-gray-900">Praktis & Mudah:</strong> Solusi terbaik untuk Anda yang tidak sempat berbelanja suvenir saat ke luar negeri atau kekurangan ruang di bagasi.
              </li>
              <li>
                <strong className="text-gray-900">Hadiah Istimewa:</strong> Sangat cocok dijadikan bingkisan elegan untuk kolega, keluarga, atau teman terdekat.
              </li>
            </ul>
          </div>

          <p>
            Baik untuk melengkapi koleksi pribadi Anda di rumah, maupun sebagai hadiah istimewa untuk orang terkasih, Twig Souvenir berkomitmen untuk memberikan pengalaman berbelanja oleh-oleh luar negeri yang menyenangkan, tepercaya, dan berkesan.
          </p>
        </div>

        {/* Tombol Call to Action (Opsional) */}
        <div className="mt-12 text-center">
          <a 
            href="/products" 
            className="inline-flex items-center rounded-xl bg-gray-900 px-8 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Lihat Koleksi Suvenir Kami
          </a>
        </div>

      </div>
    </AppLayout>
  )
}
