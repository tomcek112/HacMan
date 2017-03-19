$(document).ready(function(){
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/p2');
    socket.on('mov', function(msg) {
        console.log('<p>Received: ' + msg.data + '</p>');
    });
        socket.emit('keydown p1', {data: "l"});

    $('form#broadcast').submit(function(event) {
        socket.emit('my broadcast event', {data: $('#broadcast_data').val()});
        return false;
    });
});