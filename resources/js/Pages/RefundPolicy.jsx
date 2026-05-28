import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from "@/Layouts/AppLayout";
// Import your layout component here if you use persistent layouts
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function RefundPolicy() {

    return (
        <AppLayout>
            <Head title="FAQ - Twighouse Souvenir" />

            <div className="max-w-4xl mx-auto px-4 py-12 mt-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kebijakan Pengembalian (Refund Policy)</h1>
                    <p className="text-gray-600">Terima kasih telah mempercayakan momen spesial Anda pada Twig Souvenir. Mohon baca kebijakan pengembalian kami.</p>
                    <div className="mt-4 h-1 w-20 bg-rose-500 mx-auto rounded-full"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 m-6 rounded-r-lg">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 text-amber-400">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wider">Penting: Wajib Video Unboxing</h3>
                                <p className="mt-1 text-sm text-amber-700 leading-relaxed">
                                    Komplain barang rusak atau kurang <strong>wajib</strong> menyertakan video unboxing utuh tanpa jeda/edit dari paket sebelum dibuka. Tanpa bukti video, klaim tidak dapat diproses.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-10">
                        
                        <section>
                            <div className="flex items-center mb-4">
                                <span className="bg-rose-100 text-rose-600 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">Syarat Pengembalian Barang</h2>
                            </div>
                            <ul className="space-y-3 text-gray-600 ml-12 list-disc">
                                <li>Batas waktu klaim maksimal <strong>2x24 jam</strong> setelah status resi dinyatakan diterima oleh sistem ekspedisi.</li>
                                <li><strong>Produk Custom (Contoh: Cetak Nama, Tanggal, atau Desain Khusus) tidak dapat dikembalikan</strong> atau dibatalkan, kecuali terdapat kesalahan cetak murni dari pihak produksi Twig Souvenir.</li>
                                <li>Barang yang diretur harus dikembalikan dalam keadaan lengkap beserta *packaging* (plastik/box) aslinya.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-100" />

                        <section>
                            <div className="flex items-center mb-4">
                                <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">Mekanisme Pengembalian Dana</h2>
                            </div>
                            <div className="ml-12 space-y-4">
                                <p className="text-gray-600 leading-relaxed">
                                    Jika klaim disetujui, dana akan dikembalikan sesuai dengan kesepakatan (bisa berupa uang kembali atau pengiriman ulang barang pengganti).
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Waktu Proses Refund</p>
                                        <p className="text-gray-700 font-medium">Maksimal 3 Hari Kerja</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Metode Refund</p>
                                        <p className="text-gray-700 font-medium">Transfer Bank / E-Wallet</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}