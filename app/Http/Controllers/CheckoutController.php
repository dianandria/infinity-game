<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Services\IpaymuService;
use App\Services\RajaOngkirService;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderCreatedMail;

class CheckoutController extends Controller
{
    public function __construct(
        protected IpaymuService $ipaymu,
        protected RajaOngkirService $rajaOngkirService
    ) {}

    private function currentCart(Request $request): array
    {
        // ambil dari session (sesuai modul cart kita)
        return $request->session()->get('cart', []);
    }

    private function summarize(array $cart): array
    {
        $items = collect($cart)->values()->map(function ($it) {
            $it['subtotal'] = (int)$it['price'] * (int)$it['qty'];
            return $it;
        });
        $subtotal = (int) $items->sum('subtotal');
        $shipping = 0; // TODO: hitung dari RajaOngkir/Shipper
        $discount = 0;
        $total    = max(0, $subtotal + $shipping - $discount);

        return compact('items','subtotal','shipping','discount','total');
    }

    public function create(Request $request)
    {
        $cart = $this->currentCart($request);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('info','Keranjang kosong.');
        }

        $summary = $this->summarize($cart);

        // Ipaymu Payment Method
        $methods = $this->ipaymu->paymentChannels(); 
        $methods = collect($methods)
            ->filter(function ($group) {
                // Keep only group with Code 'va'
                return strtolower($group['Code'] ?? '') === 'va';
            })
            ->map(function ($group) {
                // Check if Channels exist and filter out BRI and BSI
                if (isset($group['Channels']) && is_array($group['Channels'])) {
                    $group['Channels'] = collect($group['Channels'])
                        ->reject(function ($channel) {
                            // Reject channels where the Code is 'bri' or 'bsi'
                            return in_array(strtolower($channel['Code'] ?? ''), ['bri', 'bsi']);
                        })
                        ->values() // Reset the index of the Channels array
                        ->all();
                }
                return $group;
            })
            ->values() // Reset the index of the main array
            ->all();

        // Rajaongkir list province
        $provinces = $this->rajaOngkirService->getProvinces();
       
