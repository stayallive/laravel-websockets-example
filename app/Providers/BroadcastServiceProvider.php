<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Contracts\Broadcasting\Factory;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Broadcast::routes();

        // This is an workaround to allow for a public precense channel, please ignore this :)
        Route::post('/broadcasting/auth', function (Request $request) {
            if ($request->channel_name === 'presence-common_room') {
                /** @var \Pusher\Pusher $pusher */
                $pusher = app(Factory::class)->driver()->getPusher();

                $response = $pusher->presence_auth(
                    $request->channel_name, $request->socket_id,
                    $userId = str_random(16), ['id' => $userId]
                );

                if (!$request->input('callback', false)) {
                    return json_decode($response, true);
                }

                return response()->json(json_decode($response, true))
                                 ->withCallback($request->callback);
            }

            return abort(403);
        });

        require base_path('routes/channels.php');
    }
}
