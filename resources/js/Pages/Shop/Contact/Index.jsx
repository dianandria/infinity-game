import React from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

export default function ContactIndex() {
  const { status, sliders = [] } = usePage().props
  const banner = sliders?.[0]?.image_path ? `/storage/${sliders[0].image_path}` : '/images/about-us.jpg'
  const mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.852346630734!2d107.6063609747569!3d-6.908252993091152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6380ff7472f%3A0x9fcc736a471f7565!2sINFINITY%20GAME!5e0!3m2!1sen!2sid!4v1781773496414!5m2!1sen!2sid'
  const mapShareUrl = 'https://www.google.com/maps/place/INFINITY+GAME/@-6.908253,107.606361,17z'

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
      onSuccess: () => reset('message'),
    })
  }

  return (
    <AppLayout>
      <Head title="Kontak Kami - Infinity Game" />

      <main className="contact-page">
        <div className="contact-banner-section">
          <img src={banner} alt="Kontak Banner" className="banner-img" />
          <div className="banner-overlay"></div>
          <div className="banner-text">
            <p>PUNYA PERTANYAAN ATAU BUTUH BANTUAN?</p>
            <h1>Hubungi Kami</h1>
          </div>
        </div>

        <div className="contact-content">
          <div className="contact-info-card">
            <div className="map-container">
              <iframe
                title="Lokasi Infinity Game"
                src={mapEmbedUrl}
                width="550"
                height="450"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="info-details">
              <div className="info-grid">
                <div className="info-item">
                  <h3>Alamat Toko Offline</h3>
                  <p>
                    Infinity Game Hub<br />
                    Jl. Purnawarman No.13-15 L2 – B07, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117
                  </p>
                </div>
                <div className="info-item">
                  <h3>Customer Support</h3>
                  <p>
                    <strong>WhatsApp:</strong> +62 811-2345-6789<br />
                    <strong>Email:</strong> support@infinitygame.id<br />
                    <strong>Telepon:</strong> (022) 420-1234
                  </p>
                </div>
              </div>

              <div className="info-bottom">
                <div className="loc-text">
                  <strong>Jam Operasional</strong>
                  <p>Setiap Hari: 10:00 - 22:00 WIB</p>
                </div>
                <a href={mapShareUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Buka di Maps
                </a>
              </div>
            </div>
          </div>

          <div className="form-divider">
            <span>Atau Kirim Pesan</span>
          </div>

          <div className="form-container">
            {status && (
              <div className="form-status-success">{status}</div>
            )}

            <form onSubmit={onSubmit} className="contact-form">
              <div className="form-group">
                <label>Nama Lengkap <span className="required">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Masukkan nama Anda"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Masukkan alamat email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label>Nomor Telepon (opsional)</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Contoh: 08123456789"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                />
                {errors.phone && <p className="field-error">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label>Subjek (opsional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Perihal pesan"
                  value={data.subject}
                  onChange={(e) => setData('subject', e.target.value)}
                />
                {errors.subject && <p className="field-error">{errors.subject}</p>}
              </div>

              <div className="form-group full-width">
                <label>Pesan <span className="required">*</span></label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Tuliskan pertanyaan atau kendala Anda di sini..."
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  required
                ></textarea>
                {errors.message && <p className="field-error">{errors.message}</p>}
              </div>

              <div style={{ display: 'none' }}>
                <label>
                  Kosongkan kolom ini
                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    value={data.website || ''}
                    onChange={(e) => setData('website', e.target.value)}
                  />
                </label>
              </div>

              <button type="submit" className="btn-primary full-width" disabled={processing}>
                {processing ? 'Mengirim...' : 'Kirim Pesan Sekarang'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
