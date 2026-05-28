<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
          'q'        => ($q = trim((string) $request->input('q', ''))) !== '' ? $q : null,
          'status'   => $request->filled('status')   ? $request->input('status')   : null,
          'provider' => $request->filled('provider') ? $request->input('provider') : null,
          'date_from'=> ($df = trim((string) $request->input('date_from', ''))) !== '' ? $df : null,
          'date_to'  => ($dt = trim((string) $request->input('date_to',   ''))) !== '' ? $dt : null,
        ];

        $sort = $request->string('sort', 'created_at');
        $dir  = $request->string('dir', 'desc');

        $orders = Order::withCount('items')
          ->filter($filters)
          ->orderBy($sort, $dir)
          ->paginate(15)
          ->withQueryString();

        // ringkasan cepat
        $today = now()->toDateString();
        $summary = [
          'today_total' => Order::whereDate('created_at',$today)->sum('total'),
          'paid'        => Order::where('status','paid')->count(),
          'pending'     => Order::where('status','pending')->count(),
        ];

        return Inertia::render('Orders/Index', [
          'orders'  => $orders,
          'filters' => $filters,
          'sort'    => ['sort'=>$sort, 'dir'=>$dir],
          'summary' => $summary,
        ]);
    }

    public function show(Order $order)
    {
      $order->load(['items.product','user']);
      return Inertia::render('Orders/Show', ['order' => $order]);
    }

    // update status sederhana
    public function updateStatus(Request $request, Order $order)
    {
      $data = $request->validate([
        'status' => 'required|in:pending,paid,failed,cancelled',
      ]);

      $order->update($data);

      return back()->with('success','Order status updated');
    }

    // export CSV sesuai filter
    public function export(Request $request): StreamedResponse
    {
      $filters = $request->only(['q','status','provider','date_from','date_to']);

      $query = Order::filter($filters)->orderBy('created_at','desc');

      $headers = [
        'Content-Type' => 'text/csv',
        'Content-Disposition' => 'attachment; filename="orders_export_'.now()->format('Ymd_His').'.csv"',
      ];

      return response()->stream(function () use ($query) {
        $out = fopen('php://output', 'w');
        fputcsv($out, ['Code','Date','Customer','Email','Phone','Subtotal','Shipping','Discount','Total','Provider','Status']);

        $query->chunk(500, function ($chunk) use ($out) {
          foreach ($chunk as $o) {
            fputcsv($out, [
                $o->code,
                $o->created_at->format('Y-m-d H:i'),
                $o->customer_name,
                $o->customer_email,
                $o->customer_phone,
                $o->subtotal,
                $o->shipping_fee,
                $o->discount,
                $o->total,
                $o->payment_provider,
                $o->status,
            ]);
          }
        });
        fclose($out);
      }, 200, $headers);
    }

    public function updateShipping(Request $request, Order $order)
    {
      $data = $request->validate([
          'shipping_awb'  => ['nullable', 'string', 'max:100'],
      ]);

      $order->update([
          'shipping_awb'  => $data['shipping_awb'] ?? null,
      ]);

      return back()->with('success', 'Nomor resi berhasil disimpan.');
    }
}
