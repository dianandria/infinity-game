import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from "@/Layouts/AppLayout";

const faqs = [
    {
        category: 'order',
        question: "Bagaimana cara melakukan pemesanan produk di Infinity Game?",
        answer: "Anda dapat memilih produk konsol, kaset game, atau voucher yang diinginkan melalui katalog kami, lalu klik tombol Add To Cart. Setelah itu, buka halaman keranjang (Cart) dan ikuti alur Checkout untuk mengisi alamat pengiriman serta memilih metode pembayaran yang tersedia."
    },
    {
        category: 'order',
        question: "Metode pembayaran apa saja yang didukung oleh sistem?",
        answer: "Kami menerima berbagai metode pembayaran resmi dan terverifikasi otomatis: Bank Transfer/Virtual Account (BCA, Mandiri, BNI, BRI, BSI, Permata), E-Wallet (GoPay, OVO, DANA, ShopeePay), Kartu Kredit/Debit (Visa, MasterCard, JCB), serta PayLater & Cicilan (SPayLater, Kredivo, Indodana)."
    },
    {
        category: 'order',
        question: "Apakah harga produk yang tertera sudah termasuk pajak?",
        answer: "Ya, seluruh harga produk dan layanan hiburan yang tertera di situs Infinity Game menggunakan mata uang Rupiah (IDR) dan sudah termasuk pajak (PPN) yang berlaku di Indonesia."
    },
    {
        category: 'shipping',
        question: "Kapan pesanan fisik saya diproses dan dikirimkan oleh kurir?",
        answer: "Pesanan produk fisik yang pembayarannya terverifikasi sebelum pukul 15:00 WIB (Senin - Jumat) atau pukul 12:00 WIB (Sabtu) akan dikirimkan pada hari kerja yang sama. Pesanan di luar jam operasional atau hari libur nasional akan dikirimkan pada hari kerja berikutnya."
    },
    {
        category: 'shipping',
        question: "Apakah disarankan untuk mengaktifkan asuransi pengiriman?",
        answer: "Sangat disarankan, terutama untuk pembelian produk bernilai tinggi seperti Konsol PlayStation 5, Nintendo Switch 2, atau Xbox Series X. Asuransi pengiriman melindungi paket Anda 100% dari risiko kerusakan berat atau kehilangan saat di jalan."
    },
    {
        category: 'shipping',
        question: "Bagaimana cara melacak nomor resi pengiriman paket?",
        answer: "Nomor resi (tracking number) akan diperbarui otomatis di akun Anda dan dikirimkan melalui email maksimal 24 jam setelah paket diserahkan ke kurir. Anda dapat melacaknya melalui fitur \"Lacak Pesanan\" di dashboard akun Anda."
    },
    {
        category: 'warranty',
        question: "Apa syarat mutlak untuk mengajukan klaim kerusakan atau barang kurang?",
        answer: "Syarat wajib adalah melampirkan video unboxing utuh tanpa jeda (no cut/edit), dimulai sejak resi ekspedisi terlihat jelas di kemasan utuh, proses pembukaan kardus, hingga produk dinyalakan untuk memperlihatkan letak cacat pabriknya."
    },
    {
        category: 'warranty',
        question: "Berapa lama batas waktu klaim tukar unit baru (1-to-1 replacement)?",
        answer: "Klaim penukaran unit baru untuk cacat pabrik (factory defect) berlaku maksimal 3x24 jam sejak paket dinyatakan diterima oleh sistem tracking ekspedisi. Setelah itu, produk konsol diproses melalui klaim Garansi Resmi Distributor."
    },
    {
        category: 'digital',
        question: "Berapa lama kode voucher digital dikirimkan setelah pembayaran sukses?",
        answer: "Pengiriman kode voucher game (Steam Wallet, PSN Card, Nintendo eShop, Xbox Live) berjalan instan dan otomatis dalam waktu 1-10 menit setelah verifikasi pembayaran berhasil. Kode akan muncul di riwayat transaksi akun dan dikirim ke email Anda."
    },
    {
        category: 'digital',
        question: "Apakah kode voucher bisa ditukar atau di-refund jika saya salah beli region?",
        answer: "Tidak bisa. Seluruh produk digital yang telah diterbitkan kodenya bersifat Non-Refundable dan tidak dapat ditukar dengan alasan apa pun. Pastikan wilayah (region) akun Anda sudah sesuai dengan region voucher sebelum membayar."
    }
];

