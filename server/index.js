let app = require('express')();

let cors = require('cors');
app.use(cors());

let http = require('http').Server(app);
let io = require('socket.io')(http);

http.listen(3000,()=>console.log('Server listening on port 3000'));

var rxjs = require('rxjs');
rxjs.operators = require('rxjs/operators');

let connected_observables = [];
let main_observable = null;

rxjs.fromEvent(io,'connection')
  .subscribe(function(client) {
    console.log("Client Connected");
    client.emit('data', JSON.stringify({connected: "true"}));
    //connected_observables.push(client_obs);
    
    rxjs.fromEvent(client,'disconnect')
      .subscribe(function() {
        console.log("Client Disconnected")
      });
  });
