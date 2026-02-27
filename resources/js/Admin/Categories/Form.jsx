import React, { useMemo } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Form({ category }) {
  const { data, setData, post, put, processing, errors } = useForm({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    banner: null, // file baru (kalau upload)
    order: category?.order ?? ""
  });

  const isEdit = !!category;

  const submit = (e) => {
    e.preventDefault();
    
    if (isEdit) {
      post(route('admin.categories.update', category.id), {
        data: { ...data, _method: 'PUT' },
        forceFormData: true,
        headers: { 'X-HTTP-Method-Override': 'PUT' },
      });
    } else {
      post(route('admin.categories.store'), {
        data,
        forceFormData: true,
      });
    }
  };

  return (
    <>
    <AdminLayout mainPage="Products" page="create-category">
      <Head title={isEdit ? "Edit Category" : "Create Category"} />
      <form onSubmit={submit} className="bg-white rounded shadow p-4 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">{isEdit? 'Edit' : 'Create'} Category</h1>
          <Link href={route('admin.categories.index')} className="text-blue-600">← Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30e"
              value={data.name} onChange={e=>setData('name', e.target.value)} />
            {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
          </div>
          <div>
            <label className="block text-sm mb-1">Slug (optional)</label>
            <input className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30e"
              value={data.slug} onChange={e=>setData('slug', e.target.value)} />
            {errors.slug && <div className="text-red-600 text-sm">{errors.slug}</div>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Order</label>
            <input 
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30e"
              value={data.order}
              onChange={e=>setData('order', e.target.value)}
              type="number"  
            />
            {errors.order && <div className="text-red-600 text-sm">{errors.order}</div>}
          </div>
          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              rows={4}
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
            />
            {errors.description && (
              <div className="text-red-600 text-sm">{errors.description}</div>
            )}
          </div>

          {/* BANNER UPLOAD */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <label className="block text-sm mb-1">Banner Image</label>
              <input
                type="file"
                accept="image/*"
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30e"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setData('banner', file);
                }}
              />
              {errors.banner && (
                <div className="text-red-600 text-sm">{errors.banner}</div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Recommended ratio: e.g. 16:9 wide banner.
              </p>
            </div>

            {/* PREVIEW */}
            <div>
              <span className="block text-sm mb-1">Preview</span>
              <div className="border rounded-lg p-2 min-h-[100px] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                {data.banner ? (
                  <img
                    src={URL.createObjectURL(data.banner)}
                    alt="New banner preview"
                    className="max-h-40 w-full object-cover rounded"
                  />
                ) : category?.banner_url ? (
                  <img
                    src={category.banner_url}
                    alt="Current banner"
                    className="max-h-40 w-full object-cover rounded"
                  />
                ) : (
                  <span className="text-xs text-gray-500">
                    No banner uploaded
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button disabled={processing}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </AdminLayout>
    </>
  );
}
