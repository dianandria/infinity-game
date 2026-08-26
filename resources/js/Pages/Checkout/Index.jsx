import React, { useEffect, useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

const fmt = n => `Rp ${Number(n || 0).toLocaleString('id-ID')}`

export default function Checkout() {
  const { errors, cart, prefill, methods, provinces } = usePage().props
  const [form, setForm] = useState({
    name:  prefill?.name  || '',
    email: prefill?.email || '',
    phone: prefill?.phone || '',
    address: prefill?.address || '',
    city: prefill?.city || '',
    district: prefill?.district || '',
    province: prefill?.province || '',
    postal_code: prefill?.postal_code || '',
    notes: '',
    district_id: prefill?.district_id || '',
    payment_method: '',
    payment_channel: '',
    shipping_code: '',
    shipping_service: ''
  })

  const [processing, setProcessing] = useState(false)
  const [openGroup, setOpenGroup] = useState(methods?.[0]?.Code || null);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = e => {
    e.preventDefault();
    setProcessing(true);

    const payload = {
      ...form,
      payment_fee: paymentFee || 0,
    };

    router.post('/checkout', payload, {
      onFinish: () => setProcessing(false),
      preserveScroll: true,
    });
  };

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState(prefill?.province_id || "");
  const [selectedCityId, setSelectedCityId] = useState(prefill?.city_id || "");
  const [selectedDistrictId, setSelectedDistrictId] = useState(prefill?.district_id || "");

  useEffect(() => {
    const loadSavedLocations = async () => {
      try {
        if (prefill?.province_id) {
          const response = await axios.get(`/cities/${prefill.province_id}`);
          setCities(response.data);
        }

        if (prefill?.city_id) {
          const response = await axios.get(`/districts/${prefill.city_id}`);
          setDistricts(response.data);
        }
      } catch (error) {
        console.error('Error loading saved shipping address:', error);
      }
    };

    loadSavedLocations();
  }, [prefill?.city_id, prefill?.province_id]);

  const fetchCities = async (provinceId) => {
    try {
      const response = await axios.get(`/cities/${provinceId}`);
      setCities(response.data);
      setDistricts([]);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchDistricts = async (cityId) => {
    try {
      const response = await axios.get(`/districts/${cityId}`);
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    const prov = provinces.find(p => String(p.id) === String(id));

    setSelectedProvinceId(id);
    setSelectedCityId("");
    setSelectedDistrictId("");

    setForm(prev => ({
      ...prev,
      province: prov?.name || "",
      city: "",
      district: "",
      district_id: "",
    }));

    fetchCities(id);
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const city = cities.find(c => String(c.id) === String(id));

    setSelectedCityId(id);

    setForm(prev => ({
      ...prev,
      city: city?.name || "",
      district: "",
      district_id: "",
    }));
    setSelectedDistrictId("");

    fetchDistricts(id);
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    const district = districts.find(d => String(d.id) === String(id));

    setSelectedDistrictId(id);

    setForm(prev => ({
      ...prev,
      district: district?.name || "",
      district_id: id || "",
    }));
  };

  const [shippingCost, setShippingCost] = useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  const ORIGIN_ID = 449;
  const TOTAL_WEIGHT = 1000;
  const COURIER = 'jne:sicepat:jnt:tiki';

  const calculateShipping = async () => {
    if (!selectedDistrictId) {
      setShippingError('Mohon pilih kecamatan terlebih dahulu.');
      return;
    }

    setIsLoadingShipping(true);
    setShippingError(null);

    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const res = await fetch('/shipping/calculate-cost', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({
          origin: ORIGIN_ID,
          destination: selectedDistrictId,
          weight: TOTAL_WEIGHT,
          courier: COURIER,
          price: 'lowest',
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menghitung ongkir');
      }

      const data = await res.json();
      const options = data?.data || [];
      setShippingOptions(options);

      if (options.length > 0) {
        setSelectedShipping(options[0]);
        setShippingCost(options[0].cost);

        setForm(f => ({
          ...f,
          shipping_code: options[0].code,
          shipping_service: options[0].service
        }));
      }
    } catch (err) {
      console.error(err);
      setShippingError(err.message || 'Terjadi kesalahan saat hitung ongkir.');
    } finally {
      setIsLoadingShipping(false);
    }
  };

  const getTotal = () => {
    const subtotal = Number(cart.subtotal) || 0;
    const shipping = Number(shippingCost) || 0;
    const discount = Number(cart.discount) || 0;

    return subtotal + shipping - discount + paymentFee;
  };

  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState(null);
  const getPaymentFee = () => {
    if (!selectedPaymentChannel) return 0;

    const feeObj = selectedPaymentChannel.TransactionFee || {};
    const feeValue = Number(feeObj.ActualFee) || 0;
    const feeType  = feeObj.ActualFeeType;

    if (!feeValue || !feeType) return 0;

    const subtotal = Number(cart.subtotal) || 0;
    const shipping = Number(shippingCost) || 0;
    const discount = Number(cart.discount) || 0;

    const baseAmount = subtotal + shipping - discount;

    if (feeType === 'PERCENT') {
      const fee = (baseAmount * feeValue) / 100;
      return Math.ceil(fee);
    }

    return feeValue;
  };

  const paymentFee = getPaymentFee();

  return (
    <AppLayout>
      <Head title="Checkout - Infinity Game" />

      <main className="checkout-page">
        <div className="checkout-container">
          <h2 className="checkout-title">Checkout Pesanan</h2>

          <form onSubmit={submit} className="checkout-layout">
            <div className="checkout-billing-details">
              {/* 1. DATA PEMESAN */}
              <div className="checkout-card">
                <h3 className="card-section-title">1. Data Pemesan</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Nama Lengkap *</label>
                    <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Masukkan nama lengkap" required />
                    {errors.name && <p className="field-error">{errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Nomor WhatsApp/Telepon *</label>
                    <input id="phone" name="phone" value={form.phone} onChange={onChange} placeholder="Contoh: 081234567xxx" required />
                    {errors.phone && <p className="field-error">{errors.phone}</p>}
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="email">Alamat Email *</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="alamatemail@gmail.com" required />
                    {errors.email && <p className="field-error">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* 2. ALAMAT PENGIRIMAN */}
              <div className="checkout-card">
                <h3 className="card-section-title">2. Alamat Pengiriman</h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="address">Alamat Lengkap (Nama Jalan, No. Rumah, RT/RW) *</label>
                    <textarea id="address" name="address" rows={3} value={form.address} onChange={onChange} placeholder="Masukkan alamat lengkap pengiriman" required />
                    {errors.address && <p className="field-error">{errors.address}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="province">Provinsi *</label>
                    <select id="province" name="province" value={selectedProvinceId || ""} onChange={handleProvinceChange} required>
                      <option value="">-- Pilih Provinsi --</option>
                      {provinces.map((prov) => (
                        <option key={prov.id} value={prov.id}>{prov.name}</option>
                      ))}
                    </select>
                    {errors.province && <p className="field-error">{errors.province}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">Kota / Kabupaten *</label>
                    <select id="city" name="city" value={selectedCityId || ""} onChange={handleCityChange} required>
                      <option value="">-- Pilih Kota --</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                    {errors.city && <p className="field-error">{errors.city}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="district">Kecamatan *</label>
                    <select id="district" name="district" value={selectedDistrictId || ""} onChange={handleDistrictChange} required>
                      <option value="">-- Pilih Kecamatan --</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </select>
                    {errors.district && <p className="field-error">{errors.district}</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="postal_code">Kode Pos *</label>
                    <input id="postal_code" name="postal_code" value={form.postal_code} onChange={onChange} placeholder="Contoh: 40132" required />
                    {errors.postal_code && <p className="field-error">{errors.postal_code}</p>}
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="notes">Catatan Pesanan (Opsional)</label>
                    <textarea id="notes" name="notes" rows={2} value={form.notes} onChange={onChange} placeholder="Catatan khusus mengenai pengiriman atau produk" />
                  </div>
                </div>
              </div>

              {/* 3. PENGIRIMAN & PEMBAYARAN */}
              <div className="checkout-card">
                <h3 className="card-section-title">3. Pengiriman &amp; Pembayaran</h3>

                <button type="button" onClick={calculateShipping} className="btn-outline-small">
                  {isLoadingShipping ? 'Menghitung ongkir...' : 'Hitung & Pilih Jasa Kirim'}
                </button>

                {errors.shipping_service && <p className="field-error">{errors.shipping_service}</p>}
                {shippingError && <p className="field-error">{shippingError}</p>}

                {shippingOptions.length > 0 && (
                  <div className="shipping-options">
                    {shippingOptions.map((opt) => (
                      <label key={`${opt.code}-${opt.service}`} className="shipping-option">
                        <div className="shipping-option-left">
                          <input
                            type="radio"
                            name="shipping_service"
                            checked={selectedShipping && selectedShipping.code === opt.code && selectedShipping.service === opt.service}
                            onChange={() => {
                              setSelectedShipping(opt);
                              setShippingCost(opt.cost);
                              setForm(f => ({ ...f, shipping_code: opt.code, shipping_service: opt.service }));
                            }}
                          />
                          <div>
                            <div className="shipping-option-name">{opt.name} &mdash; {opt.service}</div>
                            <div className="shipping-option-desc">{opt.description} &middot; Estimasi {opt.etd}</div>
                          </div>
                        </div>
                        <div className="shipping-option-price">Rp {opt.cost.toLocaleString('id-ID')}</div>
                      </label>
                    ))}
                  </div>
                )}

                <h4 className="payment-subtitle">Metode Pembayaran *</h4>
                {errors.payment_method && <p className="field-error">{errors.payment_method}</p>}
                {methods.length === 0 && (
                  <p className="muted-text">Metode pembayaran belum tersedia. Silakan coba beberapa saat lagi.</p>
                )}

                {methods.length > 0 && (
                  <div className="payment-groups">
                    {methods.map(group => {
                      const groupCode = group.Code;
                      const groupName = group.Name;
                      const channels  = group.Channels || [];
                      const isOpen    = openGroup === groupCode;

                      return (
                        <div key={groupCode} className="payment-group">
                          <button
                            type="button"
                            onClick={() => setOpenGroup(prev => (prev === groupCode ? null : groupCode))}
                            className="payment-group-header"
                          >
                            <div>
                              <div className="payment-group-name">{groupName}</div>
                              <div className="payment-group-count">{channels.length} channel tersedia</div>
                            </div>
                            <span className={`payment-group-arrow ${isOpen ? 'open' : ''}`}>&#9654;</span>
                          </button>

                          {isOpen && channels.length > 0 && (
                            <div className="payment-channels">
                              {channels.map(ch => {
                                const channelCode = ch.Code;
                                const channelName = ch.Name;
                                const isSelected = form.payment_method === groupCode && form.payment_channel === channelCode;
                                const disabled = ch.FeatureStatus !== 'active' || ch.HealthStatus !== 'online';
                                const feeObj = ch.TransactionFee || {};
                                const feeLabel = feeObj.ActualFee != null
                                  ? (feeObj.ActualFeeType === 'PERCENT' ? `${feeObj.ActualFee}%` : `Rp ${Number(feeObj.ActualFee).toLocaleString('id-ID')}`)
                                  : null;

                                return (
                                  <button
                                    key={channelCode}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => {
                                      if (disabled) return;
                                      setForm(f => ({ ...f, payment_method: groupCode, payment_channel: channelCode }));
                                      setSelectedPaymentChannel(ch);
                                    }}
                                    className={`payment-channel ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                                  >
                                    {ch.Logo && <img src={ch.Logo} alt={channelName} className="payment-channel-logo" />}
                                    <div className="payment-channel-info">
                                      <div className="payment-channel-name">{channelName}</div>
                                      <div className="payment-channel-fee">{feeLabel ? `Biaya ${feeLabel}` : 'Tanpa biaya tambahan'}</div>
                                    </div>
                                    <span className={`payment-channel-radio ${isSelected ? 'selected' : ''}`} />
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="checkout-summary-wrapper">
              <div className="checkout-summary-card">
                <h3>Ringkasan Pesanan</h3>

                <div className="checkout-mini-products">
                  {cart.items.map(it => (
                    <div key={it.product_id} className="mini-product-item">
                      <img src={it.image_url || '/images/about-us.jpg'} alt={it.name} className="mini-img" />
                      <div className="mini-info">
                        <h4 className="mini-name">{it.name}</h4>
                        <span className="mini-qty-price">{it.qty} &times; {fmt(it.price)}</span>
                      </div>
                      <span className="mini-total-price">{fmt(it.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="checkout-calc-details">
                  <div className="calc-row">
                    <span className="calc-label">Subtotal Produk</span>
                    <span className="calc-value">{fmt(cart.subtotal)}</span>
                  </div>
                  <div className="calc-row">
                    <span className="calc-label">Biaya Kirim</span>
                    <span className="calc-value">{shippingCost != null ? fmt(shippingCost) : '—'}</span>
                  </div>
                  {!!cart.discount && (
                    <div className="calc-row">
                      <span className="calc-label">Diskon</span>
                      <span className="calc-value">-{fmt(cart.discount)}</span>
                    </div>
                  )}
                  {paymentFee > 0 && (
                    <div className="calc-row">
                      <span className="calc-label">Biaya Payment</span>
                      <span className="calc-value">{fmt(paymentFee)}</span>
                    </div>
                  )}
                  <hr className="calc-divider" />
                  <div className="calc-row total-row">
                    <span className="calc-label">Total Tagihan</span>
                    <span className="calc-value-total">{fmt(getTotal())}</span>
                  </div>
                </div>

                <button type="submit" className="btn-place-order" disabled={processing}>
                  {processing ? 'Memproses...' : 'Konfirmasi & Buat Pesanan'}
                </button>

                <Link href="/cart" className="back-to-cart">&larr; Kembali ke Keranjang</Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </AppLayout>
  )
}
