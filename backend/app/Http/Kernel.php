protected $middlewareGroups = [
    'api' => [
        \Fruitcake\Cors\HandleCors::class,  // ← must be here
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
