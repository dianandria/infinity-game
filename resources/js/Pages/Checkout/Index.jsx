import React, { useState } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

const fmt = n => `Rp ${Number(n || 0).toLocaleString('id-ID')}`

export default function Checkout() {
  const { errors, cart, prefill, methods, provinces } = usePage().props
  const [form, setForm] = useState({
    name:  prefill?.name  || '',
    email: prefill?.email || '',
    phone: prefill?.phone || '',
    address: '',
    city: '',
    district: '',
    province: '',
    postal_code: '',
    notes: '',
    payment_method: '',   // ex: 'va', 'qris', 'cod'
    payment_channel: '',   // ex: 'bri', 'bca', 'cod'
    shipping_code: '',     // misal 'jne'
    shipping_service: '' // misal 'REG'
  })

  const [processing, setProcessing] = useState(false)

  // group yang lagi kebuka di accordion
  const [openGroup, setOpenGroup] = useState(methods?.[0]?.Code || null);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = e => {
    e.preventDefault();
    setProcessing(true);

    const payload = {
      ...form,
      payment_fee: paymentFee || 0, // 👉 lempar fee di sini
    };

    router.post('/checkout', payload, {
      onFinish: () => setProcessing(false),
      preserveScroll: true,
    });
  };

  // City & districts state
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Selected province and city state
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  // Mengambil kota berdasarkan provinsi yang dipilih
  const fetchCities = async (provinceId) => {
    try {
      const response = await axios.get(`/cities/${provinceId}`);
      setCities(response.data);
      setDistricts([]); // Reset district selection
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Mengambil kecamatan berdasarkan kota yang dipilih
  const fetchDistricts = async (cityId) => {
    try {
      const response = await axios.get(`/districts/${cityId}`);
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  // Handle perubahan provinsi
  const handleProvinceChange = (e) => {
  const id = e.target.value;
  const prov = provinces.find(p => String(p.id) === String(id));

  setSelectedProvinceId(id);

  setForm(prev => ({
    ...prev,
    province: prov?.name || "", // ✅ nama
    city: "",
    district: "",
  }));

  fetchCities(id);
};

  // Handle perubahan kota
  const handleCityChange = (e) => {
    const id = e.target.value;
    const city = cities.find(c => String(c.id) === String(id));

    setSelectedCityId(id);

    setForm(prev => ({
      ...prev,
      city: city?.name || "",
    }));

    fetchDistricts(id);
  };

  // Handle perubahan kota
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

  // SHIPPING COST
  const [shippingCost, setShippingCost] = useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState(null);
  const [shippingOptions, setShippingOptions] = useState([]);   // list jasa kirim
  const [selectedShipping, setSelectedShipping] = useState(null); // yang dipilih

  // misal dari backend / props
  const ORIGIN_ID = 449;          // id origin (gudang/toko)
  const TOTAL_WEIGHT = 1000;       // dalam gram, sesuaikan dari cart
  const COURIER = 'jne:sicepat:jnt:tiki'; // contoh, sesuaikan

  const calculateShipping = async () => {
    // pastikan data minimal sudah ada
    if (!selectedDistrictId) {
      setShippingError('Mohon pilih district terlebih dahulu.');
      return;
    }

    setIsLoadingShipping(true);
    setShippingError(null);

    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      const res = await fetch('/shipping/calculate-cost', { // sesuaikan dengan route kamu
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
          destination: selectedDistrictId,   // district id dari select
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

      // Default: pilih yang pertama / termurah
      if (options.length > 0) {
        setSelectedShipping(options[0]);
        setShippingCost(options[0].cost);
       
        setForm(f => ({
          ...f,
          shipping_code: options[0].code,      // misal: 'tiki'
          shipping_service: options[0].service // misal: 'ECO'
        }));
      }

    } catch (err) {
      console.error(err);
      setShippingError(err.message || 'Terjadi kesalahan saat hitung ongkir.');
    } finally {
      setIsLoadingShipping(false);
    }
  };

  // COUNT TOTAL
  const getTotal = () => {
    const subtotal = Number(cart.subtotal) || 0;
    const shipping = Number(shippingCost) || 0;
    const discount = Number(cart.discount) || 0; // kalau ga ada, akan jadi 0

    return subtotal + shipping - discount + paymentFee;
  };

  // PAYMENT FEE
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState(null);
  const getPaymentFee = () => {
  if (!selectedPaymentChannel) return 0;

  const feeObj = selectedPaymentChannel.TransactionFee || {};
  const feeValue = Number(feeObj.ActualFee) || 0;
  const feeType  = feeObj.ActualFeeType; // 'PERCENT' atau misalnya 'FIXED'

  if (!feeValue || !feeType) return 0;

  // dasar perhitungan fee = subtotal + shipping - discount
  const subtotal = Number(cart.subtotal) || 0;
  const shipping = Number(shippingCost) || 0;
  const discount = Number(cart.discount) || 0;

  const baseAmount = subtotal + shipping - discount;

  // Percent (contoh: QRIS 0.7%)
  if (feeType === 'PERCENT') {
    // 0.7% → 0.7 / 100
    const fee = (baseAmount * feeValue) / 100;
    // biasanya gateway dibuletin ke atas
    return Math.ceil(fee);
  }

  // Selain PERCENT kita anggap FIXED / NOMINAL (VA Rp 3.500 / Rp 4.000)
  return feeValue;
};

const paymentFee = getPaymentFee();

  return (
    <AppLayout>
      <Head title="Checkout" />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Checkout</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* FORM */}
          <form onSubmit={submit} className="space-y-4 md:col-span-2">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-black">Customer</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-black">Name</label>
                  <input name="name" value={form.name} onChange={onChange}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-gray-800"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-black">Email</label>
                  <input name="email" type="email" value={form.email} onChange={onChange}
                         className="mt-1 w-full rounded-xl border px-3 py-2 text-gray-800" required/>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-black">Phone</label>
                  <input name="phone" value={form.phone} onChange={onChange}
                         className="mt-1 w-full rounded-xl border px-3 py-2 text-gray-800" required/>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-black">Shipping Address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm text-black">Address</label>
                  <input name="address" value={form.address} onChange={onChange}
                         className="mt-1 w-full rounded-xl border px-3 py-2 text-gray-800" required/>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-black">Province</label>
                  <select 
                    name="province"
                    value={selectedProvinceId || ""}
                    onChange={(e) => {
                      handleProvinceChange(e);
                    }}
                    className='mt-1 w-full rounded-xl border px-3 py-2 text-gray-800'
                    required
                    >
                    <option value="">Select province</option>
                    {provinces.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                  {errors.province && (
                    <p className="mt-1 text-sm text-red-500">{errors.province}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-black">City</label>
                  <select 
                    name="city"
                    value={selectedCityId || ""}
                    onChange={(e) => {
                      handleCityChange(e);
                    }}
                    className='mt-1 w-full rounded-xl border px-3 py-2 text-gray-800'
                    required
                    >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-black">District</label>
                  <select 
                    name="district"
                    value={selectedDistrictId || ""}
                    onChange={handleDistrictChange}
                    className='mt-1 w-full rounded-xl border px-3 py-2 text-gray-800'
                    required
                    >
                    <option value="">Select district</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-500">{errors.district}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-black">Postal Code</label>
                  <input name="postal_code" value={form.postal_code} onChange={onChange}
                         className="mt-1 w-full rounded-xl border px-3 py-2 text-gray-800" required/>
                  {errors.postal_code && (
                    <p className="mt-1 text-sm text-red-500">{errors.postal_code}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-black">Notes (optional)</label>
                  <textarea name="notes" value={form.notes} onChange={onChange}
                            className="mt-1 w-full rounded-xl border px-3 py-2 text-gray-800" rows={3} />
                </div>
              </div>
              
              <div className="sm:col-span-2 mt-3">
                <button
                  type="button"
                  onClick={calculateShipping}
                  className="rounded-xl border px-3 py-2 text-sm font-medium bg-gray-900"
                >
                  {isLoadingShipping ? 'Memilih jasa kirim...' : 'Pilih jasa kirim'}
                </button>
                
                {errors.shipping_service && (
                  <p className="mt-1 text-sm text-red-500">{errors.shipping_service}</p>
                )}

                {shippingError && (
                  <p className="mt-1 text-sm text-red-500">{shippingError}</p>
                )}

                {shippingOptions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-semibold text-black">
                      Pilih jasa pengiriman
                    </p>

                    {shippingOptions.map((opt) => (
                      <label
                        key={`${opt.code}-${opt.service}`}
                        className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-sm cursor-pointer text-gray-900"
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="radio"
                            name="shipping_service"
                            value={`${opt.code}-${opt.service}`}
                            checked={
                              selectedShipping &&
                              selectedShipping.code === opt.code &&
                              selectedShipping.service === opt.service
                            }
                            onChange={() => {
                              setSelectedShipping(opt);
                              setShippingCost(opt.cost); // update biaya & total

                              setForm(f => ({
                                ...f,
                                shipping_code: opt.code,      // contoh: 'jne'
                                shipping_service: opt.service // contoh: 'REG'
                              }));
                            }}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium">
                              {opt.name} — {opt.service}
                            </div>
                            <div className="text-xs text-gray-500">
                              {opt.description} · Estimasi {opt.etd}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm font-semibold">
                          Rp {opt.cost.toLocaleString('id-ID')}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {shippingCost !== null && !shippingError && (
                  <p className="mt-2 text-sm text-gray-700">
                    Ongkir terpilih: <span className="font-semibold">
                      Rp {shippingCost.toLocaleString('id-ID')}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/cart" className="rounded-xl border px-4 py-2 text-gray-800">Back to Cart</Link>
              <button
                className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-black disabled:opacity-60"
                disabled={processing}
                type="submit"
              >
                {processing ? 'Processing…' : 'Place Order'}
              </button>
            </div>
          </form>

          {/* SUMMARY */}
          <aside className="h-fit space-y-4">
            {/* PAYMENT METHOD */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-black">Payment</h2>
              <p className="text-sm text-gray-600">
                Pilih metode pembayaran. Pembayaran akan diproses setelah menekan “Place Order”.
              </p>
              {errors.payment_method && (
                <p className="mt-1 text-sm text-red-500">{errors.payment_method}</p>
              )}
              {methods.length === 0 && (
                <p className="mt-3 text-sm text-gray-500">
                  Metode pembayaran belum tersedia. Silakan coba beberapa saat lagi.
                </p>
              )}

              {methods.length > 0 && (
                <div className="mt-4 space-y-3">
                  {methods.map(group => {
                    const groupCode = group.Code;     // contoh: 'va'
                    const groupName = group.Name;     // contoh: 'Virtual Account'
                    const channels  = group.Channels || [];
                    const isOpen    = openGroup === groupCode;

                    return (
                      <div
                        key={groupCode}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                      >
                        {/* HEADER ACCORDION */}
                        <button
                          type="button"
                          onClick={() =>
                            setOpenGroup(prev => (prev === groupCode ? null : groupCode))
                          }
                          className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {groupName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {channels.length} channel tersedia
                            </div>
                          </div>
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs transition-transform ${
                              isOpen ? 'rotate-90' : ''
                            }`}
                          >
                            ▶
                          </span>
                        </button>

                        {/* BODY ACCORDION */}
                        {isOpen && channels.length > 0 && (
                          <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
                            <div className="space-y-2">
                              {channels.map(ch => {
                                const channelCode = ch.Code;  // ex: 'bri'
                                const channelName = ch.Name;  // ex: 'BRI'

                                const isSelected =
                                  form.payment_method === groupCode &&
                                  form.payment_channel === channelCode;

                                const disabled =
                                  ch.FeatureStatus !== 'active' ||
                                  ch.HealthStatus !== 'online';

                                const feeObj   = ch.TransactionFee || {};
                                const feeLabel =
                                  feeObj.ActualFee != null
                                    ? feeObj.ActualFeeType === 'PERCENT'
                                      ? `${feeObj.ActualFee}%`
                                      : `Rp ${Number(feeObj.ActualFee).toLocaleString('id-ID')}`
                                    : null;

                                return (
                                  <button
                                    key={channelCode}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => {
                                      if (disabled) return;
                                      setForm(f => ({
                                        ...f,
                                        payment_method: groupCode,   // 'va', 'qris', 'cod'
                                        payment_channel: channelCode // 'bri', 'bca', 'cod'
                                      }));

                                      // simpan seluruh data channel yang dipilih
                                      setSelectedPaymentChannel(ch);
                                    }}
                                    className={[
                                      'flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition',
                                      disabled
                                        ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                                        : 'bg-white hover:border-blue-500 hover:bg-blue-50',
                                      isSelected
                                        ? 'border-blue-500 ring-1 ring-blue-200'
                                        : 'border-gray-200',
                                    ].join(' ')}
                                  >
                                    {ch.Logo && (
                                      <img
                                        src={ch.Logo}
                                        alt={channelName}
                                        className="h-8 w-8 flex-shrink-0 object-contain"
                                      />
                                    )}

                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">
                                        {channelName}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {feeLabel
                                          ? `Biaya ${feeLabel}`
                                          : 'Tanpa biaya tambahan'}
                                      </div>
                                      {ch.HealthStatus === 'online' && !disabled && (
                                        <div className="mt-1 text-[10px] text-green-600">
                                          Channel online
                                        </div>
                                      )}
                                    </div>

                                    <span
                                      className={[
                                        'inline-flex h-4 w-4 items-center justify-center rounded-full border-2',
                                        isSelected
                                          ? 'border-blue-500 bg-blue-500'
                                          : 'border-gray-300 bg-white',
                                      ].join(' ')}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-black">Summary</h2>
              <div className="space-y-2 text-sm text-black">
                {cart.items.map(it => (
                  <div key={it.product_id} className="flex justify-between">
                    <span className="line-clamp-1">{it.name} × {it.qty}</span>
                    <span>{fmt(it.subtotal)}</span>
                  </div>
                ))}
                <hr className="my-2" />
                <div className="flex justify-between text-black">
                  <span>Subtotal</span>
                  <span>{fmt(cart.subtotal)}</span>
                </div>

                <div className="flex justify-between text-black">
                  <span>Shipping</span>
                  <span>{shippingCost != null ? fmt(shippingCost) : '—'}</span>
                </div>

                {!!cart.discount && (
                  <div className="flex justify-between text-black">
                    <span>Discount</span>
                    <span>-{fmt(cart.discount)}</span>
                  </div>
                )}

                {paymentFee > 0 && (
                  <div className="flex justify-between text-black">
                    <span>Biaya payment method</span>
                    <span>{fmt(paymentFee)}</span>
                  </div>
                )}

                <div className="mt-2 flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>
                    {fmt(getTotal())}
                  </span>
                </div>

              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppLayout>
  )
}