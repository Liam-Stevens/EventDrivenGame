//Express
var app = require('express')();
var cors = require('cors');
app.use(cors());

//Socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);
http.listen(3000,()=>console.log('Server listening on port 3000'));

//RXJS
var rxjs = require('rxjs');
rxjs.operators = require('rxjs/operators');

//Initial variables
var connected_players = [];
var bootLock = false;
var endTurns = 0;
var turns = 0;

//Listen for incoming connections
rxjs.fromEvent(io,'connection')
.subscribe(function(client) {
    //Connection Refused due to exceeding player limit
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
        //Start the game
        if (connected_players.length >= 2)
        {
            var randomNum = Math.round(Math.random());
            connected_players[0].emit('data', JSON.stringify({player: randomNum}));
            connected_players[1].emit('data', JSON.stringify({player: 1-randomNum}));
            io.emit('data', JSON.stringify({ready: "true"}));
            turns = 0;
        }
    }
    
    //Client Disconnected
    rxjs.fromEvent(client,'disconnect')
    .subscribe(function() {
        //Locked diconnect due to mass diconnection
        if (bootLock == false)
        {
            console.log("Client " + connected_players.length + " Disconnected");
            //Remove the player from the active player list
            let index = connected_players.indexOf(client);
            if (index > -1) {
                connected_players.splice(index, 1);
            }
            //Return remaining players to the wait screen
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
    
    //Recieve movement data from a player
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
    
    //Recieve victory data
    input.pipe(rxjs.operators.filter(function(data)
    {
        return (data.victor != null)
    }))
    .subscribe(function(data) {
        let index = connected_players.indexOf(client);
        //Only let one instance run
        if (index > -1 && bootLock == false)
        {
            var sendTo = 1-index;
            
            bootLock = true;
            //Player indicated they won
            if (data.victor == "true")
            {
                connected_players[index].emit('data', JSON.stringify({victor: "true"}));
                connected_players[sendTo].emit('data', JSON.stringify({victor: "false"}));
                //Disconnect all players
                connected_players.forEach( player => {
                    player.disconnect()
                });
                connected_players = [];
                console.log("Player " + (index+1) + " Won");
            }
            //Player indicated they lost
            else if (data.victor == "false")
            {
                connected_players[index].emit('data', JSON.stringify({victor: "false"}));
                connected_players[sendTo].emit('data', JSON.stringify({victor: "true"}));
                //Disconnect all players
                connected_players.forEach( player => {
                    player.disconnect()
                });
                connected_players = [];
                console.log("Player " + (sendTo+1) + " Won");
            }
            bootLock = false;
            
        }
    });
    
    //End turn data
    input.pipe(rxjs.operators.filter(function(data)
    {
        return (data.turn != null)
    }))
    .subscribe(function(data) {
        if (data.turn == "end")
        {
            console.log("Player " + (connected_players.indexOf(client)+1) + ": TURN ENDED");
            endTurns++;
            //If two player have ended their turn, progress to the next turn
            if (endTurns >= 2)
            {
                //Tell players the next turn is starting (timeout is to allow the last player to process the end of turn)
                setTimeout(() => {  io.emit('data', JSON.stringify({turn: "reset"})); }, 200);
                endTurns = 0;
                turns++;
                console.log("Turn " + turns + " Ended");
                //If the number of turns has exceeded the turn limit, end the game
                if (turns >= 20)
                {
                    setTimeout(() => {  io.emit('data', JSON.stringify({victor: "time"})); }, 200);
                    turns = 0;
                }
            }
        }
    });
});
