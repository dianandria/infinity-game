import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

const fmt = (n) => `Rp ${Number(n || 0).toLocaleString("id-ID")}`;

function addToCart(product) {
  router.post(
    route("cart.store"),
    { product_id: product.id, qty: 1 },
    { preserveScroll: true }
  );
}

export default function Show({ category, products, filters }) {
  const [q, setQ] = useState(filters?.q || "");
  const [sort, setSort] = useState(filters?.sort || "new");

  const submit = (params) => {
    router.get(route("category.show", category.slug), params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const onSearch = (e) => {
    e.preventDefault();
    submit({ q, sort });
  };

  return (
    <AppLayout>
      <Head title={`${category.name} - Infinity Game`} />

      <main className="catalog-page">
        <div className="catalog-header">
          <div className="catalog-banner">
            <img
              src={category.banner_url || "/images/about-us.jpg"}
              alt={`Banner Kategori ${category.name}`}
              className="banner-img"
            />
            <div className="banner-overlay"></div>
            <div className="banner-text">
              <p>KATEGORI PRODUK</p>
              <h1>{category.name.toUpperCase()}</h1>
            </div>
          </div>

          <div className="breadcrumb">
            <Link href={route("home.index")}>Home</Link> <span>/</span>
            <span className="current">{category.name}</span>
          </div>
        </div>

        <div className="filter-section">
          <h2>Produk {category.name}</h2>
          <form className="filter-controls" onSubmit={onSearch}>
            <input
              type="text"
              placeholder="Cari produk game atau konsol..."
              className="filter-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="filter-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); submit({ q, sort: e.target.value }) }}
            >
              <option value="new">Terbaru</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
            </select>
          </form>
        </div>

        {products.data.length === 0 ? (
          <p style={{ textAlign: "center", padding: "3rem 0", color: "#666" }}>
            Belum ada produk di kategori ini.
          </p>
        ) : (
          <>
            <div className="product-grid">
              {products.data.map((p) => {
                const outOfStock = Number(p.stock) <= 0;
                return (
                  <div key={p.id} className="product-card">
                    {outOfStock && <span className="badge out-of-stock">Out of stock</span>}
                    <Link href={route("products.show", p.slug)} className="product-img">
                      <img src={p.thumb_url || "/images/about-us.jpg"} alt={p.name} />
                    </Link>
                    <div className="card-body">
                      <span className="category">{category.name}</span>
                      <h3 className="product-title">
                        <Link href={route("products.show", p.slug)}>{p.name}</Link>
                      </h3>
                      <div className="card-footer">
                        <span className="price">{fmt(p.price)}</span>
                        <button
                          type="button"
                          className="btn-cart"
                          disabled={outOfStock}
                          onClick={() => addToCart(p)}
                        >
                          {outOfStock ? "Habis" : "Add to cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {products.links && products.links.length > 3 && (
              <div className="pagination">
                {products.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url || "#"}
                    preserveScroll
                    className={[
                      "page-btn",
                      link.active ? "active" : "",
                      !link.url ? "disabled" : "",
                    ].filter(Boolean).join(" ")}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </AppLayout>
  );
}