        return Inertia::render('Checkout/Index', [
            'prefill' => [
                'name' => optional($request->user())->name,
                'email' => optional($request->user())->email,
                'phone' => optional($request->user())->phone ?? '',
                'address' => optional($request->user())->address ?? '',
                'province_id' => optional($request->user())->province_id ?? '',
                'province' => optional($request->user())->province ?? '',
                'city_id' => optional($request->user())->city_id ?? '',
                'city' => optional($request->user())->city ?? '',
                'district_id' => optional($request->user())->district_id ?? '',
                'district' => optional($request->user())->district ?? '',
                'postal_code' => optional($request->user())->postal_code ?? '',
            ],
            'cart'    => $summary,
            'methods' => $methods,
            'provinces' => $provinces['data']
        ]);
    }

    public function store(Request $request)
    {
        // Validasi: guest & login sama—guest wajib isi email+nama
        $data = $request->validate([
            'name'       => ['required','string','max:120'],
            'email'      => ['required','email','max:120'],
            'phone' => ['required', 'string', 'min:10', 'max:15', 'regex:/^(0|62)[0-9]+$/'],
            'address'    => ['required','string','max:240'],
            'city'       => ['required','string','max:120'],
            'province'   => ['required','string','max:120'],
            'district'   => ['required','string','max:120'],
            'postal_code'=> ['required','string','max:15'],
            'notes'      => ['nullable','string','max:500'],
            'payment_method' => ['required','string','max:50'],
            'payment_channel' => ['required','string','max:50'],
            'payment_fee'     => ['required', 'integer'],
            'shipping_code' => ['required','string','min:0'],
            'shipping_service'   => ['required','string','min:0'],
            'district_id'   => ['required','integer','min:0'],
        ]);
       
        $cart = $this->currentCart($request);
        if (empty($cart)) {
            return back()->with('error','Keranjang kosong.');
        }

        // SHIPPING FEE
        $shippingResult = $this->rajaOngkirService->calculateShippingCost(
            449, // TO DO
            $data['district_id'],
            1000, // TO DO
            $data['shipping_code'],   // 'jne'
            'lowest'
        );

        $selectedService = collect($shippingResult['data'] ?? [])
            ->firstWhere('service', $data['shipping_service']);

        $shipping = (int) ($selectedService['cost'] ?? 0);
        // END

        // PAYMENT FEE
        // $method = $data['payment_method'];   // 'va' / 'qris'
        // $channel = $data['payment_channel']; // 'bca' / 'btn'

        // $feeConfig = $this->ipaymuFeeService->getFee($method, $channel);
        // $baseAmount = $subtotal + $shipping - $discount;

        // if ($feeConfig['type'] === 'PERCENT') {
        //     $paymentFee = (int) ceil($baseAmount * ($feeConfig['value'] / 100));
        // } else {
        //     $paymentFee = (int) $feeConfig['value']; // fixed Rp 3.500, dst
        // }
        // END
        
        // Revalidate stok & harga dari DB (hindari manipulasi)
        $lines = [];
        $subtotal = 0;

        foreach ($cart as $line) {
            /** @var Product $p */
            $p = Product::lockForUpdate()->find($line['product_id']); // lock stok
            if (!$p) return back()->with('error','Produk tidak ditemukan.');

            $qty = min((int)$line['qty'], max(0, (int)$p->stock));
            if ($qty <= 0) return back()->with('error', "Stok habis: {$p->name}");

            $price = (int)$p->price; // pakai harga terkini
            $lines[] = [
                'product'  => $p,
                'name'     => $p->name,
                'price'    => $price,
                'qty'      => $qty,
                'subtotal' => $price * $qty,
            ];
            $subtotal += $price * $qty;
        }

        $shipping   = (int) ($shipping ?? 0);
        $paymentFee   = (int) ($data['payment_fee'] ?? 0);
        $discount = 0; // TODO: voucher
        $total = max(0, $subtotal + $shipping - $discount + $paymentFee);

        $order = DB::transaction(function () use ($request, $data, $lines, $subtotal, $shipping, $discount, $paymentFee, $total) {
            $order = Order::create([
                'user_id'          => optional($request->user())->id,
                'code'             => 'ORD-'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
                'customer_name'    => $data['name'],
                'customer_email'   => $data['email'],
                'customer_phone'   => $data['phone'] ?? null,
                'shipping_address' => [
                    'address' => $data['address'],
                    'city'    => $data['city'],
                    'province'=> $data['province'],
                    'postal'  => $data['postal_code'],
                    'district'  => $data['district'],
                    'notes'   => $data['notes'] ?? null,
                ],
                'subtotal'         => $subtotal,
                'shipping_fee'     => $shipping,
                'payment_fee'      => $paymentFee,
                'discount'         => $discount,
                'total'            => $total,
                'payment_provider' => 'ipaymu', // set 'midtrans' saat integrasi
                'payment_ref'      => null,
                'status'           => 'pending',
                'shipping_code'    => $data['shipping_code'],
                'shipping_service' => $data['shipping_service'],
            ]);

            foreach ($lines as $ln) {
                OrderItem::create([
                    'order_id'  => $order->id,
                    'product_id'=> $ln['product']->id,
                    'name'      => $ln['name'],
                    'price'     => $ln['price'],
                    'qty'       => $ln['qty'],
                    'subtotal'  => $ln['subtotal'],
                ]);

                // kurangi stok
                $ln['product']->decrement('stock', $ln['qty']);
            }

            return $order;
        });

        // 2) Siapkan payload iPaymu (pakai body yang sama seperti contoh cURL kamu)
        $productNames  = array_column($lines, 'name');
        $qtyArr        = array_column($lines, 'qty');
        $priceArr      = array_column($lines, 'price');

        $payload = [
            'name'           => $order->customer_name,
            'phone'          => $order->customer_phone ?? '0000000000',
            'email'          => $order->customer_email,
            'amount'         => (string) $order->total,
            'notifyUrl'      => route('ipaymu.notify'), // bikin route ini
            'expired'        => '24',
            'expiredType'    => 'hours',
            'comments'       => $order->code,
            'referenceId'    => (string) $order->id,
            'paymentMethod'  => $data['payment_method'],
            'paymentChannel' => $data['payment_channel'],
            'product'        => $productNames,
            'qty'            => array_map('strval', $qtyArr),
            'price'          => array_map('strval', $priceArr),
            'weight'         => array_fill(0, count($productNames), '1'),
            'width'          => array_fill(0, count($productNames), '1'),
            'height'         => array_fill(0, count($productNames), '1'),
            'length'         => array_fill(0, count($productNames), '1'),
            'deliveryArea'   => $data['postal_code'],
            'deliveryAddress'=> $data['address'],
        ];

        try {
            // 3) Call iPaymu Direct Payment
            $ipaymuData = $this->ipaymu->directPayment($payload);

            // Response direct payment (dari dokumen):
            // TransactionId, ReferenceId, Via, Channel, PaymentNo, PaymentName, Total, Fee, Expired
            // :contentReference[oaicite:0]{index=0}

            $order->update([
                'payment_ref'            => $ipaymuData['ReferenceId'] ?? null,
                'ipaymu_transaction_id'  => $ipaymuData['TransactionId'] ?? null,
                'ipaymu_payment_no'      => $ipaymuData['PaymentNo'] ?? null,
                'payment_payload'        => $ipaymuData, // butuh cast json di model
                'payment_fee'            => $ipaymuData['Fee']
            ]);
        } catch (\Throwable $e) {
            // Kalau gagal, bisa rollback stok / tandai order error
            report($e);

            return redirect()
                ->route('checkout.failed', $order->id)
                ->with('error', 'Gagal membuat pembayaran di iPaymu, silakan coba lagi.');
        }

        // Bersihkan cart session
        $request->session()->forget('cart');

        // --- NEW MAILING LOGIC START ---
        // Eager load items so they are available in the email template
        $order->load('items'); 

        try {
            // Send to Customer
            Mail::to($order->customer_email)
                ->send(new OrderCreatedMail($order, 'customer'));

            // Send to Admin (You can hardcode this, or pull from config/env)
            $adminEmail = env('ADMIN_EMAIL', 'dian.andria14@gmail.com');
            Mail::to($adminEmail)
                ->send(new OrderCreatedMail($order, 'admin'));
                
        } catch (\Throwable $e) {
            // If email fails, log it, but don't stop the user from reaching the payment page
            report($e);
        }
        // --- NEW MAILING LOGIC END ---

        // TODO (opsional): redirect ke Midtrans Snap
        // $token = Midtrans::createSnap($order); $order->update([...]);

        return redirect()
            ->route('checkout.pay', $order->id)
            ->with('success', 'Order dibuat. Terima kasih!');
    }

    public function thankyou(Order $order)
    {
        // batasi akses: hanya pemilik (login) atau melalui session flash? Untuk MVP, tampilkan ringkas.
        return Inertia::render('Checkout/ThankYou', [
            'order' => [
                'code'     => $order->code,
                'email'    => $order->customer_email,
                'total'    => $order->total,
                'status'   => $order->status,
                'created'  => $order->created_at->toDateTimeString(),
            ]
        ]);
    }

    public function pay(Order $order)
    {
        // Ambil payload untuk mencegah error jika null
        $payload = $order->payment_payload ?? [];

        return Inertia::render('Checkout/PayWithIpaymu', [
            // order tidak perlu memuat payment_no lagi karena sudah ada di array ipaymu
            'order' => $order->only(['id', 'code', 'total', 'status']), 
            'ipaymu' => [
                'payment_no'   => $order->ipaymu_payment_no,
                'amount'       => $order->total,
                'expired_at'   => isset($payload['Expired'])
                                ? \Carbon\Carbon::parse($payload['Expired'])->format('d-m-Y H:i:s')
                                : null,
                // Tambahkan data ini agar frontend bisa menampilkan instruksi dinamis
                'channel'      => $payload['Channel'] ?? 'Bank',
                'payment_name' => $payload['PaymentName'] ?? 'Infinity Game',
                'via'          => $payload['Via'] ?? 'VA',
            ],
        ]);
    }

    public function failed(Order $order)
    {
        return inertia('Checkout/Failed', [
            'order' => [
                'id'     => $order->id,
                'code'   => $order->code,
                'total'  => $order->total,
                'status' => $order->status,
            ],
            'message' => session('error') ?? 'Pembayaran gagal diproses. Silakan coba lagi atau gunakan metode pembayaran lain.',
        ]);
    }

}
