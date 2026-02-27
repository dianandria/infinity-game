<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactMessage;
use Inertia\Inertia;

class AdminContactController extends Controller
{
    public function index()
    {
        $contacts = ContactMessage::orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('Contact/Index', [
            'contacts' => $contacts,
        ]);
    }
}
