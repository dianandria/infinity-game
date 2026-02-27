<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IpaymuWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // iPaymu bisa kirim ulang callback >1x kalau dia tidak dapat HTTP 200
        // Jadi wajib idempotent (cek status sekarang sebelum update).

        $payload = $request->all();

        Log::info('Ipaymu callback received', $payload);

        $trxId       = $request->input('trx_id');        // TransactionId iPaymu
        $status      = $request->input('status');        // pending|berhasil|expired
        $statusCode  = (int) $request->input('status_code'); // 0,1,-2
        $referenceId = $request->input('reference_id');  // kita isi = order->id

        if (! $referenceId) {
            Log::warning('Ipaymu callback without reference_id', $payload);
            return response('No reference_id', 400);
        }

        /** @var Order|null $order */
        $order = Order::find($referenceId);

        if (! $order) {
            Log::warning('Ipaymu callback order not found', [
                'reference_id' => $referenceId,
            ]);

            // Balas 200 supaya iPaymu tidak spam callback, tapi kita catat errornya
            return response('Order not found', 200);
        }

        // Kalau order sudah paid / cancelled jangan diapa-apakan lagi (idempotent)
        if (in_array($order->status, ['paid', 'failed', 'expired', 'cancelled'])) {
            Log::info('Ipaymu callback ignored because order already finalized', [
                'order_id'    => $order->id,
                'orderStatus' => $order->status,
            ]);

            return response('Already processed', 200);
        }

        // Map status_code dari iPaymu ke status di sistem kita
        switch ($statusCode) {
            case 1: // berhasil
                $order->status        = 'paid';
                $order->paid_at       = now();
                $order->payment_ref   = $trxId; // atau PaymentNo, terserah desain kamu
                $order->save();
                break;

            case -2: // expired
                $order->status = 'expired';
                $order->save();
                break;

            case 0: // pending
            default:
                // biasanya tidak perlu apa-apa, tapi kalau mau simpan raw status juga boleh
                $order->status = 'pending';
                $order->save();
                break;
        }

        // (opsional) simpan payload callback terakhir ke kolom JSON
        if ($order->isFillable('payment_payload')) {
            $order->payment_payload = array_merge(
                (array) $order->payment_payload,
                ['last_callback' => $payload]
            );
            $order->save();
        }

        // WAJIB balas 200 supaya iPaymu berhenti resend
        return response('OK', 200);
    }
}
