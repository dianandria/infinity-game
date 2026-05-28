import React from "react";
import { useForm } from "@inertiajs/react";

export default function SliderForm({ slider, submitRoute, method = "post" }) {
  const { data, setData, post, processing, errors } = useForm({
    title: slider?.title || "",
    subtitle: slider?.subtitle || "",
    button_text: slider?.button_text || "",
    button_link: slider?.button_link || "",
    sort_order: slider?.sort_order || 0,
    is_active: slider?.is_active ?? true,
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if(method==='put'){
      post(submitRoute, {
        method,
        forceFormData: true, // penting untuk upload file
        headers: { 'X-HTTP-Method-Override': 'PUT' },
        onFinish: () => {},
      });
    } else {
      post(submitRoute, {
        method,
        forceFormData: true, // penting untuk upload file
        onFinish: () => {},
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 space-y-4">
      <div>
        
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
        />
        {errors.title && (
          <div className="text-xs text-red-500 mt-1">{errors.title}</div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Subtitle</label>
        <input
          type="text"
          className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          value={data.subtitle}
          onChange={(e) => setData("subtitle", e.target.value)}
        />
        {errors.subtitle && (
          <div className="text-xs text-red-500 mt-1">{errors.subtitle}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Button Text
          </label>
          <input
            type="text"
            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            value={data.button_text}
            onChange={(e) => setData("button_text", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Button Link
          </label>
          <input
            type="text"
            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            value={data.button_link}
            onChange={(e) => setData("button_link", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">
            Sort Order
          </label>
          <input
            type="number"
            className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            value={data.sort_order}
            onChange={(e) => setData("sort_order", e.target.value)}
          />
        </div>
        <div className="flex items-center mt-6">
          <input
            id="is_active"
            type="checkbox"
            checked={data.is_active}
            onChange={(e) => setData("is_active", e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="is_active" className="text-sm">
            Active
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Image {slider ? "(leave empty if no change)" : ""}
        </label>
        <input
          type="file"
          accept="image/*"
          className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          onChange={(e) => setData("image", e.target.files[0])}
        />
        {errors.image && (
          <div className="text-xs text-red-500 mt-1">{errors.image}</div>
        )}

        {slider?.image_path && (
          <div className="mt-2">
            <span className="text-xs text-gray-500">Current Image:</span>
            <img
              src={`/storage/${slider.image_path}`}
              alt={slider.title}
              className="mt-1 h-20 w-auto rounded border object-cover"
            />
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={processing}
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
        >
          {processing ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
