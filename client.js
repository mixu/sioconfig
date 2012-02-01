var http = require('http'),
    https = require('https'),
    WebSocket = require('ws');

var isSecure = (process.argv.indexOf('https') > -1);
var httpName = (isSecure ? 'HTTPS' : 'HTTP');
var wsName = (isSecure ? 'WSS' : 'WS');

console.log('Testing ' + httpName + ' request');

(isSecure ? https : http).get({ path: '/index.html' }, function(response) {
  var res_data = '';
  response.on('data', function(chunk) {
    res_data += chunk;
  });
  response.on('end', function() {
    console.log('Received ' + httpName + ' response:', res_data);

    console.log('Testing ' + wsName +' request');

    var messages = [ 'a', 'b', 'c', 'd', 'e'];

    var ws = new WebSocket(
        (isSecure ? 'wss' : 'ws')
        + '://localhost:'+
        (isSecure ? '443' : '80')
        +'/socket.io');
    ws.on('open', function() {
      messages.forEach(function(message){
        ws.send(message);
      });
    });
    ws.on('message', function(message, flags) {
      console.log('Received ' + wsName + ' message', message);

      messages = messages.filter(function(item) {
        return item != message;
      });

      if (messages.length == 0) {
        console.log('Successfully sent and received 5 messages.');
        console.log('Now waiting 5 seconds and sending a last '+wsName+' message.');
        setTimeout(function() {
          ws.removeAllListeners('message');
          ws.on('message', function() {
            console.log('It worked.');
            ws.close();
          });
          ws.send('final');
        }, 5000);
      }
    });
  });
});



