import React, { useState } from 'react'
import { Link, router, usePage, Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString('id-ID')}`

function addToCart(product) {
  router.post(
    route('cart.store'),
    { product_id: product.id, qty: 1 },
    { preserveScroll: true }
  )
}

function ProductCard({ p }) {
  const outOfStock = Number(p.stock) <= 0
  return (
    <div className="product-card">
      {outOfStock && <span className="badge out-of-stock">Out of stock</span>}
      <Link href={route('products.show', p.slug)} className="product-img">
        <img src={p.image_url || '/images/about-us.jpg'} alt={p.name} loading="lazy" />
      </Link>
      <div className="card-body">
        <span className="category">
          {p.categories?.[0]?.name || 'Game'}
        </span>
        <h3 className="product-title">
          <Link href={route('products.show', p.slug)}>{p.name}</Link>
        </h3>
        <div className="card-footer">
          <span className="price">{fmt(p.price)}</span>
          <button
            type="button"
            className="btn-cart"
            disabled={outOfStock}
            onClick={() => addToCart(p)}
          >
            {outOfStock ? 'Habis' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Pagination({ links }) {
  if (!links || links.length <= 3) return null
  return (
    <div className="pagination all-products-pagination">
      {links.map((l, i) => (
        <Link
          key={i}
          href={l.url || '#'}
          preserveScroll
          className={[
            'page-btn',
            l.active ? 'active' : '',
            !l.url ? 'disabled' : '',
          ].filter(Boolean).join(' ')}
          dangerouslySetInnerHTML={{ __html: l.label }}
        />
      ))}
    </div>
  )
}

export default function Index() {
  const { products, filters, headerCategories } = usePage().props

  const [q, setQ] = useState(filters?.q || '')
  const [sort, setSort] = useState(filters?.sort || 'new')
  const [categoryId, setCategoryId] = useState(filters?.category_id || '')

  const submit = (params) => {
    router.get(route('products.index'), params, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const onSearch = (e) => {
    e.preventDefault()
    submit({ q, sort, category_id: categoryId })
  }

  return (
    <AppLayout>
      <Head title="Semua Produk - Infinity Game" />

      <main className="catalog-page">
        <div className="filter-section all-products-filter">
          <h2>Semua produk</h2>
          <form className="filter-controls" onSubmit={onSearch}>
            <input
              type="text"
              placeholder="Cari produk..."
              className="filter-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="filter-select"
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); submit({ q, sort, category_id: e.target.value }) }}
            >
              <option value="">Semua Kategori</option>
              {headerCategories && headerCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <select
              className="filter-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); submit({ q, sort: e.target.value, category_id: categoryId }) }}
            >
              <option value="new">Terbaru</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
            </select>
            <button type="submit" className="btn-primary">Cari</button>
          </form>
        </div>

        {products.data.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '3rem 0', color: '#666' }}>
            Belum ada produk yang cocok dengan pencarian kamu.
          </p>
        ) : (
          <>
            <div className="product-grid">
              {products.data.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
            <Pagination links={products.links} />
          </>
        )}
      </main>
    </AppLayout>
  )
}
