import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Index() {
  const { sliders } = usePage().props;

  const handleDelete = (id) => {
    if (!confirm("Delete this slider?")) return;

    router.delete(route("admin.sliders.destroy", id));
  };

  return (
    <>
    <AdminLayout mainPage="CMS" page="sliders">
      <Head title="Sliders" />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Sliders</h1>
        <Link
          href={route("admin.sliders.create")}
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
        >
          + Add Slider
        </Link>
      </div>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Order</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sliders.data.map((slider) => (
              <tr key={slider.id} className="border-t">
                <td className="px-4 py-2">
                  <img
                    src={`/storage/${slider.image_path}`}
                    alt={slider.title}
                    className="h-12 w-auto rounded object-cover"
                  />
                </td>
                <td className="px-4 py-2">{slider.title}</td>
                <td className="px-4 py-2">{slider.sort_order}</td>
                <td className="px-4 py-2">
                  {slider.is_active ? (
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-right space-x-1">
                  <Link
                    href={route("admin.sliders.edit", slider.id)}
                    className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(slider.id)}
                    className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-theme-xs ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03]"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {sliders.data.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-4 text-center text-gray-500"
                >
                  No sliders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
    </>
  );
}
