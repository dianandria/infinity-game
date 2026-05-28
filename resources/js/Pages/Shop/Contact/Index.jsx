// resources/js/Pages/Shop/Contact/Index.jsx

import React from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

export default function ContactIndex() {
  const { status } = usePage().props

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: ''
  })

  const onSubmit = (e) => {
    e.preventDefault()

    post(route('contact.store'), {
      onSuccess: () => {
        reset('message') // misal cuma reset pesan, atau reset() semua
      },
    })
  }

  return (
    <AppLayout>
      <Head title="Hubungi Kami" />

      <div className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
        
        {/* Bagian Judul & Deskripsi */}
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Hubungi Kami</h1>
        <p className="mb-8 text-gray-600">
          Punya pertanyaan, penawaran kerja sama, atau butuh bantuan terkait pesanan Anda? Isi formulir di bawah ini atau hubungi kami langsung melalui informasi yang tersedia.
        </p>

        {/* Kotak Informasi Kontak (Atas) */}
        <div className="space-y-6 rounded-2xl bg-gray-50 p-6 border border-gray-100 md:flex md:space-y-0 md:space-x-12">
          {/* Alamat Toko */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Toko Kami</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Jl. Sukajadi No.127, Cipedes<br />
              Kec. Sukajadi, Kota Bandung<br />
              Jawa Barat 40162
            </p>
          </div>

          {/* Nomor Kontak */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Kontak</h3>
            <div className="mt-2 space-y-2 text-gray-600">
              <p className="flex items-center">
                <span className="font-medium text-gray-900 w-24">Telepon:</span> 
                022 2037700
              </p>
              <p className="flex items-center">
                <span className="font-medium text-gray-900 w-24">WhatsApp:</span> 
                <a href="https://wa.me/6282130009900" target="_blank" rel="noreferrer" className="hover:text-gray-900 hover:underline">
                  +62 821-3000-9900
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Garis Pemisah */}
        <div className="relative py-10">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">Atau kirim pesan</span>
          </div>
        </div>

        {/* Bagian Formulir (Bawah) */}
        <div>
          {status && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-gray-800">
              {status}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nomor Telepon (opsional)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Subjek (opsional)
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.subject}
                onChange={(e) => setData('subject', e.target.value)}
              />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Pesan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
              )}
            </div>

            <div className="hidden">
              <label>
                Kosongkan kolom ini
                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  onChange={(e) => setData('website', e.target.value)}
                  value={data.website || ''}
                />
              </label>
            </div>
              
            <div className="pt-2">
              <button
                type="submit"
                disabled={processing}
                className="inline-flex w-full justify-center items-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:px-8"
              >
                {processing ? 'Mengirim…' : 'Kirim Pesan'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </AppLayout>
  )
}