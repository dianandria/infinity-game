import React from "react";
import { Head, Link } from "@inertiajs/react";
import SliderForm from "./SliderForm";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Create() {
  return (
    <>
    <AdminLayout mainPage="CMS" page="slider-create">
      <Head title="Create Slider" />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Slider</h1>
        <Link
          href={route("admin.sliders.index")}
          className="text-sm text-gray-600"
        >
          ← Back
        </Link>
      </div>

      <SliderForm submitRoute={route("admin.sliders.store")} />
    </AdminLayout>
    </>
  );
}
