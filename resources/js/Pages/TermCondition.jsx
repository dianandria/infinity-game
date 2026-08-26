import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from "@/Layouts/AppLayout";

const sections = [
    { id: 'ketentuan-umum', label: '1. Ketentuan Umum' },
    { id: 'akun-pengguna', label: '2. Akun Pengguna & Keamanan' },
    { id: 'pemesanan-pembayaran', label: '3. Pemesanan & Pembayaran' },
    { id: 'pengiriman-fisik', label: '4. Pengiriman Produk Fisik' },
    { id: 'voucher-digital', label: '5. Voucher & Produk Digital' },
    { id: 'garansi-retur', label: '6. Garansi & Pengembalian' },
    { id: 'hak-cipta', label: '7. Hak Kekayaan Intelektual' },
    { id: 'hukum-berlaku', label: '8. Hukum & Sengketa' },
];

export default function TermCondition() {
    return (
        <AppLayout>
            <Head title="Syarat dan Ketentuan - Infinity Game" />

            <main className="terms-main">
                <section className="terms-banner">
                    <div className="terms-banner-overlay"></div>
                    <div className="terms-banner-content">
                        <p className="banner-subtitle">INFORMASI HUKUM &amp; KEBIJAKAN</p>
                        <h1>Syarat dan Ketentuan</h1>
                        <p className="banner-desc">
                            Harap baca syarat dan ketentuan ini secara saksama sebelum bertransaksi di Infinity Game.
                        </p>
                    </div>
                </section>

                <div className="breadcrumb-container">
                    <nav className="breadcrumb">
                        <Link href={route('home.index')}>Home</Link>
                        <span className="separator">/</span>
                        <span className="current">Syarat &amp; Ketentuan</span>
                    </nav>
                </div>

                <div className="terms-container">
                    <aside className="terms-sidebar">
                        <div className="sidebar-header">
                            <h3>Daftar Isi</h3>
                            <p>Navigasi cepat kebijakan</p>
                        </div>
                        <ul className="terms-nav">
                            {sections.map((s) => (
                                <li key={s.id}><a href={`#${s.id}`} className="nav-link">{s.label}</a></li>
                            ))}
                        </ul>
                        <div className="sidebar-help">
                            <h4>Butuh Bantuan?</h4>
                            <p>Tim dukungan kami siap membantu menjawab pertanyaan Anda.</p>
                            <Link href={route('contact.create')} className="btn-sidebar-contact">Hubungi Support</Link>
                        </div>
                    </aside>

                    <div className="terms-content">
                        <section id="ketentuan-umum" className="terms-section">
                            <div className="section-badge">PASAL 01</div>
                            <h2>Ketentuan Umum</h2>
                            <p>
                                Selamat datang di <strong>Infinity Game</strong>. Syarat dan Ketentuan berikut mengatur penggunaan situs web, layanan marketplace, serta pembelian seluruh produk hiburan yang tersedia di platform kami, mencakup konsol permainan (PlayStation, Xbox, Nintendo Switch), kaset video game fisik, Blu-Ray/Movie, hingga voucher game digital.
                            </p>
                            <ul>
                                <li><strong>Persetujuan Mengikat:</strong> Dengan mengakses, mendaftar, atau melakukan transaksi di Infinity Game, Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi Syarat dan Ketentuan ini.</li>
                                <li><strong>Perubahan Kebijakan:</strong> Infinity Game berhak mengubah, menambah, atau memperbarui Syarat dan Ketentuan ini sewaktu-waktu tanpa pemberitahuan prioritas secara individual.</li>
                                <li><strong>Usia Pengguna:</strong> Layanan bertransaksi ditujukan bagi pengguna yang sekurang-kurangnya berusia 18 tahun atau telah memiliki identitas hukum yang sah.</li>
                            </ul>
                        </section>

                        <section id="akun-pengguna" className="terms-section">
                            <div className="section-badge">PASAL 02</div>
                            <h2>Akun Pengguna &amp; Keamanan</h2>
                            <p>Untuk melakukan pemesanan dan mengakses fitur penuh Infinity Game, pengguna diwajibkan mendaftarkan akun dengan data yang valid dan terkini.</p>
                            <div className="terms-callout info">
                                <strong>Penting:</strong> Infinity Game tidak pernah meminta kata sandi (password), kode OTP, atau PIN transaksi Anda melalui pesan pribadi, telepon, atau email di luar domain resmi kami.
                            </div>
                            <ul>
                                <li><strong>Kerahasiaan Akun:</strong> Anda bertanggung jawab penuh atas kerahasiaan kredensial akun, termasuk username, kata sandi, dan riwayat pesanan.</li>
                                <li><strong>Aktivitas Mencurigakan:</strong> Apabila ditemukan dugaan pelanggaran atau pemalsuan identitas, Infinity Game berhak menangguhkan atau membekukan akun secara sepihak.</li>
                            </ul>
                        </section>

                        <section id="pemesanan-pembayaran" className="terms-section">
                            <div className="section-badge">PASAL 03</div>
                            <h2>Pemesanan &amp; Pembayaran</h2>
                            <p>Seluruh harga produk yang tercantum di Infinity Game dalam mata uang Rupiah (IDR) dan telah termasuk pajak yang berlaku sesuai regulasi perpajakan di Indonesia, kecuali disebutkan lain.</p>
                            <ul>
                                <li><strong>Verifikasi Pembayaran:</strong> Transaksi dinyatakan sah dan diproses setelah pembayaran diterima dan diverifikasi oleh sistem pembayaran resmi Infinity Game.</li>
                                <li><strong>Batas Waktu Pembayaran:</strong> Pengguna wajib menyelesaikan pembayaran dalam batas waktu yang ditentukan pada tagihan (invoice).</li>
                                <li><strong>Ketersediaan Stok:</strong> Stok konsol dan edisi kolektor dapat berubah sewaktu-waktu. Apabila terjadi selisih stok setelah pembayaran, Infinity Game akan menawarkan opsi penukaran produk atau pengembalian dana penuh (100% refund).</li>
                            </ul>
                        </section>

                        <section id="pengiriman-fisik" className="terms-section">
                            <div className="section-badge">PASAL 04</div>
                            <h2>Pengiriman Produk Fisik</h2>
                            <p>Infinity Game melayani pengiriman produk fisik (Konsol PS5, Nintendo Switch, Xbox, Kaset Game, Aksesori, serta Blu-Ray Movie) ke seluruh wilayah Indonesia melalui mitra logistik terpercaya.</p>
                            <ul>
                                <li><strong>Waktu Diproses:</strong> Pesanan fisik yang dibayar sebelum pukul 15.00 WIB akan diproses dan dikirim pada hari kerja yang sama.</li>
                                <li><strong>Asuransi Pengiriman:</strong> Untuk produk bernilai tinggi (seperti konsol PlayStation 5 atau Nintendo Switch 2), pengguna <em>sangat disarankan</em> mengaktifkan asuransi pengiriman.</li>
                                <li><strong>Nomor Resi:</strong> Nomor pelacakan logistik (resi) akan diperbarui di halaman akun pengguna paling lambat 24 jam setelah paket diserahkan kepada kurir.</li>
                            </ul>
                        </section>

                        <section id="voucher-digital" className="terms-section">
                            <div className="section-badge">PASAL 05</div>
                            <h2>Voucher &amp; Produk Digital</h2>
                            <p>Pembelian produk digital (seperti Steam Wallet Code, PlayStation Network Card, Xbox Live Gold, Nintendo eShop, dan langganan digital) tunduk pada kebijakan khusus distribusi digital.</p>
                            <div className="terms-callout warning">
                                <strong>Perhatian Khusus Produk Digital:</strong> Kode voucher digital yang telah diterbitkan dan dikirimkan ke akun/email pembeli bersifat <em>Non-Refundable</em> (tidak dapat dikembalikan atau ditukar) atas alasan salah beli regional atau kelalaian pengguna.
                            </div>
                            <ul>
                                <li><strong>Pengiriman Kode Instan:</strong> Kode digital dikirimkan secara otomatis melalui email dan riwayat transaksi akun dalam waktu 1&ndash;10 menit setelah verifikasi pembayaran berhasil.</li>
                                <li><strong>Regional Lock:</strong> Pastikan wilayah (region) akun game Anda sesuai dengan regional voucher yang dibeli (contoh: ID, US, JP, EU).</li>
                            </ul>
                        </section>

                        <section id="garansi-retur" className="terms-section">
                            <div className="section-badge">PASAL 06</div>
                            <h2>Garansi &amp; Pengembalian Produk (Return &amp; Refund)</h2>
                            <p>Kepuasan Anda adalah prioritas kami. Kami menyediakan kebijakan garansi dan retur yang adil dan transparan untuk produk cacat pabrik (factory defect).</p>
                            <ul>
                                <li><strong>Wajib Video Unboxing:</strong> Untuk mengajukan klaim kerusakan atau kekurangan produk fisik, pengguna wajib melampirkan <strong>video unboxing utuh tanpa jeda/edit</strong> sejak paket masih dalam keadaan tersegel resi pengiriman.</li>
                                <li><strong>Garansi Resmi Konsol:</strong> Produk konsol resmi (Sony Indonesia, Nintendo, Microsoft) dilindungi oleh garansi resmi distributor sesuai ketentuan surat garansi masing-masing merek.</li>
                                <li><strong>Batas Klaim Retur Toko:</strong> Klaim penukaran unit baru (1-to-1 replacement) akibat cacat pabrik berlaku maksimal 3x24 jam sejak paket dinyatakan diterima oleh sistem ekspedisi.</li>
                            </ul>
                        </section>

                        <section id="hak-cipta" className="terms-section">
                            <div className="section-badge">PASAL 07</div>
                            <h2>Hak Kekayaan Intelektual</h2>
                            <p>Seluruh nama, logo, ikon, desain tata letak, teks, grafik, dan perangkat lunak yang ada di situs Infinity Game merupakan kepemilikan sah Infinity Game dan dilindungi oleh Undang-Undang Hak Cipta serta Hak Kekayaan Intelektual Republik Indonesia.</p>
                        </section>

                        <section id="hukum-berlaku" className="terms-section">
                            <div className="section-badge">PASAL 08</div>
                            <h2>Hukum yang Berlaku &amp; Penyelesaian Sengketa</h2>
                            <p>Syarat dan Ketentuan ini diatur, ditafsirkan, dan tunduk pada hukum Republik Indonesia.</p>
                            <ul>
                                <li><strong>Musyawarah Mufakat:</strong> Segala bentuk perselisihan yang timbul sehubungan dengan transaksi atau layanan di Infinity Game akan diselesaikan terlebih dahulu melalui musyawarah untuk mencapai mufakat.</li>
                                <li><strong>Yurisdiksi Hukum:</strong> Apabila penyelesaian secara musyawarah tidak tercapai dalam jangka waktu 30 hari kalender, maka para pihak sepakat untuk menyelesaikan sengketa melalui Pengadilan Negeri Bandung, Jawa Barat.</li>
                            </ul>
                        </section>

                        <div className="terms-footer-box">
                            <div className="terms-footer-text">
                                <h4>Sudah memahami seluruh syarat dan ketentuan?</h4>
                                <p>Dengan melanjutkan pemesanan, Anda menyetujui seluruh ketentuan di atas.</p>
                            </div>
                            <div className="terms-footer-actions">
                                <Link href={route('products.index')} className="btn-primary">Mulai Belanja</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AppLayout>
    )
}
