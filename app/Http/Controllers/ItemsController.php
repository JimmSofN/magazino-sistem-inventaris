<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Items;
use App\Models\Categories;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class ItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Items::with('category')
        ->whereHas('category')
        ->orderBy('created_at', 'desc');

        if (request()->has('search')) {
            $search = request('search');
            $query->where(function($q) use ($search) {
                $q->whereRaw('name ILIKE ?', ['%' . $search . '%'])
                ->orWhereRaw('description ILIKE ?', ['%' . $search . '%'])
                ->orWhereRaw('item_code ILIKE ?', ['%' . $search . '%']);
            });
        }

        if (request()->has('filter') && request('filter') && request('filter') !== 'all') {
            $categoryId = request('filter');
            $query->where('category_id', $categoryId);
        }

        $items = $query->paginate(10);
        $categories = Categories::select('id', 'name')->get();

        return Inertia::render('items/index', [
            'items' => $items,
            'categories' => $categories,
            'filters' => [
                'search' => request('search', ''),
                'filter' => request('filter', ''),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Categories::select('id', 'name')->get();

        return Inertia::render('items/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|max:100',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:20',
        ]);

        // Fetch category name
        $category = Categories::findOrFail($validated['category_id']);
        $categoryName = strtolower($category->name);

        // Generate prefix from category name
        $prefix = '';
        $length = strlen($categoryName);
        $i = 0;
        $takeNextVowel = true; // Start with consonant

        while ($i < $length && strlen($prefix) < 5) {
            $char = $categoryName[$i];
            $isVowel = in_array($char, ['a', 'e', 'i', 'o', 'u']);
            $isConsonant = !$isVowel && ctype_alpha($char);

            if ($takeNextVowel && $isVowel) {
                $prefix .= $char;
                $takeNextVowel = false;
            } elseif (!$takeNextVowel && $isConsonant) {
                // Handle special case for 'ng' in "Daging"
                if ($char === 'n' && $i + 1 < $length && $categoryName[$i + 1] === 'g') {
                    $prefix .= 'ng';
                    $i++;
                } else {
                    $prefix .= $char;
                }
                $takeNextVowel = true;
            }

            $i++;
        }

        // Generate item_code: prefix-<random-10-chars>
        $validated['item_code'] = $prefix . '-' . strtolower(Str::random(10));

        Items::create($validated);
        
        return redirect()->route('barang.index')->with('success', 'Barang berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Items $barang)
    {
         return Inertia::render('items/show', [
            'item' => $barang->load('category')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Items $barang)
    {
        return Inertia::render('items/edit', [
            'item' => $barang->load('category'),
            'categories' => Categories::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Items $barang)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|max:100',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:20',
        ]);

        $barang->update($validated);

        return redirect()->route('barang.index')->with('success', 'Barang berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Items $barang)
    {
        $barang->delete();

        return redirect()->route('barang.index')->with('success', 'Barang berhasil dihapus.');
    }
}