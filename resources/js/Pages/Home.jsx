import React, { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

const fmt = (n) => `Rp. ${Number(n || 0).toLocaleString("id-ID")}`;

export default function Index({ sliders, featuredProducts, featuredCategories }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasSliders = sliders && sliders.length > 0;

  const defaultHero = {
    title: "Koleksi Game Dan\nLayanan Terbaik,\nTanpa Batas!",
    button_text: "Belanja Sekarang",
    button_link: "/products",
    image_path: null,
  };

  const activeSlide = hasSliders ? sliders[currentSlide] : defaultHero;

  useEffect(() => {
    if (!hasSliders || sliders.length <= 1) return;
    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(id);
  }, [sliders, hasSliders]);

  const addToCart = (product) => {
    router.post(
      route("cart.store"),
      { product_id: product.id, qty: 1 },
      { preserveScroll: true }
    );
  };

  return (
    <AppLayout>
      <Head title="Koleksi Game Dan Layanan Terbaik, Tanpa Batas!" />

      <section className="hero">
        <div className="hero-content">
          <h1>
            {(activeSlide.title || defaultHero.title).split("\n").map((line, i, arr) => (
              <React.Fragment key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <Link
            href={activeSlide.button_link || "/products"}
            className="btn-primary"
          >
            {activeSlide.button_text || "Belanja Sekarang"}
          </Link>
        </div>
        <div className="hero-image">
          <img
            src={activeSlide.image_path ? `/storage/${activeSlide.image_path}` : "/images/hero_image.png"}
            alt="Hero Mockup"
          />
        </div>
      </section>

      <section className="products-section">
        <h2 className="section-title">Koleksi Produk Kami</h2>

        {(!featuredProducts || featuredProducts.length === 0) ? (
          <p style={{ textAlign: "center", color: "#666" }}>Belum ada produk unggulan.</p>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((p) => (
              <div key={p.id} className="product-card">
                {p.is_featured && <div className="badge">FEATURED</div>}
                <Link href={route("products.show", p.slug ?? p.id)} className="product-img">
                  <img src={p.thumb_url || p.image_url || "/images/about-us.jpg"} alt={p.name} />
                </Link>
                <div className="card-body">
                  <p className="category">
                    {p.categories?.[0]?.name?.toUpperCase() || "GAME"}
                  </p>
                  <h3 className="product-title">
                    <Link href={route("products.show", p.slug ?? p.id)}>{p.name}</Link>
                  </h3>
                  <div className="card-footer">
                    <span className="price">{fmt(p.price)}</span>
                    <button
                      type="button"
                      className="btn-cart"
                      disabled={Number(p.stock) <= 0}
                      onClick={() => addToCart(p)}
                    >
                      {Number(p.stock) <= 0 ? "Habis" : "Add To Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="center-btn">
          <Link href={route("products.index")} className="btn-outline">
            Lihat Semua Produk
          </Link>
        </div>
      </section>

      <section className="explore-section">
        <h2 className="section-title">Jelajahi Dunia Hiburanmu, Tanpa Batas!</h2>
        <div className="category-grid">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              href={route("category.show", cat.slug)}
              className="category-card"
            >
              <img
                src={cat.banner_url || "/images/about-us.jpg"}
                alt={cat.name}
              />
              <h3 className="category-title">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
