window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

try {
    window.Popper = require('popper.js').default;
    window.$      = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {
}

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo'

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster:       'pusher',
    key:               window.PUSHER_APP_KEY,
    wsHost:            window.location.hostname,
    wsPort:            window.APP_DEBUG ? 6001 : 6000,
    wssPort:           window.APP_DEBUG ? 6001 : 6000,
    disableStats:      true,
    encrypted:         !window.APP_DEBUG,
    enabledTransports: ['ws', 'wss'],
});

var onlineUsers = 0;

function update_online_counter() {
    jQuery('#online').text(onlineUsers);
}

window.Echo.join('common_room')
    .here((users) => {
        onlineUsers = users.length;

        update_online_counter();
    })
    .joining((user) => {
        onlineUsers++;

        update_online_counter();
    })
    .leaving((user) => {
        onlineUsers--;

        update_online_counter();
    });
