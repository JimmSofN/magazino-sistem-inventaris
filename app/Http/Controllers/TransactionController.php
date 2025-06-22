<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Items;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Models\TransactionDetail;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Format date with Indonesian month names
     */
    private function formatIndonesianDate($date)
    {
        $months = [
            1 => 'Januari',
            2 => 'Februari',
            3 => 'Maret',
            4 => 'April',
            5 => 'Mei',
            6 => 'Juni',
            7 => 'Juli',
            8 => 'Agustus',
            9 => 'September',
            10 => 'Oktober',
            11 => 'November',
            12 => 'Desember',
        ];

        return $date->format('d, ') . $months[$date->month] . $date->format(' Y');
    }

    public function index(Request $request)
    {
        Carbon::setLocale('id_ID');
        $date = $request->query('date', Carbon::today()->format('Y-m-d'));
        $formattedDate = $this->formatIndonesianDate(Carbon::parse($date));

        $query = Transaction::with(['user', 'details.item'])
            ->where('transaction_date', $formattedDate);

        $transactions = $query->paginate(10)->appends(['date' => $date]);

        return Inertia::render('transactions/index', [
            'transactions' => $transactions,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'filters' => [
                'date' => $date,
            ],
        ]);
    }

    public function create()
    {
        $items = Items::select('id', 'name', 'stock', 'price', 'unit')->get();
        return Inertia::render('transactions/create', [
            'items' => $items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'stock' => $item->stock,
                    'price' => floatval($item->price),
                    'unit' => $item->unit,
                ];
            })->toArray(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:in,out',
            'notes' => 'nullable|string|max:255',
            'details' => 'required|array|min:1',
            'details.*.item_id' => 'required|exists:items,id',
            'details.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                if ($validated['type'] === 'out') {
                    foreach ($validated['details'] as $detail) {
                        $item = Items::find($detail['item_id']);
                        if (!$item) {
                            throw new \Exception("Barang dengan ID {$detail['item_id']} tidak ditemukan");
                        }
                        if ($item->stock < $detail['quantity']) {
                            throw new \Exception("Stok {$item->name} tidak mencukupi. Stok tersedia: {$item->stock}");
                        }
                    }
                }

                Carbon::setLocale('id_ID');
                $now = Carbon::now();
                $transaction = Transaction::create([
                    'transaction_code' => 'trx-' . time(),
                    'type' => $validated['type'],
                    'transaction_date' => $this->formatIndonesianDate($now),
                    'transaction_time' => $now->format('H:i'),
                    'user_id' => auth()->id(),
                    'notes' => $validated['notes'],
                    'total' => 0.00, // Initial value
                ]);

                $total = 0;
                foreach ($validated['details'] as $detail) {
                    $item = Items::find($detail['item_id']);
                    $price = $item->price;
                    $subtotal = $detail['quantity'] * $price;
                    TransactionDetail::create([
                        'transaction_id' => $transaction->id,
                        'item_id' => $detail['item_id'],
                        'item_name' => $item->name,
                        'item_unit' => $item->unit,
                        'price' => $price,
                        'quantity' => $detail['quantity'],
                        'subtotal' => $subtotal,
                    ]);
                    $total += $subtotal;

                    if ($validated['type'] === 'in') {
                        $item->increment('stock', $detail['quantity']);
                    } else {
                        $item->decrement('stock', $detail['quantity']);
                    }
                }

                // Update total in transactions table
                $transaction->update(['total' => $total]);

                return redirect()->route('transaksi.index')->with('success', 'Transaksi berhasil ditambahkan');
            });
        } catch (\Exception $e) {
            return back()->with([
                'flash' => ['error' => $e->getMessage()],
                'old' => $request->input(),
            ]);
        }
    }

    public function show(Transaction $transaksi)
    {
        $transaksi->load(['user', 'details.item']);
        \Log::info('Transaction Show', ['transaction' => $transaksi->toArray()]);
        return Inertia::render('transactions/show', [
            'transaction' => $transaksi,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
}