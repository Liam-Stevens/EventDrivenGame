let app = require('express')();

let cors = require('cors');
app.use(cors());

let http = require('http').Server(app);
let io = require('socket.io')(http);

http.listen(3000,()=>console.log('Server listening on port 3000'));

var rxjs = require('rxjs');
rxjs.operators = require('rxjs/operators');

let connected_players = [];
let main_observable = null;
var connections = 0;


/*
  client.emit - talk to single client
  broadcast.emit - talk to all but the single client
  io.emit - talk to all clients
*/
rxjs.fromEvent(io,'connection')
  .subscribe(function(client) {
    //Connection Refused
    if (connections >= 2)
    {
      client.emit('data', JSON.stringify({connected: "false"}));
      console.log("Client Refused Connection");
      client.disconnect();
    }
    //Connection Accepted
    else
    {
      client.emit('data', JSON.stringify({connected: "true"}));
      connections++;
      console.log("Client " + connections + " Connected");
      if (connections >= 2)
      {
        io.emit('data', JSON.stringify({ready: "true"}))
      }
    }
    
    //Client Disconnected
    rxjs.fromEvent(client,'disconnect')
      .subscribe(function() {
        console.log("Client " + connections + " Disconnected");
        io.emit('data', JSON.stringify({connected: "true"}));
        connections--;
      });
  });
