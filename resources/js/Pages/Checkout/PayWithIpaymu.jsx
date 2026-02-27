import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
const fmt = n => `Rp ${Number(n || 0).toLocaleString('id-ID')}`

export default function PayWithIpaymu({order, ipaymu}) {
    return (
        <AppLayout>
            <Head title="Pay With Ipaymu" />
            <div className="mx-auto max-w-xl px-4 py-12 text-center">
            <h1 className="text-gray-900 font-bold">Order {order.code}</h1>
            <p className="text-gray-900">Total: Rp {fmt(order.total)}</p>

            <h2 className="text-gray-900">Bayar via iPaymu</h2>
            <p className="text-gray-900">No. VA / PaymentNo: <strong>{ipaymu.payment_no ?? ''}</strong></p>
            <p className="text-gray-900">Bayar sebelum: {ipaymu.expired_at ?? ''}</p>
            {/* Tambah instruksi pembayaran BRI VA, dll */}
            </div>
        </AppLayout>
    );
}
