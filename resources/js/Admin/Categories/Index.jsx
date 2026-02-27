import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ categories, filters }) {
  const onSearch = (e) => {
    router.get(route('admin.categories.index'), { search: e.target.value }, { preserveState: true });
  };

  return (
    <>
    <AdminLayout mainPage="Products" page="categories">
        <Head title="categories" />
        <div className="flex items-center justify-between mb-4">
            <input
            defaultValue={filters?.search || ""}
            onChange={onSearch}
            placeholder="Search…"
            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-1/3 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
            <Link href={route('admin.categories.create')} className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
            + New Categories
            </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                            <th className="px-5 py-3 sm:px-6">
                                <div className="flex items-center">
                                <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400" >
                                    Banner
                                </p>
                                </div>
                            </th>
                            <th className="px-5 py-3 sm:px-6">
                                <div className="flex items-center">
                                <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400" >
                                    Name
                                </p>
                                </div>
                            </th>
                            <th className="px-5 py-3 sm:px-6">
                                <div className="flex items-center">
                                <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                                    Slug
                                </p>
                                </div>
                            </th>
                            <th className="px-5 py-3 sm:px-6">
                                <div className="flex items-center justify-end">
                                <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                                    Actions
                                </p>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {categories.data.map(p => (
                        <tr key={p.id}>
                            <td className="px-5 py-4 sm:px-6">
                                {p.banner_url ? (
                                    <img
                                    src={p.banner_url}
                                    alt={p.name}
                                    className="h-12 w-28 object-cover rounded border border-gray-200 dark:border-gray-700"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400 italic">
                                    No banner
                                    </span>
                                )}
                            </td>
                            <td className="px-5 py-4 sm:px-6">
                                <div className="flex items-center">
                                    <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                                        {p.name}
                                    </p>
                                </div>
                            </td>
                            <td className="px-5 py-4 sm:px-6">
                                <div className="text-gray-500 text-theme-sm dark:text-gray-400">
                                    {p.slug}
                                </div>
                            </td>
                            <td className="px-5 py-4 sm:px-6">
                                <div className="flex items-center justify-end">
                                    <Link href={route('admin.categories.edit', p.id)} className="mr-2 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]">Edit</Link>
                                    <button
                                        onClick={()=>router.delete(route('admin.categories.destroy', p.id))}
                                        className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
                                    >Delete</button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                {/* pagination sederhana */}
                <div className="p-3 flex gap-2">
                {categories.links.map((l,i)=>(
                    <Link key={i}
                    href={l.url || "#"}
                    dangerouslySetInnerHTML={{__html:l.label}}
                    className={`flex items-center gap-2 rounded-lg border border-gray-300 px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5 sm:py-2.5 ${l.active?'bg-brand-500 text-white':'bg-white'} ${!l.url?'opacity-40 pointer-events-none':''}`}
                    />
                ))}
                </div>
            </div>
        </div>

    </AdminLayout>
    </>
  );
}
