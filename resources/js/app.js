require('./bootstrap');

let onlineUsers = 0;

function update_online_counter() {
    document.getElementById('online').textContent = '' + onlineUsers;
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
