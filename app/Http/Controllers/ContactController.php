<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactStoreRequest;
use App\Models\ContactMessage;
use App\Models\Slider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function create(Request $request)
    {
        $sliders = Slider::where('is_active', true)
            ->where('placement', 'contact')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('Shop/Contact/Index', [
            'sliders' => $sliders,
            'status' => session('status'),
        ]);
    }

    public function store(ContactStoreRequest $request)
    {
        $data = $request->validated();

        ContactMessage::create([
            ...$data,
            'ip_address' => $request->ip(),
        ]);

        // TODO: kalau mau kirim email, nanti bisa tambahin di sini:
        // Mail::to(config('mail.from.address'))->send(new ContactMessageMail($data));

        return redirect()
            ->route('contact.create')
            ->with('status', 'Thank you, your message has been sent.');
    }
}
