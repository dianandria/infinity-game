// resources/js/Pages/Admin/Dashboard/Index.jsx
import React, { useMemo, useState } from "react";
import Sidebar from "@/Layouts/admin/Sidebar";
import Header from "@/Layouts/admin/Header";
import Alert from "@/Admin/Components/Alert";

export default function AdminLayout({ children, mainPage, page }) {
  const [sidebarToggle, setSidebarToggle] = useState(false); // false = tertutup (mobile)

  // Saat desktop, kita ingin konten punya padding kiri menyesuaikan lebar sidebar
  const mainPadding = useMemo(
    () => (sidebarToggle ? "lg:pl-[290px]" : "lg:pl-[90px]"),
    [sidebarToggle]
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fixed di kiri */}
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        page={page}
        mainPage={mainPage}
      />

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header di atas. Tombol hamburger di Header akan memanggil setSidebarToggle */}
        <Header
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        />

        {/* Overlay untuk mobile ketika sidebar terbuka */}
        {sidebarToggle && (
          <button
            aria-label="Close sidebar overlay"
            onClick={() => setSidebarToggle(false)}
            className="fixed inset-0 z-[9998] bg-black/30 lg:hidden"
          />
        )}

        {/* Konten utama – geser/padding sesuai lebar sidebar di desktop */}
        <main>
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {/* Alert */}
            <Alert />
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
