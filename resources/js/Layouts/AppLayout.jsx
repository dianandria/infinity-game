import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer';
import FlashToaster from '@/Components/FlashToaster'

export default function AppLayout({ children }) {

  const { auth, headerCategories, url } = usePage().props;
  const { url: currentUrl } = usePage();
  const isHome = currentUrl === '/' || currentUrl === ''
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('home', isHome)
    return () => document.body.classList.remove('home')
  }, [isHome])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div id="header-placeholder" className={scrolled ? 'scrolled' : ''}>
        <Header
          cartCount={auth.cartCount ?? 0}
          user={auth.user ?? null}
          categories={headerCategories}
        />
      </div>
      <FlashToaster />
      <main>
        {children}
      </main>

      <Footer />
    </>
  )
}
