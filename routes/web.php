<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::redirect('/', 'dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', UserController::class);
    Route::post('/users/{users}/avatar', [ProfileController::class, 'updateAvatar'])->name('user.update_avatar');
    Route::resource('roles', RoleController::class)->middleware('can:view roles');
    Route::resource('permissions', PermissionController::class)->middleware('can:view permissions');
    Route::resource('offices', OfficeController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
