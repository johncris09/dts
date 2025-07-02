<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => fn() => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'avatar' => $request->user()->avatar,
                    'active' => $request->user()->active,
                    'email' => $request->user()->email,
                    'organizational_unit' => $request->user()->organizationalUnit ? [
                        'id' => $request->user()->organizationalUnit->id,
                        'name' => $request->user()->organizationalUnit->name,
                        'hierarchy_path' => $request->user()->organizationalUnit->getHierarchyPath()->pluck('name')->implode(' > '),
                    ] : null,
                ] : null,
                'permissions' => fn() => $request->user()?->getAllPermissions()->pluck('name') ?? [],
                'roles' => fn() => $request->user()?->roles->pluck('name') ?? [],
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],

            'flash' => function () {
                return [
                    'message' => session('message'),
                    'success' => session('success'),
                    'error' => session('error'),
                    'info' => session('info'),
                    'photo' => session('photo'),
                ];
            },
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
    public function getHierarchyPath()
    {
        $path = collect([$this]);
        $current = $this;

        while ($current->parent) {
            $path->prepend($current->parent);
            $current = $current->parent;
        }

        return $path;
    }
}
