import React, { useState } from "react";
import { Head, Link, usePage , router} from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Show({ category, products }) {
  const hasBanner = !!category.banner_url;
  const { filters } = usePage().props
  const [q, setQ]       = useState(filters?.q || '')
  const [sort, setSort] = useState(filters?.sort || 'new')
  const [loading, setLoading] = useState(false)

  const submit = (params) => {
    setLoading(true)
    router.get(route('category.show', category.slug), params, {
      preserveState: true, preserveScroll: true,
      onFinish: () => setLoading(false),
    })
  }

  const onSearch = (e) => {
    e.preventDefault()
    submit({ q, sort })
  }

  return (
    <>
    <AppLayout>
      <Head title={`Souvenir ${category.name}`}  />

      <div className="min-h-screen bg-gray-50">
        {/* HERO / BANNER */}
        <section className="pt-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="category-banner relative overflow-hidden rounded-2xl shadow-sm ring-gray-200 bg-gray-900 dark:bg-gray-900 dark:ring-gray-800 h-44 md:h-56 lg:h-64">
            {/* Background image */}
            {category.banner_url ? (
                <img
                src={category.banner_url}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                No banner image
                </div>
            )}

            {/* Overlay gradient biar teks kebaca */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Content di atas gambar */}
            <div className="relative h-full flex items-end">
                <div className="w-full px-5 pb-4 md:px-8 md:pb-6">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">
                    Kategori Produk
                </p>
                <h1 className="mt-1 text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                    {category.name}
                </h1>
                {category.description && (
                    <p className="mt-2 max-w-2xl text-xs md:text-sm text-white/80">
                    {category.description}
                    </p>
                )}
                </div>
            </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* BREADCRUMB SIMPLE */}
          <nav className="mb-4 text-xs text-gray-500">
            <Link href={route("home.index")} className="hover:underline">
              Home
            </Link>{" "}
            <span className="mx-1">/</span>
            <span>{category.name}</span>
          </nav>
          
          {/* FILTER */}
          <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <h1 className="text-2xl font-bold text-gray-800">Produk</h1>
            <form onSubmit={onSearch} className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
              <input
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-800"
                placeholder="Cari produk..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select
                className="rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-800"
                value={sort}
                onChange={(e) => { setSort(e.target.value); submit({ q, sort: e.target.value }) }}
              >
                <option value="new">Terbaru</option>
                <option value="price_asc">Harga: Terendah → Tertinggi</option>
                <option value="price_desc">Harga: Tertinggi → Terendah</option>
              </select>
              <button type="submit" className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-100 text-gray-800">
                {loading ? 'Loading…' : 'Cari'}
              </button>
            </form>
          </div>

          {/* PRODUCT GRID */}
          {products.data.length === 0 ? (
            <p className="text-sm text-gray-500">
              Belum ada produk di kategori ini.
            </p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.data.map((p) => (
                  <Link
                    href={route("products.show", p.slug ?? p.id)}
                    key={p.id}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      {p.thumb_url ? (
                        <img
                          src={p.thumb_url}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                      {p.stock === 0 && (
                        <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                          Out of stock
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col px-3.5 py-3 space-y-1.5 product-info">
                      <h2 className="line-clamp-2 text-sm font-semibold text-white">
                        {p.name}
                      </h2>
                      {p.description && (
                        <p className="line-clamp-2 text-xs text-white">
                          {p.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-2">
                        <h3 className="text-sm font-semibold text-white">
                          Rp {Number(p.price).toLocaleString("id-ID")}
                        </h3>
                        <Link
                          href={route("products.show", p.slug ?? p.id)}
                          className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-medium text-primary hover:bg-gray-100"
                        >
                          Lihat
                        </Link>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* PAGINATION */}
              {products.links && products.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                  <nav className="flex flex-wrap items-center justify-center gap-2 text-gray-800">
                    {products.links.map((link, idx) => (
                      <Link
                        key={idx}
                        href={link.url || ""}
                        preserveScroll
                        className={[
                          "rounded-xl border px-3 py-2 text-sm",
                          link.active ? "background-primary text-white" : "hover:bg-gray-100",
                          !link.url && "pointer-events-none opacity-50",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    ))}
                  </nav>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </AppLayout>
    </>
  );
}
