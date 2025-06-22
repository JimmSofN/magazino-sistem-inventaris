<?php

namespace App\Http\Controllers;

use App\Models\Items;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $itemsCount = Items::count();
        $username = auth()->user()->name;

        return Inertia::render('dashboard', [
            'itemsCount' => $itemsCount,
            'username' => $username,
        ]);
    }
}