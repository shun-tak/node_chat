window.onload = function() {
  logDiv = $("#log");
}

var logDiv;
var socket = new io.connect('/');

socket.on('connect', function() {
//  socket.emit('first');
  socket.on('msg push', function(data) {
    logDiv.prepend('<li>' + data.text
                   + ' -- <span class="name">' + data.name + '</span>'
                   + ' <span class="date">' + data.date + '</span></li>');
  });
});

function ping() {
  var data = {
    'text': $('#text').val(),
    'name': $('#name').val(),
  }
  socket.emit('msg send', data);
}
