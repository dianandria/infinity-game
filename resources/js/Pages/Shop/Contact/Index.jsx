// resources/js/Pages/Shop/Contact/Index.jsx

import React from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

export default function ContactIndex() {
  const { status } = usePage().props

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: ''
  })

  const onSubmit = (e) => {
    e.preventDefault()

    post(route('contact.store'), {
      onSuccess: () => {
        reset('message') // misal cuma reset pesan, atau reset() semua
      },
    })
  }

  return (
    <AppLayout>
      <Head title="Contact Us" />

        <div className="mx-auto max-w-5xl px-4 py-10 lg:py-14">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
            <p className="text-gray-600 mb-6">
            Have a question, business inquiry, or need help with your order? Fill out the form below and we’ll get back to you as soon as possible.
            </p>

            {status && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-gray-800">
                {status}
            </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                />
                {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
                </label>
                <input
                type="email"
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone (optional)
                </label>
                <input
                type="text"
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                />
                {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                Subject (optional)
                </label>
                <input
                type="text"
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.subject}
                onChange={(e) => setData('subject', e.target.value)}
                />
                {errors.subject && (
                <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
                </label>
                <textarea
                rows={5}
                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-gray-900 focus:ring-gray-900 text-gray-900"
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                />
                {errors.message && (
                <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                )}
            </div>

            <div className="hidden">
                <label>
                    Leave this field empty
                    <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    onChange={(e) => setData('website', e.target.value)}
                    value={data.website || ''}
                    />
                </label>
            </div>
                
            <div className="pt-2">
                <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {processing ? 'Sending…' : 'Send Message'}
                </button>
            </div>
        </form>
      </div>
    </AppLayout>
  )
}