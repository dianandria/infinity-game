import React, { useState } from 'react'
import { Link, router, usePage, Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

function SkeletonCard() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-2/3 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="h-8 w-full skeleton rounded-xl" />
      </div>
    </div>
  )
}

const categoryOrder = ['Jepang', 'Korea', 'China', 'Thailand', 'Eropa', 'Lainnya']

function getProductCategories(product) {
  if (!product.categories || product.categories.length === 0) return 'Lainnya'

  const categoryNames = product.categories
    .map((category) => category.name)
    .filter((name) => categoryOrder.includes(name))
    .sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b))

  return categoryNames.length > 0 ? categoryNames.join(', ') : 'Lainnya'
}

function addToCart(product) {
  router.post(
    route('cart.store'),
    { product_id: product.id, qty: 1 },
    { preserveScroll: true }
  )
}

function ProductCard({ p }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${p.slug}`}>
        <div className="relative overflow-hidden">
          <img
            className="aspect-square w-full object-cover transition group-hover:scale-[1.02]"
            src={p.image_url || 'https://via.placeholder.com/600'}
            alt={p.name}
            loading="lazy"
          />
          {p.stock <= 0 && (
            <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
              Out of stock
            </span>
          )}
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-3 product-info">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-white/80">
          {getProductCategories(p)}
        </p>
        <Link href={`/products/${p.slug}`}>
          <h3 className="font-semibold line-clamp-1 text-white" title={p.name}>{p.name}</h3>
        </Link>
        <div className='mt-auto flex items-center justify-between gap-3 pt-2'>
          <h3 className="mt-1 font-semibold text-sm text-white">
            Rp {Number(p.price).toLocaleString('id-ID')}
          </h3>
          <button
            type="button"
            onClick={() => addToCart(p)}
            disabled={Number(p.stock) <= 0}
            className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-primary hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {Number(p.stock) <= 0 ? 'Habis' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Pagination({ links }) {
  if (!links || links.length <= 1) return null
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-gray-800">
      {links.map((l, i) => (
        <Link
          key={i}
          href={l.url || '#'}
          preserveScroll
          className={[
            "rounded-xl border px-3 py-2 text-sm",
            l.active ? "background-primary text-white" : "hover:bg-gray-100",
            !l.url && "pointer-events-none opacity-50"
          ].join(' ')}
          dangerouslySetInnerHTML={{ __html: l.label }}
        />
      ))}
    </div>
  )
}

export default function Index() {
  const { products, filters, headerCategories } = usePage().props
  
  const [q, setQ]                   = useState(filters?.q || '')
  const [sort, setSort]             = useState(filters?.sort || 'new')
  const [categoryId, setCategoryId] = useState(filters?.category_id || '')
  const [loading, setLoading]       = useState(false)

  const submit = (params) => {
    setLoading(true)
    router.get(route('products.index'), params, {
      preserveState: true, 
      preserveScroll: true,
      onFinish: () => setLoading(false),
    })
  }

  const onSearch = (e) => {
    e.preventDefault()
    submit({ q, sort, category_id: categoryId })
  }

  return (
    <AppLayout>
      <Head title="Belanja souvenir dunia, langsung di sini !" />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold text-gray-800">Semua produk</h1>
          <form onSubmit={onSearch} className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <input
              className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-800"
              placeholder="Cari produk..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {/* 2. Map over headerCategories here */}
            <select
              className="rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-800"
              value={categoryId}
              onChange={(e) => { 
                setCategoryId(e.target.value); 
                submit({ q, sort, category_id: e.target.value }) 
              }}
            >
              <option value="">Semua Kategori</option>
              {headerCategories && headerCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            
            <select
              className="rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-800"
              value={sort}
              onChange={(e) => { setSort(e.target.value); submit({ q, sort: e.target.value }) }}
            >
              <option value="new">Terbaru</option>
              <option value="price_asc">Harga: Terendah → Tertinggi</option>
              <option value="price_desc">Harga: Tertinggi → Terendah</option>
            </select>
            <button type="submit" className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-100 text-gray-800">
              {loading ? 'Cari' : 'Cari'}
            </button>
          </form>
        </div>

        {loading && products.data.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.data.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
            <Pagination links={products.links} />
          </>
        )}
      </div>
    </AppLayout>
  )
}
