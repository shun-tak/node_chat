window.onload = function() {
  logDiv = $("#log");
}

var logDiv;
var log = function() { console.log(arguments); }
var socket = new io.connect('/');

socket.on('connect', function() {
  log('connected');
//  socket.emit('msg send', 'data');
  socket.on('msg push', function(msg) {
    log(msg);
    logDiv.prepend('<li>' + msg + '</li>');
  });
});

function ping() {
  var text = document.getElementById("text").value;
  socket.emit('msg send', text);
}
