<?php 
namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderCreatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $type = 'customer'
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->type === 'admin' 
            ? "New Order Received: {$this->order->code}" 
            : "Order Confirmation & Payment Instructions: {$this->order->code}";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        $view = $this->type === 'admin' 
            ? 'emails.orders.admin' 
            : 'emails.orders.customer';

        return new Content(view: $view);
    }
}