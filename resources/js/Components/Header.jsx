import React, { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import Dropdown from '@/Components/Dropdown'
import {
  ShoppingCartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export default function Header({ user = null, categories = [] }) {
  const [openCategories, setOpenCategories] = useState(false)   // dropdown desktop
  const [mobileOpen, setMobileOpen] = useState(false)           // panel mobile
  const { cart } = usePage().props
  // cukup jumlah list di cart saja
  const totalCart = cart?.items ? cart.items.length : 0
  
  return (
    <header className="backdrop-blur-md sticky top-0 z-50 header items-center flex flex-col">
      <div className="header-border">&nbsp;</div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 w-full">
        
        {/* LEFT: HAMBURGER + LOGO */}
        <div className="flex items-center gap-2">
          {/* HAMBURGER - mobile only */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 p-2 text-white md:hidden"
            onClick={() => setMobileOpen(prev => !prev)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <img
              src="/images/logo.svg"
              className="main-logo"
            />
          </Link>
        </div>

        {/* NAV CENTER (desktop) */}
        <nav className="hidden md:flex items-center gap-12 text-sm font-medium text-gray-700">
          <Link
            href={route('home.index')}
            className="hover:text-gray-900 main-menu"
          >
            HOME
          </Link>

          {/* DROPDOWN CATEGORIES - desktop */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenCategories(prev => !prev)}
              className="inline-flex items-center gap-1 hover:text-gray-900"
            >
              <span>KATEGORI</span>
              <svg
                className={`h-4 w-4 transition-transform ${openCategories ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {openCategories && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                {categories.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-400">
                    No categories
                  </div>
                ) : (
                  categories.map(cat => (
                    <Link
                      key={cat.id}
                      href={route('category.show', cat.slug)}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 sub-menu"
                      onClick={() => setOpenCategories(false)}
                    >
                      {cat.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            href={route('about')}
            className="hover:text-gray-900 main-menu"
          >
            TENTANG KAMI
          </Link>
          <Link
            href={route('contact.create')}
            className="hover:text-gray-900 main-menu"
          >
            KONTAK KAMI
          </Link>
        </nav>

        {/* NAV RIGHT */}
        <div className="flex items-center gap-3">
          {user ? (
            <Dropdown>
              <Dropdown.Trigger>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-white hover:opacity-80 focus:outline-none"
                >
                  {user.name}
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </Dropdown.Trigger>

              <Dropdown.Content>
                <Dropdown.Link href={route('profile.edit')}>
                  Profile
                </Dropdown.Link>
                <Dropdown.Link
                  href={route('logout')}
                  method="post"
                  as="button"
                >
                  Log Out
                </Dropdown.Link>
              </Dropdown.Content>
            </Dropdown>
          ) : (
            <Link
              href="/login"
              className="md:inline text-sm font-medium hover:underline text-gray-800"
            >
              <UserCircleIcon className="h-6 w-6 stroke-[1.8] hover:opacity-80 text-white" />
            </Link>
          )}
          
          <Link href="/cart" className="relative">
            <ShoppingCartIcon className="h-6 w-6 stroke-[1.8] hover:opacity-80 text-white" />
            {totalCart > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white shadow">
                {totalCart}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE MENU PANEL (tetap sama seperti sebelumnya) */}
      {mobileOpen && (
        <div className="border-t bg-white md:hidden w-full">
          <nav className="mx-auto max-w-7xl px-4 py-3 space-y-3 text-sm text-gray-800">
            <Link
              href={route('home.index')}
              className="block py-1 hover:text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              HOME
            </Link>

            <Link
              href={route('products.index') ?? '#'}
              className="block py-1 hover:text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              All Products
            </Link>

            <div className="pt-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                Categories
              </p>
              <div className="space-y-1">
                {categories.length === 0 ? (
                  <span className="text-xs text-gray-400">
                    No categories
                  </span>
                ) : (
                  categories.map(cat => (
                    <Link
                      key={cat.id}
                      href={route('category.show', cat.slug)}
                      className="block py-1 pl-2 text-sm text-gray-700 hover:text-gray-900"
                      onClick={() => setMobileOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link
              href={route('about')}
              className="block py-1 hover:text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href={route('contact.create')}
              className="block py-1 hover:text-gray-900"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-3 space-y-1 border-t border-gray-200 mt-3">
              <Link
                href="/cart"
                className="block py-1 hover:text-gray-900"
                onClick={() => setMobileOpen(false)}
              >
                Cart
              </Link>

              {user ? (
                <Link
                  href="/profile"
                  className="block py-1 hover:text-gray-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {user.name}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block py-1 hover:text-gray-900"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
