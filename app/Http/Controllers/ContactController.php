<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactStoreRequest;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('Shop/Contact/Index', [
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
