<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #4a5568; 
            background-color: #f7fafc; 
            margin: 0; 
            padding: 20px; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 8px; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); 
            overflow: hidden; 
        }
        .header { 
            background-color: #2b6cb0; 
            color: #ffffff; 
            padding: 20px; 
            text-align: center; 
        }
        .header h2 { 
            margin: 0; 
            font-size: 24px; 
        }
        .content { 
            padding: 30px; 
        }
        .section-title { 
            font-size: 18px; 
            color: #2d3748; 
            border-bottom: 2px solid #e2e8f0; 
            padding-bottom: 8px; 
            margin-bottom: 15px; 
            margin-top: 25px; 
        }
        .customer-info { 
            background-color: #f8fafc; 
            border-left: 4px solid #4299e1; 
            padding: 15px; 
            border-radius: 4px; 
            margin-bottom: 20px; 
        }
        .customer-info p { 
            margin: 5px 0; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px; 
        }
        th { 
            background-color: #edf2f7; 
            color: #4a5568; 
            font-weight: 600; 
            text-transform: uppercase; 
            font-size: 13px; 
            padding: 12px;
            text-align: left;
        }
        td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #e2e8f0; 
        }
        .summary-box { 
            margin-top: 30px; 
            background-color: #ebf8ff; 
            padding: 20px; 
            border-radius: 6px; 
            text-align: right; 
        }
        .summary-box p { 
            margin: 8px 0; 
            font-size: 16px; 
        }
        .total-value { 
            font-size: 20px; 
            font-weight: bold; 
            color: #2b6cb0; 
        }
        .status-badge { 
            display: inline-block; 
            background-color: #c6f6d5; 
            color: #22543d; 
            padding: 4px 12px; 
            border-radius: 12px; 
            font-size: 14px; 
            font-weight: bold; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Pesanan Baru: {{ $order->code }}</h2>
        </div>
        
        <div class="content">
            <div class="customer-info">
                <p><strong>Detail Pelanggan:</strong></p>
                <p>👤 <strong>Nama:</strong> {{ $order->customer_name }}</p>
                <p>✉️ <strong>Email:</strong> {{ $order->customer_email }}</p>
                <p>📞 <strong>Nomor Telepon:</strong> {{ $order->customer_phone ?? 'Tidak tersedia' }}</p>
            </div>

            <h3 class="section-title">Produk yang Dipesan</h3>
            <table>
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th>Jumlah</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>{{ $item->name }}</td>
                        <td>{{ $item->qty }}</td>
                        <td>Rp {{ number_format($item->subtotal, 0, ',', '.') }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="summary-box">
                <p><strong>Status Pesanan:</strong> <span class="status-badge">{{ ucfirst($order->status) }}</span></p>
                <p class="total-value">Total Tagihan: Rp {{ number_format($order->total, 0, ',', '.') }}</p>
            </div>
        </div>
    </div>
</body>
</html>