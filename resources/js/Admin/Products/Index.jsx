import React, { useMemo, useState, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index({ products, filters }) {
  const onSearch = (e) => {
    router.get(route('admin.products.index'), { search: e.target.value }, { preserveState: true });
  };

  const [selected, setSelected] = useState(() => new Set());

  // ===== Upload Excel state =====
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const openFilePicker = () => fileRef.current?.click();

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ok = /\.(xlsx|xls)$/i.test(file.name);
    if (!ok) {
      alert("Please upload an Excel file (.xlsx / .xls).");
      e.target.value = "";
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    setUploading(true);
    router.post(route("admin.products.importExcel"), fd, {
      forceFormData: true,
      preserveScroll: true,
      onFinish: () => {
        setUploading(false);
        e.target.value = "";
      },
    });
  };

  const idsOnPage = useMemo(
    () => (products?.data || []).map((p) => p.id),
    [products?.data]
  );

  const allOnPageSelected = useMemo(() => {
    if (idsOnPage.length === 0) return false;
    return idsOnPage.every((id) => selected.has(id));
  }, [idsOnPage, selected]);

  const someOnPageSelected = useMemo(() => {
    if (idsOnPage.length === 0) return false;
    return idsOnPage.some((id) => selected.has(id));
  }, [idsOnPage, selected]);

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    setSelected((prev) => {
      const next = new Set(prev);

      if (idsOnPage.every((id) => next.has(id))) {
        // unselect all on current page
        idsOnPage.forEach((id) => next.delete(id));
      } else {
        // select all on current page
        idsOnPage.forEach((id) => next.add(id));
      }

      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const batchDelete = () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;

    if (!confirm(`Delete ${ids.length} selected product(s)?`)) return;

    router.delete(route("admin.products.batchDestroy"), {
      data: { ids },
      preserveScroll: true,
      onSuccess: () => clearSelection(),
    });
  };

  return (
    <>
    <AdminLayout mainPage="Products" page="product">
        <Head title="Products" />
        <div className="flex items-center justify-between mb-4">
          <input
            defaultValue={filters?.search || ""}
            onChange={onSearch}
            placeholder="Search…"
            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-1/3 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          />
          <div className="flex items-center gap-2">
            {/* hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={onPickFile}
            />

            {/* Upload Excel button */}
            <button
              type="button"
              onClick={openFilePicker}
              disabled={uploading}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs
                ${uploading ? "bg-gray-400 opacity-80 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900"}
              `}
              title="Import products from Excel"
            >
              {uploading ? "Uploading..." : "Upload Excel"}
            </button>

            {/* Batch action bar */}
            <button
              type="button"
              onClick={batchDelete}
              disabled={selected.size === 0}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs
                ${selected.size === 0 ? "bg-red-400 opacity-60 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}
              `}
            >
              Delete Selected {selected.size > 0 ? `(${selected.size})` : ""}
            </button>

            <Link
              href={route("admin.products.create")}
              className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
            >
              + New Product
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          {/* SELECT ALL */}
                          <th className="px-5 py-3 sm:px-6 w-[48px]">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={allOnPageSelected}
                                ref={(el) => {
                                  if (!el) return;
                                  el.indeterminate = !allOnPageSelected && someOnPageSelected;
                                }}
                                onChange={toggleAllOnPage}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-700"
                              />
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
                                  Price
                              </p>
                              </div>
                          </th>
                          <th className="px-5 py-3 sm:px-6">
                            <div className="flex items-center">
                            <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                              Stocks
                            </p>
                            </div>
                          </th>
                          <th className="px-5 py-3 sm:px-6">
                            <div className="flex items-center">
                              <p className="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                                Categories
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
                        {products.data.map(p => (
                        <tr key={p.id}>
                          {/* ROW CHECKBOX */}
                          <td className="px-5 py-4 sm:px-6">
                            <input
                              type="checkbox"
                              checked={selected.has(p.id)}
                              onChange={() => toggleOne(p.id)}
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-700"
                            />
                          </td>
                          <td className="px-5 py-4 sm:px-6">
                              <div className="flex items-center">
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 overflow-hidden">
                                          <img src={p.image_url} alt="brand" />
                                      </div>
                                      
                                      <div>
                                          <span
                                              className="block font-medium text-gray-800 text-theme-sm dark:text-white/90"
                                          >
                                              {p.name}
                                          </span>
                                          <span
                                              className="block text-gray-500 text-theme-xs dark:text-gray-400"
                                          >
                                              {p.slug}
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          </td>
                          <td className="px-5 py-4 sm:px-6">
                              <div className="flex items-center">
                              <p className="text-gray-500 text-theme-sm dark:text-gray-400">
                              { new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                              }).format(p.price)
                              }
                              </p>
                              </div>
                          </td>
                          <td className="px-5 py-4 sm:px-6">
                              <div className="flex items-center">
                                  {p.stock}
                              </div>
                          </td>
                          <td className="px-5 py-4 sm:px-6">
                              <div className="flex items-center">
                                  {p.categories?.map(c=>c.name).join(', ')}
                              </div>
                          </td>
                          <td className="px-5 py-4 sm:px-6">
                              <div className="flex items-center justify-end">
                                  <Link href={route('admin.products.edit', p.id)} className="mr-2 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]">Edit</Link>
                                  <button
                                      onClick={()=>router.delete(route('admin.products.destroy', p.id))}
                                      className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
                                  >Delete</button>
                              </div>
                          </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                {/* pagination sederhana */}
                <div className="p-3 flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Selected: {selected.size}
                    {selected.size > 0 && (
                      <button
                        type="button"
                        onClick={clearSelection}
                        className="ml-2 text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {products.links.map((l,i)=>(
                        <Link key={i}
                        href={l.url || "#"}
                        dangerouslySetInnerHTML={{__html:l.label}}
                        className={`flex items-center gap-2 rounded-lg border border-gray-300 px-2 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:px-3.5 sm:py-2.5 ${l.active?'bg-brand-500 text-white':'bg-white'} ${!l.url?'opacity-40 pointer-events-none':''}`}
                        />
                    ))}
                  </div>
                </div>
            </div>
        </div>

    </AdminLayout>
    </>
  );
}
