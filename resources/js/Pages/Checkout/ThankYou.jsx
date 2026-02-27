import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
const fmt = n => `Rp ${Number(n || 0).toLocaleString('id-ID')}`

export default function ThankYou() {
  const { order } = usePage().props
  return (
    <AppLayout>
      <Head title="Thank You" />
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Terima kasih!</h1>
        <p className="mt-2">Order kamu <b>{order.code}</b> sudah kami terima.</p>
        <p className="mt-1 text-sm text-gray-600">Status: {order.status} • Total: {fmt(order.total)}</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-black">Kembali ke Home</Link>
      </div>
    </AppLayout>
  )
}
