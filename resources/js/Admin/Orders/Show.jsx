// resources/js/Pages/Admin/Orders/Show.jsx
import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { formatIDR, badgeClass } from '@/utils/format';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Show({ order }) {
  const { data, setData, post, processing } = useForm({
    status: order.status,
    shipping_awb: order.shipping_awb || '',
  });

  const updateStatus = (e) => {
    e.preventDefault();
    post(route('admin.orders.status', order.id), { data, preserveScroll: true });
  };

  const updateShipping = (e) => {
    e.preventDefault();
    post(route('admin.orders.shipping', order.id), { data, preserveScroll: true });
  };

  const addr = order.shipping_address || {};

  return (
    <AdminLayout mainPage="Orders" page="orders">
        <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Order {order.code}</h1>
            <Link href={route('admin.orders.index')} className="text-blue-600">← Back</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
            <div className="bg-white rounded border p-4">
                <div className="flex items-center justify-between mb-2">
                <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-sm text-gray-600">{order.customer_email} · {order.customer_phone || '-'}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${badgeClass(order.status)}`}>{order.status}</span>
                </div>
                <div className="text-sm text-gray-700">
                <div><b>Date:</b> {new Date(order.created_at).toLocaleString()}</div>
                <div><b>Payment:</b> {order.payment_provider || '-'} {order.payment_ref ? `· ${order.payment_ref}` : ''}</div>
                </div>
            </div>

            <div className="bg-white rounded border p-4">
                <div className="font-medium mb-2">Items</div>
                <table className="w-full text-sm">
                <thead><tr className="text-left text-gray-600">
                    <th className="py-1">Product</th><th className="py-1">Price</th><th className="py-1">Qty</th><th className="py-1 text-right">Subtotal</th>
                </tr></thead>
                <tbody>
                    {order.items.map(it=>(
                    <tr key={it.id} className="border-t">
                        <td className="py-1">{it.name}</td>
                        <td className="py-1">{formatIDR(it.price)}</td>
                        <td className="py-1">{it.qty}</td>
                        <td className="py-1 text-right">{formatIDR(it.subtotal)}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            <div className="space-y-3">
            <div className="bg-white rounded border p-4">
                <div className="font-medium mb-2">Shipping Address</div>
                <div className="text-sm text-gray-700 space-y-0.5">
                <div>{addr.name || order.customer_name}</div>
                <div>{[addr.address, addr.district].filter(Boolean).join(', ')}</div>
                <div>{[addr.city, addr.province, addr.postal].filter(Boolean).join(', ')}</div>
                <div>{addr.country}</div>
                </div>
            </div>

            <div className="bg-white rounded border p-4">
                <div className="font-medium mb-2">Totals</div>
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatIDR(order.subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span>Shipping</span><span>{formatIDR(order.shipping_fee)}</span></div>
                <div className="flex justify-between text-sm"><span>Payment Fee</span><span>{formatIDR(order.payment_fee)}</span></div>
                <div className="flex justify-between text-sm"><span>Discount</span><span>-{formatIDR(order.discount)}</span></div>
                <div className="flex justify-between font-semibold mt-1"><span>Total</span><span>{formatIDR(order.total)}</span></div>
            </div>

            <form onSubmit={updateShipping} className="bg-white rounded border p-4 space-y-2">
              <div className="font-medium">Pengiriman</div>
              <div className="text-sm text-gray-700">
                <div><b>Kurir:</b> {order.shipping_code ? order.shipping_code.toUpperCase() : ''}</div>
                <div className='mt-2'><b>Layanan:</b> {order.shipping_service}</div>
              </div>
              <hr />
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Nomor Resi</label>
                <input
                  className="border rounded px-3 py-2 w-full"
                  value={data.shipping_awb}
                  onChange={(e) => setData('shipping_awb', e.target.value)}
                  placeholder="Masukkan nomor resi"
                />
              </div>

              <button disabled={processing} className="bg-slate-800 text-white px-3 py-2 rounded w-full">
                Save Resi
              </button>
            </form>

            <form onSubmit={updateStatus} className="bg-white rounded border p-4 space-y-2">
                <div className="font-medium">Update Status</div>
                <select className="border rounded px-3 py-2 w-full"
                value={data.status} onChange={e=>setData('status', e.target.value)}>
                {['pending','paid','failed','cancelled'].map(s=>(
                    <option key={s} value={s}>{s}</option>
                ))}
                </select>
                <button disabled={processing} className="bg-slate-800 text-white px-3 py-2 rounded w-full">Save</button>
            </form>
            </div>
        </div>
        </div>
    </AdminLayout>
  );
}
