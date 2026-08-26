import React, { useEffect, useRef, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function Header({ user = null, categories = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { cart } = usePage().props
  const totalCart = cart?.items ? cart.items.length : 0

  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoryOpen(false)
      }
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <Link href="/">
            <img src="/images/logo-white.png" alt="Infinity Game Logo" />
          </Link>
        </div>

        <button
          type="button"
          className={`menu-toggle ${mobileOpen ? 'is-active' : ''}`}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        <div className={`nav-wrapper ${mobileOpen ? 'active' : ''}`} id="nav-wrapper">
          <ul className="nav-links">
            <li>
              <Link href={route('home.index')} onClick={() => setMobileOpen(false)}>HOME</Link>
            </li>

            <li className={`dropdown ${categoryOpen ? 'active' : ''}`} ref={dropdownRef}>
              <a
                href="#"
                className="dropdown-toggle"
                onClick={(e) => { e.preventDefault(); setCategoryOpen((v) => !v) }}
              >
                KATEGORI <span className="arrow-down"></span>
              </a>
              <ul className={`dropdown-menu ${categoryOpen ? 'show' : ''}`}>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={route('category.show', cat.slug)}
                      onClick={() => { setCategoryOpen(false); setMobileOpen(false) }}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            <li>
              <Link href={route('about')} onClick={() => setMobileOpen(false)}>TENTANG KAMI</Link>
            </li>
            <li>
              <Link href={route('contact.create')} onClick={() => setMobileOpen(false)}>KONTAK KAMI</Link>
            </li>
          </ul>

          <div className="nav-actions">
            <Link href="/cart" className="nav-icon-link" onClick={() => setMobileOpen(false)}>
              <ShoppingCartIcon className="nav-icon" />
              {totalCart > 0 && <span className="nav-icon-badge">{totalCart}</span>}
            </Link>

            {user ? (
              <Link href={route('profile.edit')} className="nav-icon-link" onClick={() => setMobileOpen(false)}>
                <UserCircleIcon className="nav-icon" />
              </Link>
            ) : (
              <Link href="/login" className="nav-icon-link" onClick={() => setMobileOpen(false)}>
                <UserCircleIcon className="nav-icon" />
              </Link>
            )}

            <a href="https://tk.tokopedia.com/ZS4UWx49c/" target="_blank" rel="noreferrer" className="btn-marketplace">
              MARKETPLACE
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}
