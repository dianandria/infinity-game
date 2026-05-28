// resources/js/Pages/Admin/Orders/Index.jsx
import React from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import { formatIDR, badgeClass } from '@/utils/format';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ orders, filters, sort, summary }) {
  const { data, setData, get } = useForm({
    q: filters.q || '',
    status: filters.status || '',
    provider: filters.provider || '',
    date_from: filters.date_from || '',
    date_to: filters.date_to || '',
  });

  const submit = (e) => {
    e.preventDefault();
    get(route('admin.orders.index'), { preserveState: true, replace: true });
  };

  const toggleSort = (key) => {
    const dir = sort.sort === key && sort.dir === 'asc' ? 'desc' : 'asc';
    router.get(route('admin.orders.index'), { ...data, sort: key, dir }, { preserveState: true, replace: true });
  };

  const exportCsv = () => {
    const qs = new URLSearchParams({ ...data }).toString();
    window.location.href = route('admin.orders.export') + (qs ? `?${qs}` : '');
  };

  return (
    <AdminLayout mainPage="Orders" page="orders">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Orders</h1>
            <div className="flex gap-3">
            <div className="text-sm px-3 py-1 rounded bg-blue-50">Today: <b>{formatIDR(summary.today_total)}</b></div>
            <div className="text-sm px-3 py-1 rounded bg-green-50">Paid: <b>{summary.paid}</b></div>
            <div className="text-sm px-3 py-1 rounded bg-yellow-50">Pending: <b>{summary.pending}</b></div>
            <button onClick={exportCsv} className="bg-slate-800 text-white px-3 py-1.5 rounded">Export CSV</button>
            </div>
        </div>

        <form onSubmit={submit} className="grid md:grid-cols-5 gap-3 bg-white p-3 rounded border">
            <input placeholder="Search code/name/email/phone" className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            value={data.q} onChange={e=>setData('q', e.target.value)} />
            <select className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30e" value={data.status} onChange={e=>setData('status', e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="failed">failed</option>
            <option value="cancelled">cancelled</option>
            </select>
            <select className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" 
              value={data.provider} 
              onChange={e=>setData('provider', e.target.value)}>
              <option value="">All Providers</option>
              <option value="midtrans">midtrans</option>
              <option value="xendit">xendit</option>
              <option value="manual">manual</option>
            </select>
            <input type="date" className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" 
              value={data.date_from||''} 
              onChange={e=>setData('date_from', e.target.value)} 
            />
            <input type="date" className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30" 
              value={data.date_to||''} 
              onChange={e=>setData('date_to', e.target.value)} />
            <div className="md:col-span-5 flex gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">Filter</button>
            <button type="button" onClick={()=>{
                setData({ q:'',status:'',provider:'',date_from:'',date_to:'' });
                router.get(route('admin.orders.index'));
            }} className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-black transition rounded-lg bg-white shadow-theme-xs hover:bg-brand-600 ring-1 ring-inset ring-gray-300">Reset</button>
            </div>
        </form>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <table className="min-w-full">
              <thead>
                  <tr className="bg-gray-50">
                  {['code','created_at','customer','total','provider','status','actions'].map(h=>(
                      <th key={h} className="px-5 py-3 sm:px-6">
                      {['code','created_at','total'].includes(h)
                          ? <button onClick={()=>toggleSort(h)} className="font-medium">{h} {sort.sort===h ? (sort.dir==='asc'?'▲':'▼') : ''}</button>
                          : <span className="font-medium">{h}</span>
                      }
                      </th>
                  ))}
                  </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-800'>
                  {orders.data.map(o=>(
                  <tr key={o.id} className="border-t">
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{o.code}</p>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {new Date(o.created_at).toLocaleString()}
                          </p>
                        </div>                        
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {o.customer_name}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">{o.customer_email}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {formatIDR(o.total)}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {o.payment_provider || '-'}
                          </p>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${badgeClass(o.status)}`}>{o.status}</span>
                      </td>
                      <td className="px-3 py-2 flex justify-center">
                        <Link href={route('admin.orders.show', o.id)} 
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 transition rounded-lg bg-white shadow-theme-xs hover:bg-brand-600 ring-1 ring-inset ring-gray-300">View</Link>
                      </td>
                  </tr>
                  ))}
                  {orders.data.length === 0 && (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-gray-500">No orders found.</td></tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* pagination */}
        <div className="flex gap-2 flex-wrap">
            {orders.links.map((l,i)=>(
            <Link key={i}
                href={l.url || '#'}
                className={`flex items-center gap-2 rounded-lg border border-gray-300 px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5 sm:py-2.5 ${l.active ? 'bg-brand-500 text-white' : 'bg-white'}`}
                dangerouslySetInnerHTML={{__html: l.label}} />
            ))}
        </div>
      </div>
    </AdminLayout>
  );
}
