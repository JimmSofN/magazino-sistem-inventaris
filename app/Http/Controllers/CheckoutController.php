<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Items;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Models\Categories;
use App\Models\TransactionDetail;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
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
            ->where('type', 'out')
            ->where('user_id', auth()->id())
            ->where('transaction_date', $formattedDate);

        $transactions = $query->paginate(10)->appends(['date' => $date]);

        return Inertia::render('checkouts/index', [
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

    public function create(Request $request)
    {
        $query = Items::with('category')
            ->whereHas('category')
            ->where('stock', '>', 0)
            ->orderBy('name');

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereRaw('name ILIKE ?', ['%' . $search . '%'])
                ->orWhereRaw('description ILIKE ?', ['%' . $search . '%']);
            });
        }

        if ($request->has('category') && $request->category && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }

        $items = $query->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'stock' => $item->stock,
                'price' => floatval($item->price),
                'unit' => $item->unit,
                'category' => $item->category->name,
            ];
        });

        $categories = Categories::select('id', 'name')->get();

        // Use old input for selected items (e.g., after validation failure)
        $selectedItems = $request->old('items', []);

        return Inertia::render('checkouts/create', [
            'items' => $items,
            'categories' => $categories,
            'selectedItems' => $selectedItems,
            'filters' => [
                'search' => $request->search ?? '',
                'category' => $request->category ?? 'all',
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                // Validate stock availability
                foreach ($validated['items'] as $item) {
                    $itemModel = Items::find($item['id']);
                    if (!$itemModel) {
                        throw new \Exception("Barang dengan ID {$item['id']} tidak ditemukan");
                    }
                    if ($itemModel->stock < $item['quantity']) {
                        throw new \Exception("Stok {$itemModel->name} tidak mencukupi. Stok tersedia: {$itemModel->stock}");
                    }
                }

                // Create transaction
                Carbon::setLocale('id_ID');
                $now = Carbon::now();
                $transaction = Transaction::create([
                    'transaction_code' => 'trx-' . time(),
                    'type' => 'out',
                    'transaction_date' => $this->formatIndonesianDate($now),
                    'transaction_time' => $now->format('H:i'),
                    'user_id' => auth()->id(),
                    'notes' => $validated['notes'],
                    'total' => 0.00, // Initial value
                ]);

                // Create transaction details, update stock, and calculate total
                $total = 0;
                foreach ($validated['items'] as $item) {
                    $itemModel = Items::find($item['id']);
                    $price = $itemModel->price;
                    $subtotal = $item['quantity'] * $price;
                    TransactionDetail::create([
                        'transaction_id' => $transaction->id,
                        'item_id' => $item['id'],
                        'item_name' => $itemModel->name, 
                        'item_unit' => $itemModel->unit, 
                        'price' => $price,
                        'quantity' => $item['quantity'],
                        'subtotal' => $subtotal,
                    ]);
                    $total += $subtotal;
                    $itemModel->decrement('stock', $item['quantity']);
                }

                // Update total in transactions table
                $transaction->update(['total' => $total]);

                return redirect()->route('checkout.index')->with('success', 'Checkout berhasil dilakukan');
            });
        } catch (\Exception $e) {
            return back()->with([
                'flash' => ['error' => $e->getMessage()],
                'old' => $request->input(),
            ]);
        }
    }

    public function show(Transaction $checkout)
    {
        $checkout->load(['user', 'details.item']);
        \Log::info('Checkout Show', ['transaction' => $checkout->toArray()]);
        return Inertia::render('checkouts/show', [
            'transaction' => $checkout,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
}