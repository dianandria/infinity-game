import React, { useMemo } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Form({ product, categories }) {
  const { data, setData, post, put, processing, errors, cancel } = useForm({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    // image_url: product?.image_url ?? "",
    category_ids: product?.categories?.map(c=>c.id) ?? [],

    // NEW:
    images: [],                // File[] (untuk CREATE)
    main_image_index: null,    // number (untuk CREATE)
    remove_image_ids: [],      // number[] (untuk UPDATE)
    main_image_id: product?.images?.find(i=>i.is_main)?.id ?? null,
    sort: product?.images?.map((img,idx)=>({id: img.id, order: idx})) ?? [],
    is_featured: product?.is_featured ?? false,
    featured_order: product?.featured_order ?? 0,
  });

  const isEdit = !!product;

  const submit = (e) => {
    e.preventDefault();

    // Untuk update
    // rapikan payload
    const payload = { ...data, _method: 'PUT' };
    // optional: hapus key yang tidak dipakai saat edit
    delete payload.images;
    delete payload.main_image_index;

    if (isEdit) {
      post(route('admin.products.update', product.id), {
        data: payload,
        forceFormData: true, // wajib saat ada File
        headers: { 'X-HTTP-Method-Override': 'PUT' },
      });
    } else {
      post(route('admin.products.store'), {
        data,
        forceFormData: true,   // penting untuk upload file
      });
    }
  };

  const imageErrors = Object.entries(errors)
  .filter(([k]) => k === 'images' || k.startsWith('images.'))
  .map(([, v]) => v);

  const hasImageError = imageErrors.length > 0;

  return (
    <>
    <AdminLayout mainPage="Products" page="create-product">
      <Head title={isEdit ? "Edit Product" : "Create Product"} />
      <form onSubmit={submit} className="bg-white rounded shadow p-4 space-y-4">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold">{isEdit? 'Edit' : 'Create'} Product</h1>
          <Link href={route('admin.products.index')} className="text-blue-600">← Back</Link>
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
            <label className="block text-sm mb-1">Description</label>
            <textarea className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              rows={6} value={data.description||''} onChange={e=>setData('description', e.target.value)} />
            {errors.description && <div className="text-red-600 text-sm">{errors.description}</div>}
          </div>

          <div>
            <label className="block text-sm mb-1">Price (e.g. 19000)</label>
            <input type="number" step="0.01" className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30e"
              value={data.price} onChange={e=>setData('price', e.target.value)} />
            {errors.price && <div className="text-red-600 text-sm">{errors.price}</div>}
          </div>

          <div>
            <label className="block text-sm mb-1">Stock</label>
            <input type="number" className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30e"
              value={data.stock} onChange={e=>setData('stock', e.target.value)} />
              {errors.stock && <div className="text-red-600 text-sm">{errors.stock}</div>}
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              id="is_featured"
              type="checkbox"
              checked={data.is_featured}
              onChange={(e) => setData('is_featured', e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="is_featured" className="text-sm">
              Show as <span className="font-semibold">Featured Product</span> at Homepage
            </label>
            {errors.is_featured && (
              <div className="text-red-600 text-sm">{errors.is_featured}</div>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">
              Featured Order <span className="text-xs text-gray-500">(0 = paling atas)</span>
            </label>
            <input
              type="number"
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30e"
              value={data.featured_order}
              onChange={(e) => setData('featured_order', e.target.value)}
            />
            {errors.featured_order && (
              <div className="text-red-600 text-sm">{errors.featured_order}</div>
            )}
          </div>

          {/* CREATE: multiple upload */}
          <div>
            <label className="block text-sm mb-1">Images</label>
            <input type="file" multiple accept="image/*"
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30e"
              onChange={(e)=>{
                const files = Array.from(e.target.files || []);
                setData('images', files);
                // default main index = 0 jika belum di-set
                if (files.length && data.main_image_index == null) setData('main_image_index', 0);
              }}
            />

            {/* tampilkan semua pesan error terkait images */}
            {imageErrors.length > 0 && (
              <ul className="text-red-600 text-sm mt-1 list-disc pl-5">
                {imageErrors.map((msg, i) => <li key={i}>{msg}</li>)}
              </ul>
            )}
          </div>

          {/* PREVIEW CREATE (files belum tersimpan) */}
          {data.images?.length > 0 && (
            <div className="md:col-span-2">
              <div className="grid grid-cols-6 gap-3 mt-2">
                {data.images.map((file, idx) => (
                  <div key={idx} className="border rounded p-2">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-32 object-cover rounded" />
                    <label className="flex items-center gap-2 mt-1">
                      <input type="radio"
                        name="mainCreate"
                        checked={data.main_image_index === idx}
                        onChange={()=>setData('main_image_index', idx)}
                      />
                      <span>Main</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PREVIEW EXISTING (EDIT) */}
          {product?.images?.length > 0 && (
            <div className="md:col-span-2">
              <div className="grid grid-cols-6 gap-3 mt-2">
                {product.images.map((img, idx) => (
                  <div key={img.id} className="border rounded p-2">
                    <img src={route().t ? img.url : img.url} alt="" className="w-full h-28 object-cover rounded" />
                    <div className="flex items-center justify-between mt-1">
                      <label className="flex items-center gap-2">
                        <input type="radio"
                          name="mainEdit"
                          checked={data.main_image_id === img.id}
                          onChange={()=>setData('main_image_id', img.id)}
                        />
                        <span>Main</span>
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input type="checkbox"
                          checked={data.remove_image_ids.includes(img.id)}
                          onChange={(e)=>{
                            if (e.target.checked) {
                              setData('remove_image_ids', [...data.remove_image_ids, img.id]);
                              if (data.main_image_id === img.id) setData('main_image_id', null); // jika hapus main
                            } else {
                              setData('remove_image_ids', data.remove_image_ids.filter(id => id !== img.id));
                            }
                          }}
                        />
                        remove
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(c=>(
                <label key={c.id} className="inline-flex items-center gap-2 border rounded px-2 py-1">
                  <input
                    type="checkbox"
                    checked={data.category_ids.includes(c.id)}
                    onChange={(e)=>{
                      if (e.target.checked) setData('category_ids',[...data.category_ids, c.id]);
                      else setData('category_ids', data.category_ids.filter(id=>id!==c.id));
                    }}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
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
