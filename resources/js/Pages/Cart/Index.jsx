import React from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`

function CartItem({ it }) {
  const dec = () => router.patch(route('cart.update', it.product_id), { qty: Math.max(1, it.qty - 1) }, { preserveScroll: true })
  const inc = () => router.patch(route('cart.update', it.product_id), { qty: it.qty + 1 }, { preserveScroll: true })
  const removeIt = () => router.delete(route('cart.destroy', it.product_id), { preserveScroll: true })

  return (
    <div className="cart-item">
      <img src={it.image_url || '/images/about-us.jpg'} alt={it.name} className="item-img" />
      <div className="item-info">
        <Link href={route('products.show', it.slug)} className="item-name">{it.name}</Link>
        <p className="item-category">{it.category_name || 'Game'}</p>
      </div>
      <div className="item-qty-wrapper">
        <div className="item-qty">
          <button type="button" className="qty-btn minus" onClick={dec}>-</button>
          <input type="text" value={it.qty} className="qty-input" readOnly />
          <button type="button" className="qty-btn plus" onClick={inc}>+</button>
        </div>
      </div>
      <div className="item-price-wrapper">
        <span className="item-price">{fmt(it.subtotal)}</span>
      </div>
      <button type="button" className="remove-btn" title="Hapus Item" onClick={removeIt}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

export default function Index() {
  const { cart } = usePage().props

  return (
    <AppLayout>
      <Head title="Keranjang Belanja - Infinity Game" />

      <main className="cart-page">
        <div className="cart-container">
          <h2 className="cart-title">Keranjang Belanja</h2>

          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <p style={{ marginBottom: '1rem', color: '#666' }}>Keranjang kamu masih kosong.</p>
              <Link href={route('products.index')} className="btn-primary">Mulai Belanja</Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                {cart.items.map((it) => <CartItem key={it.product_id} it={it} />)}
              </div>

              <div className="cart-summary-wrapper">
                <div className="cart-summary">
                  <h3>Ringkasan Belanja</h3>
                  <div className="summary-content">
                    <div className="summary-row">
                      <span className="summary-label">Total Produk</span>
                      <span className="summary-value">{fmt(cart.subtotal)}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Biaya Pengiriman</span>
                      <span className="summary-value">Dihitung saat checkout</span>
                    </div>
                    <hr className="summary-divider" />
                    <div className="summary-row total">
                      <span className="summary-label">Total Pembayaran</span>
                      <span className="summary-value-total">{fmt(cart.total)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-checkout"
                    onClick={() => router.get(route('checkout.create'))}
                  >
                    Checkout Sekarang
                  </button>
                  <Link href={route('products.index')} className="continue-shopping">
                    &larr; Lanjut Belanja
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  )
}
