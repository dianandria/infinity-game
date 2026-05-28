<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Order extends Model
{
    protected $fillable = [
      'user_id','code','customer_name','customer_email','customer_phone',
      'shipping_address','subtotal','shipping_fee','discount','total',
      'payment_provider','payment_ref','status', 'ipaymu_transaction_id',
      'ipaymu_payment_no', 'payment_payload', 'paid_at', 'payment_fee', 
      'shipping_code', 'shipping_service', 'shipping_awb'
    ];

    protected $casts = [
      'user_id' => 'integer',
      'shipping_address' => 'array',
      'subtotal' => 'integer',
      'shipping_fee' => 'integer',
      'discount' => 'integer',
      'total' => 'integer',
      'payment_payload' => 'array',
      'payment_fee' => 'integer'
    ];

    public function items() { return $this->hasMany(OrderItem::class); }
    public function user()  { return $this->belongsTo(User::class); }

    // Filter query
    public function scopeFilter($q, array $f) {
      return $q
          ->when($f['q'] ?? null, function ($qq, $v) {
              $v = trim($v);
              $qq->where(function($w) use ($v) {
                  $w->where('code', 'like', "%$v%")
                    ->orWhere('customer_name', 'like', "%$v%")
                    ->orWhere('customer_email', 'like', "%$v%")
                    ->orWhere('customer_phone', 'like', "%$v%");
              });
          })
          ->when($f['status'] ?? null, fn($qq,$v)=>$qq->where('status',$v))
          ->when($f['provider'] ?? null, fn($qq,$v)=>$qq->where('payment_provider',$v))
          ->when(($f['date_from'] ?? null) || ($f['date_to'] ?? null), function ($qq) use ($f) {
          if ($f['date_from'] && $f['date_to']) {
              $qq->whereBetween('created_at', [
                  Carbon::parse($f['date_from'])->startOfDay(),
                  Carbon::parse($f['date_to'])->endOfDay(),
              ]);
          } elseif ($f['date_from']) {
              $qq->where('created_at', '>=', Carbon::parse($f['date_from'])->startOfDay());
          } elseif ($f['date_to']) {
              $qq->where('created_at', '<=', Carbon::parse($f['date_to'])->endOfDay());
          }
      });
    }
}