const filters = [
    { key: 'all', label: 'Semua Pertanyaan' },
    { key: 'order', label: 'Pemesanan & Pembayaran' },
    { key: 'shipping', label: 'Pengiriman & Logistik' },
    { key: 'warranty', label: 'Garansi & Retur' },
    { key: 'digital', label: 'Voucher Digital' },
];

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [search, setSearch] = useState('');

    const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

    const visible = faqs.filter((f) => {
        const matchesCategory = activeFilter === 'all' || f.category === activeFilter;
        const q = search.toLowerCase().trim();
        const matchesSearch = !q || (f.question + f.answer).toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });

    return (
        <AppLayout>
            <Head title="FAQ - Infinity Game" />

            <main className="faq-main">
                <section className="faq-banner">
                    <div className="faq-banner-overlay"></div>
                    <div className="faq-banner-content">
                        <p className="banner-subtitle">FREQUENTLY ASKED QUESTIONS</p>
                        <h1>Pertanyaan yang Sering Diajukan</h1>
                        <p className="banner-desc">
                            Temukan jawaban cepat seputar transaksi, pengiriman konsol, voucher digital, dan kebijakan garansi di Infinity Game.
                        </p>
                    </div>
                </section>

                <div className="breadcrumb-container">
                    <nav className="breadcrumb">
                        <Link href={route('home.index')}>Home</Link>
                        <span className="separator">/</span>
                        <span className="current">FAQ</span>
                    </nav>
                    <div className="last-updated">
                        <span>Pusat Bantuan <strong>Infinity Game</strong></span>
                    </div>
                </div>

                <div className="faq-container">
                    <section className="faq-controls">
                        <div className="faq-search-box">
                            <input
                                type="text"
                                placeholder="Cari pertanyaan (cth: resi, garansi, refund, voucher)..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="button" className="btn-search-clear" onClick={() => setSearch('')}>Reset</button>
                        </div>

                        <div className="faq-category-filters">
                            {filters.map((f) => (
                                <button
                                    key={f.key}
                                    type="button"
                                    className={`faq-pill ${activeFilter === f.key ? 'active' : ''}`}
                                    onClick={() => setActiveFilter(f.key)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="faq-list-section" id="faq-accordion-container">
                        {visible.map((faq) => {
                            const index = faqs.indexOf(faq);
                            const isOpen = openIndex === index;
                            return (
                                <div className={`faq-accordion-item ${isOpen ? 'active' : ''}`} key={index} data-category={faq.category}>
                                    <button
                                        type="button"
                                        className="faq-accordion-header"
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        <span>{faq.question}</span>
                                        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                                    </button>
                                    <div className="faq-accordion-body" style={{ maxHeight: isOpen ? '400px' : undefined }}>
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    {visible.length === 0 && (
                        <div id="faq-no-results" className="faq-no-results" style={{ display: 'block' }}>
                            <h3>🤔 Pertanyaan tidak ditemukan</h3>
                            <p>Coba gunakan kata kunci pencarian lain atau pilih kategori yang relevan di atas.</p>
                        </div>
                    )}

                    <section className="faq-help-box">
                        <div className="faq-help-left">
                            <h3>Belum Menemukan Jawaban dari Masalah Anda?</h3>
                            <p>
                                Tim Customer Support kami siap membantu menyelesaikan masalah atau pertanyaan Anda setiap hari pukul 09:00 - 21:00 WIB.
                            </p>
                        </div>
                        <div className="faq-help-right">
                            <Link href={route('contact.create')} className="btn-primary">Hubungi Customer Service</Link>
                            <Link href="/refund-policy" className="btn-outline-white">Kebijakan Retur</Link>
                        </div>
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}
