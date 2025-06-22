<?php

namespace App\Http\Controllers;

use App\Models\Items;
use App\Models\Transaction;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Total transactions (all time, default to 0 if no transactions)
        $totalIn = Transaction::where('type', 'in')->sum('total') ?? 0;
        $totalOut = Transaction::where('type', 'out')->sum('total') ?? 0;

        // Total items
        $totalItems = Items::count();

        $response = [
            'transactionData' => [
                'totalIn' => (float) $totalIn,
                'totalOut' => (float) $totalOut,
                'totalItems' => (int) $totalItems,
            ],
        ];


        return Inertia::render('admindashboard', $response);
    }
}