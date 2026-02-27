import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

export default function AboutIndex() {
  const { about } = usePage().props

  return (
    <AppLayout>
      <Head title={about?.title ?? 'About Us'} />

      <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
        {/* HERO */}
        <section className="mb-10 lg:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            {about?.title ?? 'About Us'}
          </p>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {about?.tagline ?? 'We create things that matter.'}
              </h1>
              <p className="mt-3 max-w-2xl text-gray-600 leading-relaxed">
                {about?.intro ??
                  'Kami hadir untuk membantu Anda mendapatkan produk yang tepat, dengan kualitas yang konsisten dan layanan yang bisa diandalkan.'}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <Link
                href={route('contact.create')}
                className="inline-flex items-center rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS */}
        {about?.highlights?.length > 0 && (
          <section className="mb-10 lg:mb-14">
            <div className="grid gap-6 md:grid-cols-3">
              {about.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* STORY / SECTION TEXT */}
        <section className="mb-10 lg:mb-14">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Our Story
              </h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Berawal dari kebutuhan akan produk yang berkualitas dan konsisten,
                kami membangun brand ini dengan fokus pada detail, kenyamanan, dan
                kepercayaan. Setiap produk yang kami keluarkan melalui proses kurasi
                dan quality control yang ketat.
              </p>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Kami tidak hanya menjual barang, tetapi juga membangun hubungan,
                mendengarkan feedback, dan terus mengembangkan diri agar bisa
                menjadi partner yang bisa Anda andalkan dalam jangka panjang.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                What We Believe
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Kualitas selalu lebih penting daripada kuantitas.</li>
                <li>• Transparansi dan komunikasi yang jelas dengan pelanggan.</li>
                <li>• Pengiriman tepat waktu dan layanan purna jual yang responsif.</li>
                <li>• Kerja sama jangka panjang lebih berharga dari satu transaksi.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* STATS / NUMBERS */}
        {about?.stats?.length > 0 && (
          <section className="border-t border-gray-100 pt-8">
            <div className="grid gap-6 text-center md:grid-cols-3">
              {about.stats.map((stat, idx) => (
                <div key={idx}>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  )
}
