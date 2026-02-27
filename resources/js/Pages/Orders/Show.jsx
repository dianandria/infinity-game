import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Show() {
    const { order } = usePage().props;

    const [tracking, setTracking] = useState({
        loading: false,
        error: null,
        data: null,
    });

    const hasTrackingInfo = !!order.shipping_code && !!order.shipping_awb;

    const loadTracking = async () => {
        if (!hasTrackingInfo) return;

        setTracking({ loading: true, error: null, data: null });

        try {
            const res = await fetch(route('orders.tracking', order.id), {
                headers: {
                    'Accept': 'application/json',
                },
            });

            const json = await res.json();

            if (!res.ok) {
                setTracking({
                    loading: false,
                    error: json.message || 'Gagal mengambil tracking.',
                    data: null,
                });
                return;
            }

            setTracking({
                loading: false,
                error: null,
                data: json.data,
            });
        } catch (e) {
            setTracking({
                loading: false,
                error: 'Terjadi kesalahan jaringan.',
                data: null,
            });
        }
    };

    useEffect(() => {
        loadTracking();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formatCurrency = (v) =>
        `Rp ${Number(v ?? 0).toLocaleString('id-ID')}`;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Order {order.code}
                </h2>
            }
        >
            <Head title={`Order ${order.code}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Info utama */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Order Code
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {order.code}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {order.created_at
                                        ? new Date(order.created_at).toLocaleString('id-ID')
                                        : ''}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase text-gray-700">
                                    {order.status}
                                </span>
                                {order.paid_at && (
                                    <div className="mt-2 text-xs text-green-700">
                                        Paid at{' '}
                                        {new Date(order.paid_at).toLocaleString('id-ID')}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-6 px-6 py-4 md:grid-cols-3">
                            {/* Customer */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    Customer
                                </h3>
                                <p className="text-sm text-gray-700">
                                    {order.customer_name}
                                    <br />
                                    {order.customer_email}
                                    <br />
                                    {order.customer_phone}
                                </p>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    Shipping Address
                                </h3>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {order.shipping_address.address}
                                </p>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {order.shipping_address.district}, {order.shipping_address.city}
                                </p>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                    {order.shipping_address.province}, {order.shipping_address.postal}
                                </p>
                            </div>

                            {/* Payment & total */}
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    Payment
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Provider:{' '}
                                    <span className="font-medium">
                                        {order.payment_provider || '-'}
                                    </span>
                                    <br />
                                    Ref:{' '}
                                    <span className="font-mono text-xs">
                                        {order.payment_ref || '-'}
                                    </span>
                                </p>
                                <div className="mt-2 space-y-1 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>{formatCurrency(order.shipping_fee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Payment Fee</span>
                                        <span>{formatCurrency(order.payment_fee)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Discount</span>
                                        <span>-{formatCurrency(order.discount)}</span>
                                    </div>
                                    <div className="mt-1 flex justify-between border-t pt-2 text-base font-semibold">
                                        <span>Total</span>
                                        <span>{formatCurrency(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b px-6 py-4">
                            <h3 className="text-sm font-semibold text-gray-800">
                                Items
                            </h3>
                        </div>
                        <div className="px-6 py-4">
                            {order.items.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    Tidak ada item di order ini.
                                </p>
                            )}

                            {order.items.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                <th className="px-3 py-2">Product</th>
                                                <th className="px-3 py-2">Price</th>
                                                <th className="px-3 py-2">Qty</th>
                                                <th className="px-3 py-2">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item) => (
                                                <tr key={item.id} className="border-b last:border-none">
                                                    <td className="px-3 py-2 text-gray-800">
                                                        {item.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-700">
                                                        {formatCurrency(item.price)}
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-700">
                                                        {item.qty}
                                                    </td>
                                                    <td className="px-3 py-2 text-gray-800">
                                                        {formatCurrency(item.subtotal)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tracking */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h3 className="text-sm font-semibold text-gray-800">
                                Tracking Pengiriman
                            </h3>

                            {hasTrackingInfo && (
                                <button
                                    onClick={loadTracking}
                                    className="text-xs font-medium text-indigo-600 hover:underline"
                                    type="button"
                                >
                                    Refresh
                                </button>
                            )}
                        </div>

                        <div className="px-6 py-4">
                            {!hasTrackingInfo && (
                                <p className="text-sm text-gray-500">
                                    Nomor resi atau kurir belum tersedia untuk order ini.
                                </p>
                            )}

                            {hasTrackingInfo && (
                                <>
                                    <p className="mb-3 text-sm text-gray-700">
                                        Kurir:{' '}
                                        <span className="font-semibold uppercase">
                                            {order.shipping_code}
                                        </span>{' '}
                                        · Resi:{' '}
                                        <span className="font-mono text-xs">
                                            {order.shipping_awb}
                                        </span>
                                    </p>

                                    {tracking.loading && (
                                        <p className="text-sm text-gray-500">
                                            Mengambil data tracking...
                                        </p>
                                    )}

                                    {tracking.error && (
                                        <p className="text-sm text-red-600">
                                            {tracking.error}
                                        </p>
                                    )}

                                    {tracking.data && (
                                        <div className="space-y-3">
                                            {tracking.data.summary && (
                                                <div className="rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-700">
                                                    Status:{' '}
                                                    <span className="font-semibold">
                                                        {tracking.data.summary.status}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                {tracking.data.manifest?.map((m, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex gap-3 text-xs text-gray-700"
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <div className="h-2 w-2 rounded-full bg-gray-700" />
                                                            {idx !== tracking.data.manifest.length - 1 && (
                                                                <div className="h-full w-px bg-gray-300" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold">
                                                                {m.date} {m.time}
                                                            </div>
                                                            <div>{m.description}</div>
                                                            {m.city && (
                                                                <div className="text-[11px] text-gray-500">
                                                                    {m.city}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <Link
                            href={route('dashboard')}
                            className="text-sm font-medium text-indigo-600 hover:underline"
                        >
                            ← Kembali ke daftar order
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}