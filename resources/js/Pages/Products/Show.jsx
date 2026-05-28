import React, { useState } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { router } from '@inertiajs/react'
import { route } from 'ziggy-js'

function Currency({ value }) {
  return <>Rp {Number(value || 0).toLocaleString('id-ID')}</>
}

function RelatedGrid({ items }) {
  if (!items?.length) return null
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">Produk lainnya</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(p => (
          <Link key={p.id} href={route('products.show', p.slug)} className="rounded-2xl border bg-white shadow-sm hover:shadow-md">
            <img className="aspect-square w-full object-cover rounded-t-2xl" src={p.image_url || 'https://via.placeholder.com/600'} alt={p.name} loading="lazy" />
            <div className="p-3 rounded-b-2xl product-info">
              <h3 className="line-clamp-1 font-semibold text-white">{p.name}</h3>
              <div className='mt-auto flex items-center justify-between pt-2'>
                <div className="text-sm text-white font-semibold"><Currency value={p.price} /></div>
                <Link
                  href={`/products/${p.slug}`}
                  className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-primary hover:bg-gray-200"
                >
                  Lihat
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Show() {
  const { product, related } = usePage().props
  const [qty, setQty] = useState(1)

  const addToCart = () => {
    router.post(route('cart.store'), { product_id: product.id, qty }, {
      preserveScroll: true,
    })
  }

  const inStock = Number(product.stock) > 0

  // --- GALLERY STATE ---
  const images =
  product.images?.length > 0
    ? product.images.map((img) => img.url).filter(Boolean)
    : product.image_url
      ? [product.image_url]
      : ['https://via.placeholder.com/900']

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const goPrev = () => {
    setCurrentImageIndex(prev =>
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const goNext = () => {
    setCurrentImageIndex(prev =>
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <AppLayout>
      <Head title={product.name}  />
      <div className="mx-auto max-w-6xl px-4 py-6">
       {/* <Head>
          <title>{product.name} – Catalog</title>
          <meta name="description" content={(product.description || '').slice(0, 150)} />
          <meta property="og:title" content={product.name} />
          <meta property="og:description" content={(product.description || '').slice(0, 150)} />
          <meta property="og:image" content={product.image_url || ''} />
        </Head>*/}

        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-gray-500">
          <Link href={route('products.index')} className="hover:underline">Produk</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid gap-6 md:grid-cols-2">
          {/* IMAGE GALLERY */}
          <div className="rounded-2xl border bg-white p-3 shadow-sm">
            {/* Main image + arrows */}
            <div className="relative">
              <img
                className="aspect-square w-full rounded-xl object-cover"
                src={images[currentImageIndex]}
                alt={product.name}
              />

              {images.length > 1 && (
                <>
                  {/* Left arrow */}
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-sm shadow hover:bg-white text-gray-800"
                  >
                    ‹
                  </button>

                  {/* Right arrow */}
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-sm shadow hover:bg-white text-gray-800"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border ${
                      idx === currentImageIndex
                        ? ''
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

            <div className="mt-2 text-xl font-semibold text-gray-800">
              <Currency value={product.price} />
            </div>

            <div className="mt-2">
              {inStock ? (
                <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                  In stock: {product.stock}
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-rose-100 px-2 py-1 text-xs font-medium text-rose-800">
                  Out of stock
                </span>
              )}
            </div>

            <p className="prose prose-sm mt-4 max-w-none text-gray-700">
              {product.description || 'No description.'}
            </p>

            {/* Qty + CTA */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-xl border background-primary h-[38px]">
                <button
                  type="button"
                  className="px-3 py-2"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                >−</button>
                <input
                  className="w-14 border-x text-center outline-none text-gray-800 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none overflow-hidden h-[34px]"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))}
                />
                <button
                  type="button"
                  className="px-3 py-2"
                  onClick={() => setQty(q => q + 1)}
                >+</button>
              </div>

              <button
                disabled={!inStock}
                onClick={addToCart}
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white
                  ${inStock ? 'background-primary' : 'bg-gray-400 cursor-not-allowed'}
                `}
              >
                {inStock ? 'Add to cart' : 'Unavailable'}
              </button>
            </div>

            {/* Meta kecil */}
            <div className="mt-3 text-xs text-gray-500">
              SKU: #{product.id} • Secure checkout • Fast shipping
            </div>
          </div>
        </div>

        <RelatedGrid items={related} />
      </div>
    </AppLayout>
  )
}
