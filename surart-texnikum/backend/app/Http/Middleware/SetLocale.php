<?php

namespace App\Http\Middleware;

use App;
use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $lang = in_array($request->get('lang'), ['uz', 'en']) ? $request->get('lang') : 'uz';
        App::setLocale($lang);

        return $next($request);
    }
}
