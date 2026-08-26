import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from "@/Layouts/AppLayout";

export default function RefundPolicy() {
    return (
        <AppLayout>
            <Head title="Kebijakan Pengembalian - Infinity Game" />

            <main className="return-main">
                <section className="return-banner">
                    <div className="return-banner-overlay"></div>
                    <div className="return-banner-content">
                        <p className="banner-subtitle">RETURN &amp; REFUND POLICY</p>
                        <h1>Kebijakan Pengembalian &amp; Garansi</h1>
                        <p className="banner-desc">
                            Komitmen Infinity Game untuk memastikan perlindungan konsumen, proses retur transparan, serta garansi resmi terpercaya untuk setiap transaksi Anda.
                        </p>
                    </div>
                </section>

                <div className="breadcrumb-container">
                    <nav className="breadcrumb">
                        <Link href={route('home.index')}>Home</Link>
                        <span className="separator">/</span>
                        <span className="current">Kebijakan Pengembalian</span>
                    </nav>
                </div>

                <div className="return-container">
                    <section className="policy-pillars">
                        <div className="pillar-card">
                            <div className="pillar-icon">🎮</div>
                            <div className="pillar-body">
                                <h3>Konsol &amp; Aksesori</h3>
                                <p className="pillar-highlight">3x24 Jam Penukaran Unit Baru</p>
                                <p>
                                    Perlindungan tukar baru (1-to-1 replacement) untuk kerusakan cacat pabrik (factory defect) yang dilaporkan dalam 3 hari sejak paket diterima, didukung garansi resmi distributor.
                                </p>
                            </div>
                        </div>

                        <div className="pillar-card">
                            <div className="pillar-icon">💿</div>
                            <div className="pillar-body">
                                <h3>Kaset Game &amp; Blu-Ray</h3>
                                <p className="pillar-highlight">Jaminan Disk Mulus &amp; Tersegel</p>
                                <p>
                                    Retur berlaku apabila kaset/disk fisik mengalami kerusakan fisik saat diterima atau tidak terdeteksi oleh mesin konsol dengan bukti unboxing resmi.
                                </p>
                            </div>
                        </div>

                        <div className="pillar-card">
                            <div className="pillar-icon">🎟️</div>
                            <div className="pillar-body">
                                <h3>Voucher &amp; Game Digital</h3>
                                <p className="pillar-highlight">Non-Refundable Policy</p>
                                <p>
                                    Kode voucher digital (Steam, PSN, eShop, Xbox Live) yang telah terkirim dan valid bersifat tidak dapat dikembalikan atas alasan salah beli regional atau kelalaian akun.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="return-steps-section">
                        <h2 className="section-title">4 Langkah Mudah Pengajuan Klaim Retur</h2>
                        <p className="section-subtitle">Ikuti tahapan berikut agar klaim penukaran produk atau refund Anda dapat diproses dengan cepat.</p>

                        <div className="steps-grid">
                            <div className="step-card">
                                <div className="step-number">01</div>
                                <h3>Siapkan Video Unboxing</h3>
                                <p>Rekam paket sejak resi ekspedisi masih tertempel rapi hingga produk dinyalakan/ditampilkan cacat fisiknya tanpa terputus (no cut/edit).</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">02</div>
                                <h3>Ajukan Tiket Klaim</h3>
                                <p>Hubungi pusat bantuan atau kirim pesan melalui halaman kontak/WhatsApp dengan melampirkan nomor pesanan (Invoice) dan bukti video.</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">03</div>
                                <h3>Verifikasi &amp; Kirim Unit</h3>
                                <p>Setelah disetujui CS, kirimkan kembali produk lengkap dengan box, buku panduan, dan seluruh aksesori ke alamat pusat retur Infinity Game.</p>
                            </div>
                            <div className="step-card">
                                <div className="step-number">04</div>
                                <h3>Penggantian atau Refund</h3>
                                <p>Tim teknisi akan memeriksa unit maksimal 1x24 jam. Jika valid, unit baru segera dikirimkan atau dana dikembalikan penuh (100% refund).</p>
                            </div>
                        </div>
                    </section>

                    <section className="return-details-section">
                        <article className="return-policy-article">
                            <div className="article-badge">PASAL I</div>
                            <h2>Syarat Mutlak Video Unboxing</h2>
                            <p>
                                Untuk mencegah penyalahgunaan dan memudahkan klaim asuransi kepada pihak ekspedisi, Infinity Game memberlakukan aturan wajib lampiran bukti video unboxing bagi seluruh klaim barang fisik.
                            </p>
                            <div className="return-callout warning">
                                <strong>Ketentuan Video Unboxing yang Sah:</strong>
                                <ul>
                                    <li>Video diambil berkesinambungan (satu kali take) dari semua sisi kemasan sebelum paket dibuka.</li>
                                    <li>Resi pengiriman harus terlihat jelas nomor dan alamatnya pada video.</li>
                                    <li>Proses pembukaan segel kardus hingga unit dikeluarkan dan diperiksa fungsinya tidak boleh terpotong atau melalui proses penyuntingan (video editing).</li>
                                </ul>
                            </div>
                        </article>

                        <article className="return-policy-article">
                            <div className="article-badge">PASAL II</div>
                            <h2>Kriteria Kerusakan &amp; Cakupan Garansi</h2>
                            <p>
                                Kami membedakan secara tegas antara cacat produksi pabrik (Factory Defect) dengan kerusakan yang diakibatkan oleh pemakaian pengguna (Human Error).
                            </p>
                            <div className="policy-comparison-grid">
                                <div className="comparison-box accepted">
                                    <h4>✓ Dapat Diajukan Klaim (Valid)</h4>
                                    <ul>
                                        <li>Konsol mati total (no display/no power) saat pertama kali dihidupkan.</li>
                                        <li>Joy-Con atau DualSense mengalami cacat optik/analog drift dari pabrik sejak dalam kemasan.</li>
                                        <li>Kaset video game/disk Blu-Ray tidak dapat terbaca meski kaset tidak lecet/gores.</li>
                                        <li>Kesalahan pengiriman dari pihak toko (tipe, warna, atau judul game tidak sesuai invoice).</li>
                                    </ul>
                                </div>
                                <div className="comparison-box rejected">
                                    <h4>✕ Tidak Tercover Garansi / Retur (Ditolak)</h4>
                                    <ul>
                                        <li>Kerusakan akibat jatuh, terbentur, korsleting listrik rumah, atau terkena cairan (Human Error).</li>
                                        <li>Segel garansi resmi pabrikan/distributor rusak, sobek, atau telah dibuka oleh pihak ketiga.</li>
                                        <li>Salah beli judul game, region konsol, atau berubah pikiran setelah kemasan segel dibuka.</li>
                                        <li>Kode voucher digital yang telah dikirimkan ke email/akun pengguna.</li>
                                    </ul>
                                </div>
                            </div>
                        </article>

                        <article className="return-policy-article">
                            <div className="article-badge">PASAL III</div>
                            <h2>Metode &amp; Waktu Pengembalian Dana (Refund)</h2>
                            <p>
                                Apabila produk penukaran (unit baru) sedang tidak tersedia dalam stok, pengguna berhak memilih opsi pengembalian dana penuh (100% Refund).
                            </p>
                            <div className="refund-table-wrapper">
                                <table className="refund-table">
                                    <thead>
                                        <tr>
                                            <th>Metode Pembayaran</th>
                                            <th>Estimasi Waktu Proses</th>
                                            <th>Ketentuan Biaya Admin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>Bank Transfer / Virtual Account</strong></td>
                                            <td>1 &ndash; 3 Hari Kerja</td>
                                            <td>Tanpa Potongan (100% Penuh)</td>
                                        </tr>
                                        <tr>
                                            <td><strong>E-Wallet (GoPay, OVO, Dana, ShopeePay)</strong></td>
                                            <td>1 &ndash; 24 Jam Kerja</td>
                                            <td>Tanpa Potongan (100% Penuh)</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Kartu Kredit / PayLater</strong></td>
                                            <td>5 &ndash; 14 Hari Kerja (Sesuai Bank Penerbit)</td>
                                            <td>Pengembalian Limit Kredit (Void/Reversal)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </article>

                        <article className="return-policy-article">
                            <div className="article-badge">PASAL IV</div>
                            <h2>Biaya Pengiriman Retur &amp; Asuransi</h2>
                            <p>Kebijakan mengenai beban biaya ongkos kirim (ongkir) diatur berdasarkan sumber kesalahan serta waktu pelaporan:</p>
                            <ul>
                                <li>
                                    <strong>Cacat Pabrik &le; 3 Hari / Kesalahan Toko:</strong> Seluruh biaya ongkos kirim pengembalian barang dari pembeli ke toko dan pengiriman unit pengganti ditanggung sepenuhnya oleh <strong>Infinity Game</strong>.
                                </li>
                                <li>
                                    <strong>Klaim Garansi Resmi &gt; 3 Hari:</strong> Pengguna menanggung biaya pengiriman ke pusat servis resmi distributor merek (Sony Center, Nintendo Authorized Service, dll) atau dapat dibantu oleh tim toko dengan biaya logistik reguler.
                                </li>
                            </ul>
                        </article>
                    </section>

                    <section className="return-help-box">
                        <div className="help-content-left">
                            <h3>Masih Memiliki Pertanyaan Mengenai Pengembalian?</h3>
                            <p>Tim Customer Support kami siap membantu peninjauan kasus Anda dari Senin hingga Minggu, pukul 09:00 - 21:00 WIB.</p>
                        </div>
                        <div className="help-content-right">
                            <Link href={route('contact.create')} className="btn-primary">Hubungi Layanan CS</Link>
                            <Link href="/term-condition" className="btn-outline-white">Syarat &amp; Ketentuan</Link>
                        </div>
                    </section>
                </div>
            </main>
        </AppLayout>
    );
}
