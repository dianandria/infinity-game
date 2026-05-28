import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import SliderForm from "./SliderForm";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Edit() {
  const { slider } = usePage().props;

  return (
    <>
    <AdminLayout mainPage="CMS" page="slider-edit">
      <Head title={`Edit Slider: ${slider.title}`} />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Slider</h1>
        <Link
          href={route("admin.sliders.index")}
          className="text-sm text-gray-600"
        >
          ← Back
        </Link>
      </div>

      <SliderForm
        slider={slider}
        submitRoute={route("admin.sliders.update", slider.id)}
        method="put" // Inertia akan kirim _method=put
      />
    </AdminLayout>
    </>
  );
}
