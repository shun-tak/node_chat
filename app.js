
/**
 * Module dependencies.
 */

var log = console.log;

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

require('date-utils');

var model = require('./model');
var Post = model.Post;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  log('connected');
 
  socket.on('first', function () {
    var query = Post.find().limit(50);
    query.exec(function(err, posts) {
      if (err) {
        log(err);
      } else {
        for (var i = 0; i < posts.length; i++) {
          socket.emit('msg push', posts[i]);
        }
      }
    });
  });

  socket.on('msg send', function (data) {
    if (data && data.text != ''  && typeof data.text === 'string') {
      if (data.name == '') {
        data.name = 'anonymous';
      }
      var date = new Date();
      data.date = '' + date.toFormat("YYYY-MM-D HH24:MI:SS");

      var newPost = new Post(data);
      newPost.save(function(err) {
        if (err) {
          log(err);
        }
      });
      socket.emit('msg push', data);
      socket.broadcast.emit('msg push', data);
    }
  });

  socket.on('disconnect', function() {
    log('disconnected');
  });
});
