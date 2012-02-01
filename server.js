var http = require('http'),
    ws = require('ws');

function ping(req, res) {
  console.log('HTTP request to', req.url);
  res.setHeader('Content-type', 'text/html');
  res.end('PONG. EOM.');
};

http.createServer(ping).listen(3000);

var wss = new ws.Server({port: 8000});

wss.on('connection', function(socket) {
  socket.on('open', function() {
    console.log('ws client connected');
  });
  socket.on('message', function(message) {
    console.log('echoing back ws message', message);
    socket.send(message);
  });
  socket.on('close', function() {
    console.log('ws client disconnected');
  });
});


