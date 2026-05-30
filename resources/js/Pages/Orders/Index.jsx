import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Index() {
    const { orders } = usePage().props;    // ini sekarang paginator
    const hasOrders = orders.data.length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="My Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {!hasOrders && (
                                <p className="text-sm text-gray-600">
                                    Kamu belum punya order.
                                </p>
                            )}

                            {hasOrders && (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    <th className="px-4 py-3">Code</th>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Total</th>
                                                    <th className="px-4 py-3">Payment</th>
                                                    <th className="px-4 py-3">Status</th>
                                                    <th className="px-4 py-3">Detail</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.data.map((order) => (
                                                    <tr key={order.id} className="border-b last:border-none">
                                                        <td className="px-4 py-3 font-medium text-gray-800">
                                                            {order.code}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600">
                                                            {order.created_at
                                                                ? new Date(order.created_at).toLocaleString('id-ID')
                                                                : '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-800">
                                                            Rp{' '}
                                                            {Number(order.total ?? 0)
                                                                .toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600">
                                                            {order.payment_provider || '-'}
                                                            {order.paid_at && (
                                                                <span className="ml-2 inline-flex rounded-full bg-green-100 px-2 text-xs font-medium text-green-700">
                                                                    Paid
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-medium text-gray-700">
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <Link
                                                                href={route('orders.show', order.id)}
                                                                className="text-xs font-semibold text-indigo-600 hover:underline"
                                                            >
                                                                Lihat
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-4 flex justify-between items-center text-xs text-gray-600">
                                        <div>
                                            Menampilkan {orders.from}–{orders.to} dari {orders.total} order
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {orders.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    preserveScroll
                                                    className={
                                                        'inline-flex items-center rounded px-2 py-1 ' +
                                                        (link.active
                                                            ? 'bg-gray-900 text-white text-xs'
                                                            : link.url
                                                            ? 'text-gray-700 hover:bg-gray-100 text-xs'
                                                            : 'text-gray-400 cursor-default text-xs')
                                                    }
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
