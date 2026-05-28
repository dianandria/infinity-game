import { usePage } from '@inertiajs/react';
import React from 'react'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer';
import FlashToaster from '@/Components/FlashToaster'

export default function AppLayout({ children, auth = {} }) {
  
  const { headerCategories } = usePage().props;

  return (
    <div className="min-h-screen text-gray-100">
      <Header 
        cartCount={auth.cartCount ?? 0}
        user={auth.user ?? null}
        categories={headerCategories}
      />
      <FlashToaster /> {/* ✅ Notifikasi global */}
      <main className="pb-10">
        {children}
      </main>

      <Footer />
    </div>
  )
}
