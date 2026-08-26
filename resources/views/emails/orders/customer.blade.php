<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #4a5568; 
            background-color: #f4f7f6; 
            margin: 0; 
            padding: 20px; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 8px; 
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); 
            overflow: hidden; 
            border-top: 6px solid #8D0B3E; /* Warna Coral Aksen */
        }
        .header { 
            background-color: #152341; /* Warna Biru Teal Utama */
            color: #ffffff; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h2 { 
            margin: 0; 
            font-size: 24px; 
            font-weight: 600;
        }
        .content { 
            padding: 30px; 
        }
        .greeting {
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 20px;
        }
        .payment-box { 
            background-color: #f8fafc; 
            border-left: 5px solid #152341; 
            padding: 20px; 
            margin: 25px 0; 
            border-radius: 4px;
        }
        .payment-box h3 {
            margin-top: 0;
            color: #152341;
            font-size: 18px;
            margin-bottom: 15px;
        }
        .payment-box p {
            margin: 8px 0;
            font-size: 15px;
        }
        .highlight-text {
            color: #8D0B3E;
            font-weight: bold;
        }
        .section-title { 
            font-size: 18px; 
            color: #152341; 
            border-bottom: 2px solid #edf2f7; 
            padding-bottom: 8px; 
            margin-bottom: 15px; 
            margin-top: 35px; 
            font-weight: 600;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px; 
        }
        th { 
            background-color: #f0f4f6; 
            color: #152341; 
            font-weight: 600; 
            text-transform: uppercase; 
            font-size: 12px; 
            padding: 12px;
            text-align: left;
        }
        td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #edf2f7; 
            font-size: 14px;
        }
        .total-row td { 
            font-weight: 600; 
            color: #2d3748;
        }
        .grand-total {
            color: #8D0B3E !important;
            font-size: 16px;
            font-weight: bold;
        }
        .address-box {
            background-color: #f9fafb;
            border: 1px solid #e2e8f0;
            padding: 15px;
            border-radius: 6px;
            font-size: 14px;
            margin-top: 10px;
        }
        .footer {
            background-color: #f8fafc;
            text-align: center;
            padding: 20px;
            font-size: 13px;
            color: #718096;
            border-top: 1px solid #edf2f7;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Terima Kasih, {{ $order->customer_name }}!</h2>
        </div>
        
        <div class="content">
            <p class="greeting">Pesanan Anda <strong>#{{ $order->code }}</strong> telah berhasil dibuat. Untuk memproses pesanan, silakan selesaikan pembayaran Anda.</p>

            <div class="payment-box">
                <h3>Instruksi Pembayaran</h3>
                <p><strong>Total Tagihan:</strong> Rp {{ number_format($order->total, 0, ',', '.') }}</p>
                <p><strong>Metode Pembayaran:</strong> {{ strtoupper($order->payment_payload['Channel']) }}</p>
                
                @if($order->ipaymu_payment_no)
                    <p><strong>Kode / VA Number:</strong> <span style="font-size: 18px; font-family: monospace; letter-spacing: 1px; color: #2d3748; font-weight: bold;">{{ $order->ipaymu_payment_no }}</span></p>
                @endif
                
                <p><strong>Batas Waktu:</strong> <span class="highlight-text">{{ \Carbon\Carbon::parse($order->payment_payload['Expired'])->format('d-m-Y H:i:s') }}</span></p>
            </div>

            <h3 class="section-title">Ringkasan Pesanan</h3>
            <table>
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th>Qty</th>
                        <th>Harga</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>{{ $item->name }}</td>
                        <td>{{ $item->qty }}</td>
                        <td>Rp {{ number_format($item->price, 0, ',', '.') }}</td>
                        <td>Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right;">Subtotal</td>
                        <td>Rp {{ number_format($order->subtotal, 0, ',', '.') }}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right;">Ongkos Kirim ({{ strtoupper($order->shipping_code) }})</td>
                        <td>Rp {{ number_format($order->shipping_fee, 0, ',', '.') }}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right;">Biaya Layanan</td>
                        <td>Rp {{ number_format($order->payment_fee, 0, ',', '.') }}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right; font-size: 16px;">Total Keseluruhan</td>
                        <td class="grand-total">Rp {{ number_format($order->total, 0, ',', '.') }}</td>
                    </tr>
                </tbody>
            </table>

            <h3 class="section-title">Alamat Pengiriman</h3>
            <div class="address-box">
                {{ $order->shipping_address['address'] }}<br>
                {{ $order->shipping_address['district'] }}, {{ $order->shipping_address['city'] }}<br>
                {{ $order->shipping_address['province'] }} - {{ $order->shipping_address['postal'] }}
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} Infinity Game. Semua hak dilindungi.</p>
        </div>
    </div>
</body>
</html>