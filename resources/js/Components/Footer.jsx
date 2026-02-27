import React from "react";
import { Link } from "@inertiajs/react";

export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-12">
        {/* TOP GRID */}
        <div className="grid gap-8 md:grid-cols-4 lg:grid-cols-[2fr,1fr,1fr,1.5fr]">
          {/* BRAND / ABOUT */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.svg" className="main-logo"/>
            </Link>
            <p className="text-sm text-white leading-relaxed">
              Hadiahkan cerita dari berbagai negara lewat koleksi souvenir kami.
              Produk orisinil, berkualitas, dan penuh makna.
            </p>
            <p className="text-xs text-white">
              Kirim ke seluruh Indonesia dengan pengiriman cepat & aman.
            </p>
          </div>

          {/* SHOP */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Shop
            </h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href={route("home.index")} className="hover:text-gray-200">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={route("products.index") ?? "#"}
                  className="hover:text-gray-200"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-gray-200">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-gray-200">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-white">
              <li>
                <Link href="/help" className="hover:text-gray-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-gray-200">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gray-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Newsletter
            </h3>
            <p className="text-sm text-white">
              Dapatkan info promo & produk terbaru langsung ke email kamu.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email kamu"
                  className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center rounded-md subscribe-btn px-4 text-xs font-semibold uppercase tracking-wide text-white hover:bg-black"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-[11px] text-white">
                Dengan subscribe, kamu setuju dengan{" "}
                <Link href="/privacy" className="underline">
                  kebijakan privasi
                </Link>
                .
              </p>
            </form>

          </div>
        </div>

        {/* BOTTOM BAR */}
        {/* <div className="mt-8 border-t border-gray-200 pt-4 flex flex-col gap-3 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MyStore. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:text-gray-700">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <span className="text-[11px] text-gray-400">
              Powered by Laravel & Inertia
            </span>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
