// resources/js/utils/format.js
export const formatIDR = (v) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v || 0);

export const badgeClass = (status) => ({
  pending:   'bg-yellow-100 text-yellow-800',
  paid:      'bg-green-100 text-green-800',
  failed:    'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-700',
}[status] || 'bg-gray-100 text-gray-800');
