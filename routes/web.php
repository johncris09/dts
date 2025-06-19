<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::redirect('/', 'dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class);

    Route::post('/users/{users}/avatar', [ProfileController::class, 'updateAvatar'])->name('user.update_avatar');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
