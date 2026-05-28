import React from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function Failed({ order, message }) {
  const { url } = usePage(); // kalau perlu debug

  return (
    <AppLayout>
        <Head title="Payment failed" />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-md rounded-xl p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-red-600">
            Pembayaran Gagal
            </h1>

            <p className="text-gray-700">
            {message}
            </p>

            <div className="border-t pt-4 text-sm text-gray-600 space-y-1">
            <p>
                <span className="font-medium">Kode Order:</span>{' '}
                {order.code}
            </p>
            <p>
                <span className="font-medium">Total:</span>{' '}
                Rp {order.total.toLocaleString('id-ID')}
            </p>
            <p>
                <span className="font-medium">Status Saat Ini:</span>{' '}
                {order.status}
            </p>
            </div>

            <div className="flex gap-3 pt-2">
            <Link
                href="/cart"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
            >
                Kembali ke Keranjang
            </Link>

            <Link
                href="/checkout"
                className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
            >
                Coba Checkout Lagi
            </Link>
            </div>
        </div>
        </div>
    </AppLayout>
  );
}
