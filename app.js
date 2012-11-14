var express = require('express')
  , list = require('./routes/list')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/list', list.index);
app.get('/list/:listId', list.detail);

app.post('/list', list.add);
app.put('/list/:listId', list.save);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Node Notes - port " + app.get('port'));
});
