import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from "@/Layouts/AppLayout";
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function TermCondition() {

    return (
        <AppLayout>
            <Head title="Syarat dan Ketentuan - Twig Souvenir" />

            <div className="max-w-4xl mx-auto px-4 py-12 mt-12">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Syarat dan Ketentuan (Terms & Conditions)</h1>
                    <p className="text-gray-600">Selamat datang di Twig Souvenir. Mohon baca syarat dan ketentuan ini sebelum melakukan transaksi.</p>
                    <div className="mt-4 h-1 w-20 bg-rose-500 mx-auto rounded-full"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-rose-50 p-6 m-6 rounded-xl border border-rose-100">
                        <p className="text-sm text-rose-800 leading-relaxed text-center">
                            Dengan mengakses dan menggunakan <i>website</i> <strong>Twig Souvenir</strong>, serta melakukan pemesanan produk impor kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang tertulis di bawah ini.
                        </p>
                    </div>

                    <div className="p-8 space-y-10">
                        
                        {/* SECTION 1: Harga & Pembayaran */}
                        <section>
                            <div className="flex items-center mb-4">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">1. Harga & Pembayaran</h2>
                            </div>
                            <ul className="space-y-3 text-gray-600 ml-12 list-disc leading-relaxed">
                                <li>Semua harga yang tertera menggunakan mata uang Rupiah (IDR) dan <strong>sudah termasuk</strong> pajak impor serta biaya bea cukai, kecuali dinyatakan lain pada halaman produk.</li>
                                <li>Pembayaran pesanan harus diselesaikan dalam waktu batas waktu yang ditentukan sistem (misal: 24 jam). Jika melewati batas waktu tersebut, pesanan akan dibatalkan secara otomatis.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-100" />

                        {/* SECTION 2: Kondisi Produk Impor */}
                        <section>
                            <div className="flex items-center mb-4">
                                <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">2. Informasi & Kondisi Produk</h2>
                            </div>
                            <ul className="space-y-3 text-gray-600 ml-12 list-disc leading-relaxed">
                                <li><strong>Sistem Pre-Order (PO):</strong> Untuk produk berstatus PO, estimasi waktu kedatangan (ETA) adalah perkiraan dan dapat berubah sewaktu-waktu menyesuaikan kendala pengiriman internasional atau proses bea cukai.</li>
                                <li><strong>Kondisi Kemasan:</strong> Karena melalui perjalanan internasional yang panjang, sangat wajar jika terdapat sedikit ketidaksempurnaan pada kemasan luar (misal: dus penyok minor). Kami menjamin produk di dalamnya tetap utuh dan aman.</li>
                                <li>Kami berhak membatalkan pesanan jika stok di negara asal tiba-tiba kosong, dan dana Anda akan kami kembalikan 100%.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-100" />

                        {/* SECTION 3: Pengiriman */}
                        <section>
                            <div className="flex items-center mb-4">
                                <span className="bg-amber-100 text-amber-600 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">3. Pengiriman Barang</h2>
                            </div>
                            <ul className="space-y-3 text-gray-600 ml-12 list-disc leading-relaxed">
                                <li>Pesanan akan diproses dan dikirim menggunakan jasa ekspedisi lokal setelah barang tiba di gudang kami dan pembayaran diverifikasi.</li>
                                <li>Segala bentuk keterlambatan, kehilangan, atau kerusakan paket yang diakibatkan oleh kelalaian pihak jasa ekspedisi berada di luar tanggung jawab Twig Souvenir, namun kami akan membantu proses investigasi dan klaim.</li>
                            </ul>
                        </section>

                        <hr className="border-gray-100" />

                        {/* SECTION 5: Tanggung Jawab & HKI */}
                        <section>
                            <div className="flex items-center mb-4">
                                <span className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">4. Batasan Tanggung Jawab & Hak Cipta</h2>
                            </div>
                            <ul className="space-y-3 text-gray-600 ml-12 list-disc leading-relaxed">
                                <li><strong>Tanggung Jawab:</strong> Kami tidak bertanggung jawab atas kerugian akibat alergi atau reaksi tertentu terhadap produk makanan/kosmetik impor yang dibeli. Pembeli diimbau untuk selalu menerjemahkan dan membaca komposisi sebelum dikonsumsi/digunakan.</li>
                                <li><strong>Hak Cipta:</strong> Seluruh foto produk, logo, dan konten di dalam situs ini adalah hak milik Twig Souvenir dan dilindungi oleh hukum yang berlaku.</li>
                            </ul>
                        </section>
                        
                        <hr className="border-gray-100" />

                        <section className="text-center py-4">
                            <p className="text-gray-600 text-sm mb-2">
                                Syarat dan Ketentuan ini dapat diperbarui sewaktu-waktu tanpa pemberitahuan sebelumnya. Pastikan Anda mengecek halaman ini secara berkala.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}