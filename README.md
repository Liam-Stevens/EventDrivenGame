# Tag - Event Driven Computing App Development Project

## About

The application is a turn based, real-time movement game of tag where the chaser (blue)
needs to catch the runner (pink) within 20 turns. If the chaser cannot catch the runner
in 20 turns, the game will end with the runner as the victor. Each turn has a time limit 
of 20 seconds which when it exceeds this time, the turn is ended automatically.

Players has a limit to the number of times they can move each turn, and a limit to the amount 
they are able to see around them. By default players can only move 10 spaces per turn and they 
can only see in a 5 tile radius. This is can increased (or decreased) using powerups.

There are two kinds of powerups on the map, one which affects the movement of the chaser (yellow)
and one which affects the vision of the runner (green). If the chaser picks up the movement powerup
they will have their stamina increased by 5. If the runner picks up the movement powerup, the chaser
will have their stamina reduced by 5. If the runner picks up the vision powerup, they will have
the map revealed to them. If the chaser picks up the vision powerup, the runner will have their
vision reduced to 1 tile in radius. All powerups will last for 3 turns, unless they are extended
by picking up another of it's type or overridden by the opponent picking up the same type. 
If two of the same powerup are picked up at on the same turn, the effects will be cancelled.

## Build Instructions

### Server

Path to the `/server` folder

Start the server with `npm start` or `Node index.js`

The server should be running on port `3000`

### Client

Path to the `/client` folder

Build the Cordova app with `cordova build android`

Run the Cordova app with `cordova run android`

Connect to the server by typeing in the address. 
Note: must include `http://` at the start and the port `:3000` at the end. 

## Repository

This project's repository can be found at `https://github.cs.adelaide.edu.au/a1742143/edcApp`