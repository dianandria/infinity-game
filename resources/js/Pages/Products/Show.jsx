import React, { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`

function RelatedGrid({ items }) {
  if (!items?.length) return null
  return (
    <section className="related-products-section">
      <h2 className="section-title">Produk Terkait</h2>
      <div className="product-grid">
        {items.map((p) => {
          const outOfStock = Number(p.stock) <= 0
          return (
            <div key={p.id} className="product-card">
              {outOfStock && <span className="badge out-of-stock">Out of stock</span>}
              <Link href={route('products.show', p.slug)} className="product-img">
                <img src={p.image_url || '/images/about-us.jpg'} alt={p.name} loading="lazy" />
              </Link>
              <div className="card-body">
                <span className="category">{p.categories?.[0]?.name || 'Game'}</span>
                <h3 className="product-title">
                  <Link href={route('products.show', p.slug)}>{p.name}</Link>
                </h3>
                <div className="card-footer">
                  <span className="price">{fmt(p.price)}</span>
                  <button
                    type="button"
                    className="btn-cart"
                    disabled={outOfStock}
                    onClick={() =>
                      router.post(route('cart.store'), { product_id: p.id, qty: 1 }, { preserveScroll: true })
                    }
                  >
                    {outOfStock ? 'Habis' : 'Add to cart'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function Show() {
  const { product, related } = usePage().props
  const [qty, setQty] = useState(1)
  const inStock = Number(product.stock) > 0
  const category = product.categories?.[0]

  const images =
    product.images?.length > 0
      ? product.images.map((img) => img.url).filter(Boolean)
      : product.image_url
        ? [product.image_url]
        : ['/images/about-us.jpg']

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const addToCart = () => {
    router.post(route('cart.store'), { product_id: product.id, qty }, { preserveScroll: true })
  }

  return (
    <AppLayout>
      <Head title={`${product.name} - Infinity Game`} />

      <main className="detail-page">
        <div className="breadcrumb-detail">
          <Link href={route('home.index')}>Home</Link> <span>/</span>
          {category ? (
            <>
              <Link href={route('category.show', category.slug)}>{category.name}</Link> <span>/</span>
            </>
          ) : (
            <>
              <Link href={route('products.index')}>Produk</Link> <span>/</span>
            </>
          )}
          <span className="current">{product.name}</span>
        </div>

        <section className="product-detail-section">
          <div className="product-gallery">
            <img src={images[currentImageIndex]} alt={product.name} />
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    style={{
                      border: idx === currentImageIndex ? '2px solid #8D0B3E' : '2px solid transparent',
                      borderRadius: '8px',
                      padding: 0,
                      overflow: 'hidden',
                      width: 64,
                      height: 64,
                      cursor: 'pointer',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info-detail">
            <span className="category">{category?.name || 'Game'}</span>
            <h1>{product.name}</h1>
            <div className="price-large">{fmt(product.price)}</div>

            <div className="product-description">
              <p>{product.description || 'Belum ada deskripsi untuk produk ini.'}</p>
            </div>

            <div className="action-area">
              <div className="qty-wrapper">
                <button
                  type="button"
                  className="btn-qty btn-qty-minus"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="qty-input"
                  value={qty}
                  min={1}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                />
                <button
                  type="button"
                  className="btn-qty btn-qty-plus"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="btn-add-large"
                disabled={!inStock}
                onClick={addToCart}
              >
                {inStock ? 'Masukkan Keranjang' : 'Stok Habis'}
              </button>
            </div>

            <div className="extra-info">
              <span><strong>SKU:</strong> {product.sku || `INF-${product.id}`}</span>
              <span><strong>Kategori:</strong> {category?.name || 'Game'}</span>
              <span>
                <strong>Status:</strong>{' '}
                <span className="status-stock">
                  {inStock ? 'Tersedia (In Stock)' : 'Habis (Out of Stock)'}
                </span>
              </span>
            </div>
          </div>
        </section>

        <RelatedGrid items={related} />
      </main>
    </AppLayout>
  )
}
