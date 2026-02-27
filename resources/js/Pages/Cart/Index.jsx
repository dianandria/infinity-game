import React from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

const fmt = (n) => `Rp ${Number(n||0).toLocaleString('id-ID')}`

function LineItem({ it }) {
  const dec = () => router.patch(route('cart.update', it.product_id), { qty: Math.max(1, it.qty - 1) }, { preserveScroll: true })
  const inc = () => router.patch(route('cart.update', it.product_id), { qty: it.qty + 1 }, { preserveScroll: true })
  const removeIt = () => router.delete(route('cart.destroy', it.product_id), { preserveScroll: true })
  
  return (
    <div className="flex items-center gap-3 rounded-2xl border p-3">
      <img src={it.image_url || 'https://via.placeholder.com/200'} alt={it.name} className="h-20 w-20 rounded-lg object-cover" />
      <div className="flex-1">
        <Link href={route('products.show', it.slug)} className="font-medium hover:underline line-clamp-1 text-gray-800">{it.name}</Link>
        <div className="text-sm text-gray-500">Harga: {fmt(it.price)}</div>
        <div className="mt-2 inline-flex items-center rounded-xl border bg-gray-800">
          <button className="px-3 py-1" onClick={dec}>−</button>
          <input className="w-12 border-x text-center text-gray-800" readOnly value={it.qty} />
          <button className="px-3 py-1" onClick={inc}>+</button>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-800">{fmt(it.subtotal)}</div>
        <button className="mt-2 text-sm text-rose-600 hover:underline" onClick={removeIt}>Remove</button>
      </div>
    </div>
  )
}

export default function Index() {
  const { cart } = usePage().props

  return (
    <AppLayout>
      <Head title="Cart" />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="rounded-2xl border p-8 text-center">
            <p className="text-gray-600">Keranjang kamu masih kosong.</p>
            <Link href={route('products.index')} className="mt-4 inline-flex rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-black">Mulai belanja</Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Items */}
            <div className="md:col-span-2 space-y-3">
              {cart.items.map(it => <LineItem key={it.product_id} it={it} />)}
            </div>

            {/* Summary */}
            <aside className="h-fit rounded-2xl border p-4">
              <h2 className="mb-3 text-lg font-semibold text-gray-800">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-800"><span>Subtotal</span><span>{fmt(cart.subtotal)}</span></div>
                <div className="flex justify-between text-gray-800"><span>Shipping</span><span>{fmt(cart.shipping)}</span></div>
                <hr className="my-2 border-gray-200" />
                <div className="flex justify-between text-base font-semibold text-gray-800"><span>Total</span><span>{fmt(cart.total)}</span></div>
              </div>

              <button
                className="mt-4 w-full rounded-xl bg-gray-900 px-4 py-2 text-white hover:bg-black"
                onClick={() => router.get(route('checkout.create'))}
              >
                Checkout
              </button>

              <button
                className="mt-2 w-full rounded-xl border px-4 py-2 text-gray-800"
                onClick={() => router.delete(route('cart.clear'), { preserveScroll: true })}
              >
                Clear cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
