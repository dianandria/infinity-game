import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Index({ sliders, featuredProducts, featuredCategories }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const hasSliders = sliders && sliders.length > 0;
  const categoryOrder = ["Jepang", "Korea", "China", "Thailand", "Eropa", "Lainnya"];
  const fallbackHeroImage = "/images/about-us.jpg";
  const categoryFallbacks = {
    Jepang: "linear-gradient(135deg, rgba(177, 67, 82, 0.88), rgba(26, 78, 102, 0.82)), url('/images/about-us.jpg')",
    Korea: "linear-gradient(135deg, rgba(29, 91, 121, 0.88), rgba(231, 139, 103, 0.76)), url('/images/about-us.jpg')",
    China: "linear-gradient(135deg, rgba(159, 42, 47, 0.9), rgba(216, 157, 61, 0.78)), url('/images/about-us.jpg')",
    Thailand: "linear-gradient(135deg, rgba(11, 105, 127, 0.88), rgba(235, 145, 64, 0.78)), url('/images/about-us.jpg')",
    Eropa: "linear-gradient(135deg, rgba(50, 75, 102, 0.9), rgba(140, 164, 171, 0.72)), url('/images/about-us.jpg')",
    Lainnya: "linear-gradient(135deg, rgba(19, 109, 126, 0.9), rgba(99, 171, 151, 0.75)), url('/images/about-us.jpg')",
  };

  const getProductCategories = (product) => {
    if (!product.categories || product.categories.length === 0) return "Lainnya";

    const categoryNames = product.categories
      .map((category) => category.name)
      .filter((name) => categoryOrder.includes(name))
      .sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));

    return categoryNames.length > 0 ? categoryNames.join(", ") : "Lainnya";
  };

  const addToCart = (product) => {
    router.post(
      route("cart.store"),
      { product_id: product.id, qty: 1 },
      { preserveScroll: true }
    );
  };
  
  // auto slide (optional)
  useEffect(() => {
    if (!hasSliders) return;

    const id = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(id);
  }, [sliders, hasSliders]);

  const nextSlide = () => {
    if (!hasSliders) return;
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    if (!hasSliders) return;
    setCurrentSlide((prev) =>
      prev === 0 ? sliders.length - 1 : prev - 1
    );
  };

  return (
    <>
    <AppLayout>
      <Head title="Belanja souvenir dunia, langsung di sini !" />

      <div className="min-h-screen bg-white">
        {/* CONTAINER */}
        <div className="w-full">

          {/* SLIDER SECTION */}
          {hasSliders && (
            <section className="relative overflow-hidden shadow-lg bg-black">
              {/* Slides */}
              <div className="relative h-[300px] lg:h-[650px]">
                {sliders.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentSlide ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={`/storage/${slide.image_path}`}
                      alt={slide.title}
                      onError={(event) => {
                        event.currentTarget.src = fallbackHeroImage;
                      }}
                      className="h-full w-full object-cover"
                    />
                    {/* Overlay content */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                    <div className="absolute inset-y-0 flex items-center px-6 md:px-10 slider-title-wrapper">
                      <div className="max-w-md space-y-3 text-white">
                        {slide.subtitle && (
                          <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                            {slide.subtitle}
                          </p>
                        )}
                        <h2 className="slide-title font-semibold leading-tight">
                          {slide.title}
                        </h2>
                        {slide.button_text && slide.button_link && (
                          <Link
                            href={slide.button_link}
                            className="inline-flex items-center slider-button"
                          >
                            {slide.button_text}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              {sliders.length > 1 && (
                <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white text-sm hover:bg-black/60"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white text-sm hover:bg-black/60"
                >
                  ›
                </button>

                {/* dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {sliders.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 w-2 rounded-full ${
                        currentSlide === index
                          ? "bg-white"
                          : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                </>
              )}
            </section>
          )}
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
          {/* FEATURED PRODUCTS SECTION */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Produk
              </h2>
              {/* Kalau mau link ke halaman semua produk */}
              {/* <Link
                href={route("products.index") ?? "#"}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all
              </Link> */}
            </div>

            {(!featuredProducts || featuredProducts.length === 0) ? (
              <p className="text-sm text-gray-500">
                Belum ada featured product.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {featuredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <Link href={route("products.show", p.slug ?? p.id)}>
                        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}

                          {/* Optional: badge */}
                          {p.is_featured && (
                            <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                              Featured
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col px-3.5 py-3 space-y-1.5 product-info">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/80">
                          {getProductCategories(p)}
                        </p>
                        <Link href={route("products.show", p.slug ?? p.id)}>
                          <h3 className="line-clamp-2 text-sm font-semibold text-white">
                            {p.name}
                          </h3>
                        </Link>
                        {/*
                          {p.description && (
                            <p className="line-clamp-2 text-xs text-white">
                              {p.description}
                            </p>
                          )}
                        */}

                        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                          <h3 className="text-sm font-semibold text-white">
                            Rp {Number(p.price).toLocaleString("id-ID")}
                          </h3>
                          <button
                            type="button"
                            onClick={() => addToCart(p)}
                            disabled={Number(p.stock) <= 0}
                            className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[11px] font-medium product-btn disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {Number(p.stock) <= 0 ? "Habis" : "Add to cart"}
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            )}
            <div className="flex justify-center">
              <Link
                href={route("products.index") ?? "#"}
                className="inline-flex items-center see-product-btn mt-8"
              >
                Lihat Semua Produk
              </Link>
            </div>
          </section>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
          <section className="space-y-4">
            <div className="flex items-center justify-center mb-10 mt-10">
              <h2 className="font-semibold text-gray-900 section-title text-center">
                Souvenir pilihan dari berbagai penjuru dunia
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={route("category.show", cat.slug)} // kalau belum ada route ini, ganti dulu ke "/"
                  className="group relative block overflow-hidden border bg-gray-100 aspect-[16/10]"
                  style={{
                    backgroundImage: categoryFallbacks[cat.name] || categoryFallbacks.Lainnya,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img
                    src={cat.banner_url ? `${cat.banner_url}` : "https://via.placeholder.com/1200x675?text=Category"}
                    alt={cat.name}
                    onError={(event) => {
                      event.currentTarget.style.opacity = "0";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* overlay gelap biar teks kebaca */}
                  <div className="absolute inset-0 bg-black/35" />

                  {/* text di tengah */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl sm:text-3xl font-bold tracking-wide drop-shadow">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
    </>
  );
}
