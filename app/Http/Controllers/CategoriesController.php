<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Categories;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
    public function index()
    {
        $categories = Categories::All();
        return Inertia::render('categories/index', [
            'categories' => $categories,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100'
        ]);
        Categories::create([
            ...$validated
        ]);
        return redirect()->route('kategori.index')->with('success', 'Kategori Berhasil Ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Categories $kategori)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100'
        ]);
        
        $kategori->update($validated);
        
        return redirect()->route('kategori.index')->with('success', 'Kategori Berhasil Diperbaharui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categories $kategori)
    {
        $kategori->delete();
        return redirect()->route('kategori.index')->with('success', 'Kategori Berhasil Dihapus');
    }
}