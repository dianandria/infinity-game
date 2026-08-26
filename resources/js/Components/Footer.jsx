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

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Infinity Game. All rights reserved.</p>
      </div>
    </footer>
  );
}
