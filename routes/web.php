<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AdminDashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->middleware('user')
        ->name('dashboard');
    Route::get('admindashboard', [AdminDashboardController::class, 'index'])
        ->middleware('admin')
        ->name('admindashboard');
    Route::get('pengguna', [UserController::class, 'index'])->middleware('admin')->name('pengguna');
    
    Route::resource('kategori', CategoriesController::class)->middleware('admin');
    Route::resource('barang', ItemsController::class)->middleware('admin');
    Route::resource('transaksi', TransactionController::class)->middleware('admin');
    Route::resource('checkout', CheckoutController::class)->middleware('user');
    
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';