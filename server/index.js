let app = require('express')();

let cors = require('cors');
app.use(cors());

let http = require('http').Server(app);
let io = require('socket.io')(http);

http.listen(3000,()=>console.log('Server listening on port 3000'));

var rxjs = require('rxjs');
rxjs.operators = require('rxjs/operators');

let connected_players = [];
var bootLock = false;

rxjs.fromEvent(io,'connection')
.subscribe(function(client) {
    //Connection Refused
    if (connected_players.length >= 2)
    {
        client.emit('data', JSON.stringify({connected: "false"}));
        console.log("Client Refused Connection");
        client.disconnect();
    }
    //Connection Accepted
    else
    {
        client.emit('data', JSON.stringify({connected: "true"}));
        connected_players.push(client);
        console.log("Client " + connected_players.length + " Connected");
        if (connected_players.length >= 2)
        {
            var randomNum = Math.round(Math.random());
            connected_players[0].emit('data', JSON.stringify({player: randomNum}))
            connected_players[1].emit('data', JSON.stringify({player: 1-randomNum}))
            io.emit('data', JSON.stringify({ready: "true"}))
        }
    }
    
    //Client Disconnected
    rxjs.fromEvent(client,'disconnect')
    .subscribe(function() {
        if (bootLock == false)
        {
            console.log("Client " + connected_players.length + " Disconnected");
            let index = connected_players.indexOf(client);
            if (index > -1) {
            connected_players.splice(index, 1);
            }
            if (connected_players.length == 1)
            {
                io.emit('data', JSON.stringify({connected: "true"}));
            }
        }
    });
    
    //Data from player
    var input = rxjs.fromEvent(client, 'data').pipe(rxjs.operators.map(function (data)
    {
        return JSON.parse(data);
    }));
    
    input.pipe(rxjs.operators.filter(function(data)
    {
        return (data.move != null)
    }),rxjs.operators.map(function (data)
    {
        return data.move;
    }))
    .subscribe(function(data) {
        //Send to opposing player
        let index = connected_players.indexOf(client);
        if (index > -1) {
            var sendTo = 1-index;
            connected_players[sendTo].emit('data', JSON.stringify({move: data}));
            console.log("Player " + (index+1) + " -> Player " + (sendTo+1) + ": " + data);
        }
    });
    
    input.pipe(rxjs.operators.filter(function(data)
    {
        return (data.victor != null)
    }))
    .subscribe(function(data) {
        let index = connected_players.indexOf(client);
        if (index > -1 && bootLock == false)
        {
            var sendTo = 1-index;
            
            bootLock = true;
            if (data.victor == "true")
            {
                connected_players[index].emit('data', JSON.stringify({victor: "true"}));
                connected_players[sendTo].emit('data', JSON.stringify({victor: "false"}));
                connected_players.forEach( player => {
                    player.disconnect()
                });
                connected_players = [];
                console.log("Player " + (index+1) + " Won");
            }
            else if (data.victor == "false")
            {
                connected_players[index].emit('data', JSON.stringify({victor: "false"}));
                connected_players[sendTo].emit('data', JSON.stringify({victor: "true"}));
                connected_players.forEach( player => {
                    player.disconnect()
                });
                connected_players = [];
                console.log("Player " + (index+1) + " Won");
            }
            bootLock = false;
            
        }
    });
});
