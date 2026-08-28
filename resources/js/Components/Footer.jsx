import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Terima kasih! Email ${email} telah berlangganan newsletter kami.`);
    setEmail("");
  };

  return (
    <footer>
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <Link href="/">
              <img src="/images/logo-white.png" alt="Infinity Game Logo" />
            </Link>
          </div>
          <p>
            Penuhi kebutuhan gaming dan film di Infinity Game.<br />Kualitas, terpercaya dan tanpa batas.
          </p>
          <p>Kirim ke seluruh Indonesia dengan pengiriman cepat &amp; aman.</p>
        </div>

        <div className="footer-links">
          <h4>Shop</h4>
          <ul>
            <li><Link href={route("home.index")}>Home</Link></li>
            <li><Link href={route("products.index")}>Semua Produk</Link></li>
            <li><Link href="/cart">Cart</Link></li>
            <li><Link href="/checkout">Checkout</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><Link href="/term-condition">Syarat &amp; Ketentuan</Link></li>
            <li><Link href="/refund-policy">Kebijakan Pengembalian</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Kontak Kami</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Newsletter</h4>
          <p>Dapatkan info promo &amp; produk terbaru langsung ke email</p>
          <form className="newsletter-form" onSubmit={onSubscribe}>
            <input
              type="email"
              placeholder="Email Kamu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
      </div>

      <div className="footer-contact-bar">
        <address>
          <strong>Infinity Game</strong> — Toko Game Bandung, Jl. Purnawarman No.13-15 L2 – B07, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117
        </address>
        <span className="footer-contact-sep" aria-hidden="true">•</span>
        <span>
          <strong>Telp/WA:</strong>{' '}
          <a href="https://wa.me/6281123456789" target="_blank" rel="noreferrer">+62 811-2345-6789</a>
        </span>
        <span className="footer-contact-sep" aria-hidden="true">•</span>
        <span><strong>Email:</strong> support@infinitygame.id</span>
        <span className="footer-contact-sep" aria-hidden="true">•</span>
        <span><strong>Jam Buka:</strong> Setiap Hari, 10:00 - 22:00 WIB</span>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Infinity Game. All rights reserved.</p>
      </div>
    </footer>
  );
}
