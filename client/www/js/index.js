//Variable which will reference elements on the page
var socket = null;
var canvas = null;
var header = null;
var dispStamina = null;

/*
    Map for play
    0: moveable tile
    1: immoveable tile
    4: movement powerup
    5: vision powerup
    8: chaser
    9: runner
*/
var map = [
    8, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
    0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 1, 0, 0,
    0, 0, 1, 4, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
    0, 0, 0, 0, 0, 1, 5, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0, 0, 1, 0, 0, 1, 0, 0,
    0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9,
];

var initialMap = map.map((x) => x);
var fogMask = null;

var screenHeight = window.innerHeight-window.innerHeight/5;
var screenWidth = window.screen.width;

//Change this to screenWidth for phone - screenHeight for browser
var display = screenWidth;

//Dimensions of the map
var mapWidth = 20, mapHeight = 20;
var tileWidth = display/mapWidth, tileHeight = display/mapHeight;

//Player information
var currentPlayer = 8;
var oppPlayer = 9;
var targetLocation = {x:0,y:0};

//Stamina information
var stamina = 10;
var maxStamina = 10;

//Powerup information
var visionPowFavour = 0;
var visionPowTime = 0;
var visionRange = 5;
var revealAll = false;
var movePowFavour = 0;
var movePowTime = 0;

//Timer information
var timer = 20;
var timerInterval = null;
var turn = 1;

//Setup the initial canvas environment
window.onload = function()
{
    canvas = document.getElementById('tag').getContext('2d');
    header = document.getElementById('header');
    dispStamina = document.getElementById('staminaNum');
    document.getElementById('tag').setAttribute("height", display);
    document.getElementById('tag').setAttribute("width", display);
    canvas.fillStyle = "#ffffff";
    canvas.fillRect(0, 0, display, display);
    document.getElementById('turnNum').innerHTML = turn;
    updateFrame();
};

/*
    -----------------------------------
    Event Listeners
    -----------------------------------
*/

//This client pressed Up button
var thisPlayerMoveUp = new Event("thisPlayerMoveUp");
window.addEventListener("thisPlayerMoveUp", function () {
    if (move(currentPlayer, "UP"))
    {
        socket.emit('data', JSON.stringify({move: "UP"}));
        if (stamina <= 0)
        {
            colorButtons("grey");
        }
        updateFrame();
        victoryCheck();
    }    
});

//This client pressed Down button
var thisPlayerMoveDown = new Event("thisPlayerMoveDown");
window.addEventListener("thisPlayerMoveDown", function () { 
    if (move(currentPlayer, "DOWN"))
    {
        socket.emit('data', JSON.stringify({move: "DOWN"}));
        if (stamina <= 0)
        {
            colorButtons("grey");
        }
        updateFrame();
        victoryCheck()
    }
});

//This client pressed Left button
var thisPlayerMoveLeft = new Event("thisPlayerMoveLeft");
window.addEventListener("thisPlayerMoveLeft", function () { 
    if (move(currentPlayer, "LEFT"))
    {
        socket.emit('data', JSON.stringify({move: "LEFT"}));
        if (stamina <= 0)
        {
            colorButtons("grey");
        }
        updateFrame();
        victoryCheck()
    }
});

//This client pressed Right button
var thisPlayerMoveRight = new Event("thisPlayerMoveRight");
window.addEventListener("thisPlayerMoveRight", function () { 
    if (move(currentPlayer, "RIGHT"))
    {
        socket.emit('data', JSON.stringify({move: "RIGHT"}));
        if (stamina <= 0)
        {
            colorButtons("grey");
        }
        updateFrame();
        victoryCheck()
    }
});

//This client pressed End Turn button
var thisPlayerEndTurn = new Event("thisPlayerEndTurn");
window.addEventListener("thisPlayerEndTurn", function () { 
    clearInterval(timerInterval);
    timer = 20;
    document.getElementById('timer').innerHTML = timer;
    colorButtons("grey");
    endTurnKey.classList.add("disabled");
    socket.emit('data', JSON.stringify({turn: "end"}));
});

//This client collected the green power up (5)
var thisPlayerVisionPow = new Event("thisPlayerVisionPow");
window.addEventListener("thisPlayerVisionPow", function () { 
    document.getElementById('visionPowDisplay').style.display = "inline";
    document.getElementById('visionPowDisplay').innerHTML = "POWER WILL ACTIVATE NEXT TURN";
    //Cancel if same power was activated on the same turn
    if (visionPowFavour == -1 && visionPowTime == 4)
    {
        visionPowFavour = 2;
        visionPowTime = 2;
    }
    //Start powerup activation
    else
    {
        visionPowFavour = 1;
        visionPowTime = 4;
    }
});

//This client collected the yellow power up (4)
var thisPlayerMovePow = new Event("thisPlayerMovePow");
window.addEventListener("thisPlayerMovePow", function () { 
    document.getElementById('movePowDisplay').style.display = "inline";
    document.getElementById('movePowDisplay').innerHTML = "POWER WILL ACTIVATE NEXT TURN";
    //Cancel if same power was activated on the same turn
    if (movePowFavour == -1 && movePowTime == 4)
    {
        movePowFavour = 2;
        movePowTime = 2;
    }
    //Start powerup activation
    else
    {
        movePowFavour = 1;
        movePowTime = 4;
    }
});

//Opponent client moved Up
var oppPlayerMoveUp = new Event("oppPlayerMoveUp");
window.addEventListener("oppPlayerMoveUp", function () { 
    move(oppPlayer, "UP");
    updateFrame();
});

//Opponent client moved Down
var oppPlayerMoveDown = new Event("oppPlayerMoveDown");
window.addEventListener("oppPlayerMoveDown", function () { 
    move(oppPlayer, "DOWN");
    updateFrame();
    victoryCheck()
});

//Opponent client moved Left
var oppPlayerMoveLeft = new Event("oppPlayerMoveLeft");
window.addEventListener("oppPlayerMoveLeft", function () { 
    move(oppPlayer, "LEFT");
    updateFrame();
    victoryCheck()
});

//Opponent client moved Right
var oppPlayerMoveRight = new Event("oppPlayerMoveRight");
window.addEventListener("oppPlayerMoveRight", function () { 
    move(oppPlayer, "RIGHT");
    updateFrame();
    victoryCheck()
});

//Opposing player has ended their turn
var oppPlayerEndTurn = new Event("oppPlayerEndTurn");
window.addEventListener("oppPlayerEndTurn", function () { 
    updatePowerups();
    resetStamina();
    //Enable the Chaser's buttons
    if (currentPlayer == 8)
    {
        colorButtons("blue");
    }
    //Enable the Runner's buttons
    else if (currentPlayer == 9)
    {
        colorButtons("pink");
    }
    turn++;
    document.getElementById('turnNum').innerHTML = turn;
    window.dispatchEvent(startTimer);
});

//Opponent client collected the green power up (5)
var oppPlayerVisionPow = new Event("oppPlayerVisionPow");
window.addEventListener("oppPlayerVisionPow", function () { 
    //Cancel if same power was activated on the same turn
    if (visionPowFavour == 1 && visionPowTime == 4)
    {
        visionPowFavour = 2;
        visionPowTime = 2;
    }
    //Start powerup activation
    else
    {
        visionPowFavour = -1;
        visionPowTime = 4;
    }
});

//Opponent client collected the yellow power up (4)
var oppPlayerMovePow = new Event("oppPlayerMovePow");
window.addEventListener("oppPlayerMovePow", function () { 
    //Cancel if same power was activated on the same turn
    if (movePowFavour == 1 && movePowTime == 4)
    {
        movePowFavour = 2;
        movePowTime = 2;
    }
    //Start powerup activation
    else
    {
        movePowFavour = -1;
        movePowTime = 4;
    }
});

//This player wins
var playerWin = new Event("playerWin");
window.addEventListener("playerWin", function () { 
    document.getElementById('connector').style.display = "block";
    document.getElementById('wait').style.display = "none";
    document.getElementById('game').style.display = "none";
    resetGame();
    document.getElementById('alert').style.display = "inline";
    document.getElementById('alert').innerHTML = "You Won the Game!";
});

//This player loses
var playerLose = new Event("playerLose");
window.addEventListener("playerLose", function () { 
    document.getElementById('connector').style.display = "block";
    document.getElementById('wait').style.display = "none";
    document.getElementById('game').style.display = "none";
    resetGame();
    document.getElementById('alert').style.display = "inline";
    document.getElementById('alert').innerHTML = "You Lost the Game!";
});

//Start the timer for the game
var startTimer = new Event("startTimer");
window.addEventListener("startTimer", function () { 
    timer = 20;
    if (timerInterval != null)
    {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(countDown, 1000);
});

/*
    -----------------------------------
    Handle connections to the server
    -----------------------------------
*/
var connect = new Event("connect");
window.addEventListener("connect", function()
{
    //Remove JSON
    var inputData = rxjs.fromEvent(socket,'data').pipe(rxjs.operators.map(function (data)
    {
        return JSON.parse(data);
    }));
    
    //Server responses to connection attempt
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.connected == "true" || data.connected == "false");
    }))
    .subscribe(function(data) {
        //Display the waiting screen
        if (data.connected == "true")
        {
            document.getElementById('alert').style.display = "none";
            document.getElementById('connector').style.display = "none";
            document.getElementById('wait').style.display = "block";
            document.getElementById('game').style.display = "none";
            resetGame();
        }
        //Cannot join the game
        else
        {
            document.getElementById('alert').style.display = "inline";
            document.getElementById('alert').innerHTML = "Lobby is full";
        }
    });
    
    //Server says the game is ready
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.ready == "true");
    }))
    .subscribe(function() {
        //Show and start the game
        document.getElementById('connector').style.display = "none";
        document.getElementById('wait').style.display = "none";
        document.getElementById('game').style.display = "block";
        window.dispatchEvent(startTimer);
    });
    
    //Server has assigned players to roles
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.player != null);
    }))
    .pipe(rxjs.operators.map(function (data)
    {
        //Mapped for the tile 
        return data.player + 8;
    }))
    .subscribe(function(data) {
        currentPlayer = data;
        //Assigned to runner
        if (currentPlayer == 9)
        {
            oppPlayer = 8;
            colorButtons("pink");
        }
        //Assigned to chaser
        else if (currentPlayer == 8)
        {
            oppPlayer = 9;
            colorButtons("blue");
        }
        updateFrame();
    });
    
    //Server send the opponents movement
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.move != null);
    }))
    .subscribe(function(data) {
        //Opponent moved up
        if (data.move == "UP")
        {
            window.dispatchEvent(oppPlayerMoveUp);
        }
        //Opponent moved down
        else if (data.move == "DOWN")
        {
            window.dispatchEvent(oppPlayerMoveDown);
        }
        //Opponent moved left
        else if (data.move == "LEFT")
        {
            window.dispatchEvent(oppPlayerMoveLeft);
        }
        //Opponent moved right
        else if (data.move == "RIGHT")
        {
            window.dispatchEvent(oppPlayerMoveRight);
        }
    });
    
    //Server sends who the victor is
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.victor != null);
    }))
    .subscribe(function(data) {
        //This client won
        if (data.victor == "true")
        {
            window.dispatchEvent(playerWin);
        }
        //The opponent won
        else if (data.victor == "false")
        {
            window.dispatchEvent(playerLose);
        }
        //The game has been ended due to the turn limit
        else if (data.victor == "time")
        {
            //If the chaser, tell the server the client lost
            if (currentPlayer == 8)
            {
                socket.emit('data', JSON.stringify({victor: "false"}));
                window.dispatchEvent(playerLose);
            }
            //If the runner, tell the server the client won
            else if (currentPlayer == 9)
            {
                socket.emit('data', JSON.stringify({victor: "true"}));
                window.dispatchEvent(playerWin);
            }
        }
    });
    
    //End of turn data
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.turn != null);
    }))
    .subscribe(function(data) {
        if (data.turn == "reset")
        {
            window.dispatchEvent(oppPlayerEndTurn);
        }
    });
});

//Disconnect from the server
var disconnect = new Event("disconnect");
window.addEventListener("disconnect", function () { 
    socket.disconnect();
    document.getElementById('alert').style.display = "none";
    document.getElementById('connector').style.display = "block";
    document.getElementById('wait').style.display = "none";
    document.getElementById('game').style.display = "none";
    resetGame();
});

/*
    -----------------------------------
    Game functions
    -----------------------------------
*/

//Draw the canvas
function drawGame()
{
    if(canvas==null) {return;}
    
    //Iterates over the map
    for(var y = 0; y < mapHeight; y++)
    {
        for(var x = 0; x < mapWidth; x++)
        {
            if (revealAll == true || fogmask[((y*mapWidth)+x)] != 1)
            {
                //Revealed area
                switch(map[((y*mapWidth)+x)])
                {
                    case 0:
                        canvas.fillStyle = "#ffffff";
                        break;
                    case 1:
                        canvas.fillStyle = "#444444";
                        break;
                    case 4:
                        canvas.fillStyle = "#ffab00";
                        break;
                    case 5:
                        canvas.fillStyle = "#00c853";
                        break;
                    case 8:
                        canvas.fillStyle = "#03adfc";
                        break;
                    case 9:
                        canvas.fillStyle = "#f50057";
                        break;
                    default:
                        canvas.fillStyle = "#000000";
                        break;                    
                }
            }
            //Covered by fog
            else
            {
                switch(map[((y*mapWidth)+x)])
                {
                    case 0:
                        canvas.fillStyle = "#bbbbbb";
                        break;
                    case 1:
                        canvas.fillStyle = "#444444";
                        break;
                    default:
                        canvas.fillStyle = "#bbbbbb";
                        break;                    
                }
            }
            
            //Draw the Tile
            canvas.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
        }
    }
}

//Get the location of the specified tile
function getLocation(searchTile)
{  
    for(var y = 0; y < mapHeight; y++)
    {
        for(var x = 0; x < mapWidth; x++)
        {
            //Store tile location
            if (map[((y*mapWidth)+x)] == searchTile)
            {
                targetLocation.x = x;
                targetLocation.y = y;
                return true;
            }
        }
    }
    return false;
}

//Update the canvas
function updateFrame()
{
    dispStamina.innerHTML = stamina;
    createFog();
    requestAnimationFrame(drawGame);
}

//Check if position is legal
function legalMove(posX, posY)
{
    //Check within map bounds
    if (posY >= 0 && posY < mapHeight && posX >= 0 && posX < mapWidth)
    {
        //Check if visible tile
        if (map[((posY*mapWidth)+posX)] != 1)
        {
            return true;
        }
    }
    return false;
}

//Trigger the powerup for the player at the location
function powerTrigger(player, posX, posY)
{
    //Check which player triggered the powerup
    //This client's player
    if (player == currentPlayer)
    {
        //Movement powerup
        if (map[((posY*mapWidth)+posX)] == 4)
        {
            window.dispatchEvent(thisPlayerMovePow);
        }
        //Vision powerup
        else if (map[((posY*mapWidth)+posX)] == 5)
        {
            window.dispatchEvent(thisPlayerVisionPow);
        }
    }
    //The opponent
    else
    {
        //Movement powerup
        if (map[((posY*mapWidth)+posX)] == 4)
        {
            window.dispatchEvent(oppPlayerMovePow);
        }
        //Vision powerup
        else if (map[((posY*mapWidth)+posX)] == 5)
        {
            window.dispatchEvent(oppPlayerVisionPow);
        }
    }
}

//Check victory conditions
function victoryCheck()
{
    //Check if the runner is present
    if (!getLocation(9))
    {
        //Declare a victor
        if (currentPlayer == 9)
        {
            socket.emit('data',JSON.stringify({victor: "false"}));
        }
        else if (oppPlayer == 9)
        {
            socket.emit('data',JSON.stringify({victor: "true"}));
        }        
    }
    //Check if the chaser is present
    else if (!getLocation(8))
    {
        getLocation(9);
        map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 8;
        updateFrame();
        victoryCheck();
    }
}

//Change the color of movement buttons
function colorButtons(color)
{
    //Get all the buttons
    var upKey = document.getElementById('upKey');
    var leftKey = document.getElementById('leftKey');
    var downKey = document.getElementById('downKey');
    var rightKey = document.getElementById('rightKey');
    var endTurnKey = document.getElementById('endTurnKey');
    
    //Remove the style from all buttons
    //Remove from Up button
    upKey.classList.remove("light-blue");
    upKey.classList.remove("disabled");
    upKey.classList.remove("pink","accent-3");
    //Remove from Left button
    leftKey.classList.remove("light-blue");
    leftKey.classList.remove("disabled");
    leftKey.classList.remove("pink","accent-3");
    //Remove from Down button
    downKey.classList.remove("light-blue");
    downKey.classList.remove("disabled");
    downKey.classList.remove("pink","accent-3");
    //Remove from Right button
    rightKey.classList.remove("light-blue");
    rightKey.classList.remove("disabled");
    rightKey.classList.remove("pink","accent-3");
    
    //Remove from end turn button unless it should be disabled
    if (color != "grey")
    {
        endTurnKey.classList.remove("light-blue");
        endTurnKey.classList.remove("disabled");
        endTurnKey.classList.remove("pink","accent-3");
    }
    
    //Apply disabled to all movement buttons
    if (color == "grey")
    {
        upKey.classList.add("disabled");
        leftKey.classList.add("disabled");
        downKey.classList.add("disabled");
        rightKey.classList.add("disabled");
    }
    //Apply blue to all buttons
    else if (color == "blue")
    {
        upKey.classList.add("light-blue");
        leftKey.classList.add("light-blue");
        downKey.classList.add("light-blue");
        rightKey.classList.add("light-blue");
        endTurnKey.classList.add("light-blue");
    }
    //Apply pink to all buttons
    else if (color == "pink")
    {
        upKey.classList.add("pink","accent-3");
        leftKey.classList.add("pink","accent-3");
        downKey.classList.add("pink","accent-3");
        rightKey.classList.add("pink","accent-3");
        endTurnKey.classList.add("pink","accent-3");
    }
}

//Move in a direction
function move(player, direction)
{
    //Return if movement is attempted without stamina
    if (stamina <= 0 && player == currentPlayer)
    {
        return false;
    }
    
    //Return if the player cannot be found
    if (!getLocation(player))
    {
        return false;
    }
    
    //Attempt to move Up
    if (direction == "UP")
    {
        //Check if the tile can be moved to
        if (legalMove(targetLocation.x,targetLocation.y-1))
        {
            //Trigger powerup and move to tile
            powerTrigger(player, targetLocation.x,targetLocation.y-1);
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.y = targetLocation.y-1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            //Decrement the stamina for this client
            if (player == currentPlayer)
            {
                stamina--;
            }
            return true;
        }
    }
    //Attempt to move Down
    else if (direction == "DOWN")
    {
        //Check if the tile can be moved to
        if (legalMove(targetLocation.x,targetLocation.y+1))
        {
            //Trigger powerup and move to tile
            powerTrigger(player, targetLocation.x,targetLocation.y+1);
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.y = targetLocation.y+1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            if (player == currentPlayer)
            {
                stamina--;
            }
            return true;
        }
    }
    //Attempt to move Left
    else if (direction == "LEFT")
    {
        //Check if the tile can be moved to
        if (legalMove(targetLocation.x-1,targetLocation.y))
        {
            //Trigger powerup and move to tile
            powerTrigger(player, targetLocation.x-1,targetLocation.y);
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.x = targetLocation.x-1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            if (player == currentPlayer)
            {
                stamina--;
            }
            return true;
        }
    }
    //Attempt to move Right
    else if (direction == "RIGHT")
    {
        //Check if the tile can be moved to
        if (legalMove(targetLocation.x+1,targetLocation.y))
        {
            //Trigger powerup and move to tile
            powerTrigger(player, targetLocation.x+1,targetLocation.y);
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.x = targetLocation.x+1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            if (player == currentPlayer)
            {
                stamina--;
            }
            return true;
        }
    }
    return false;
}

//Reset the stamina count
function resetStamina()
{
    stamina = maxStamina;
    updateFrame();
}

//Restore game to initial state
function resetGame()
{
    //Restore variables to initial state
    map = initialMap.map((x) => x);;
    visionPowFavour = 0;
    visionPowTime = 0;
    visionRange = 5;
    revealAll = false;
    movePowFavour = 0;
    movePowTime = 0;
    maxStamina = 10;
    clearInterval(timerInterval);
    timer = 20;
    document.getElementById('timer').innerHTML = timer;
    turn = 1;
    document.getElementById('turnNum').innerHTML = turn;
    
    //Restore HTML elements to initial state
    canvas = document.getElementById('tag').getContext('2d');
    header = document.getElementById('header');
    dispStamina = document.getElementById('staminaNum');
    document.getElementById('tag').setAttribute("height", display);
    document.getElementById('tag').setAttribute("width", display);
    canvas.fillStyle = "#ffffff";
    canvas.fillRect(0, 0, display, display);
    document.getElementById('visionPowDisplay').style.display = "none";
    document.getElementById('visionPowDisplay').innerHTML = "";
    document.getElementById('movePowDisplay').style.display = "none";
    document.getElementById('movePowDisplay').innerHTML = "";
    resetStamina();
    updateFrame();
}

//Check for powerup updates
function updatePowerups()
{
    //Vision Powerup
    if (visionPowFavour != 0)
    {
        visionPowTime--;
        //End the powerup
        if (visionPowTime == 0)
        {
            visionPowFavour = 0;
            visionRange = 5;
            revealAll = false;
            document.getElementById('visionPowDisplay').style.display = "none";
            document.getElementById('visionPowDisplay').innerHTML = "";
        }
        
        //This client's favour
        if (visionPowFavour == 1)
        {
            //Powerup has applied to this client
            if (currentPlayer == 9)
            {
                revealAll = true;
                document.getElementById('visionPowDisplay').style.display = "inline";
                document.getElementById('visionPowDisplay').innerHTML = "YOU ARE AFFECTED BY ENLIGHTEN";
            }
            //Powerup has applied to the opponent
            else
            {
                document.getElementById('visionPowDisplay').style.display = "inline";
                document.getElementById('visionPowDisplay').innerHTML = "THE OPPONENT IS AFFECTED BY BLINDNESS";
            }
            
        }
        //Opponent's favour
        else if (visionPowFavour == -1)
        {
            //Powerup has applied to this client
            if (currentPlayer == 9)
            {
                visionRange = 1;
                revealAll = false;
                document.getElementById('visionPowDisplay').style.display = "inline";
                document.getElementById('visionPowDisplay').innerHTML = "YOU ARE AFFECTED BY BLINDNESS";
            }
            //Powerup has applied to the opponent
            else
            {
                document.getElementById('visionPowDisplay').style.display = "inline";
                document.getElementById('visionPowDisplay').innerHTML = "THE OPPONENT IS AFFECTED BY ENLIGHTEN";
            }           
        }
        //Powerup was cancelled
        else if (visionPowFavour == 2)
        {
            document.getElementById('visionPowDisplay').style.display = "inline";
            document.getElementById('visionPowDisplay').innerHTML = "POWER COUNTERED";
        }
    }
    
    //Movement Powerup
    if (movePowFavour != 0)
    {
        movePowTime--;
        //End the powerup
        if (movePowTime == 0)
        {
            movePowFavour = 0;
            maxStamina = 10;
            document.getElementById('movePowDisplay').style.display = "none";
            document.getElementById('movePowDisplay').innerHTML = "";
        }
        
        //This client's favour
        if (movePowFavour == 1)
        {
            //Powerup has applied to this client
            if (currentPlayer == 8)
            {
                maxStamina = 15;
                document.getElementById('movePowDisplay').style.display = "inline";
                document.getElementById('movePowDisplay').innerHTML = "YOU ARE AFFECTED BY HASTE";
            }
            //Powerup has applied to the opponent
            else
            {
                document.getElementById('movePowDisplay').style.display = "inline";
                document.getElementById('movePowDisplay').innerHTML = "THE OPPONENT IS AFFECTED BY FATIGUE";
            }
        }
        //Opponent's favour
        else if (movePowFavour == -1)
        {
            //Powerup has applied to this client
            if (currentPlayer == 8)
            {
                maxStamina = 5;
                document.getElementById('movePowDisplay').style.display = "inline";
                document.getElementById('movePowDisplay').innerHTML = "YOU ARE AFFECTED BY FATIGUE";
            }
            //Powerup has applied to the opponent
            else
            {
                document.getElementById('movePowDisplay').style.display = "inline";
                document.getElementById('movePowDisplay').innerHTML = "THE OPPONENT IS AFFECTED BY HASTE";
            }
        }
        //Powerup was cancelled
        else if (movePowFavour == 2)
        {
            document.getElementById('movePowDisplay').style.display = "inline";
            document.getElementById('movePowDisplay').innerHTML = "POWER COUNTERED";
        }
    }
}

//Start creation of the fog of war
function createFog()
{
    //Skip if reveal all is active
    if (revealAll == true)
    {
        return;
    }
    
    fogmask = new Array(mapHeight*mapWidth).fill(1);
    getLocation(currentPlayer);
    recursiveFog(targetLocation.x,targetLocation.y,visionRange);
}

//Check all tile next to the given location
function recursiveFog(x, y, depth)
{
    //Stop on the bounds of the map
    if (depth < 0 || y < 0 || y >= mapHeight || x < 0 || x >= mapWidth)
    {
        return;
    }
    
    //Mark as a visible tile
    else if (map[((y*mapWidth)+x)] != 1)
    {
        fogmask[((y*mapWidth)+x)] = 0;
    }
    //Stop if unexpected
    else
    {
        return;
    }
    
    //Recursive for all neighbouring tiles
    recursiveFog(x+1,y,depth-1);
    recursiveFog(x-1,y,depth-1);
    recursiveFog(x,y+1,depth-1);
    recursiveFog(x,y-1,depth-1);
}

//Sets url and calls connect event
function connecter(url)
{
    socket = io.connect(url);
    document.getElementById('timer').innerHTML = timer;
    window.dispatchEvent(connect);
}

//Count down for timer
function countDown()
{
    //Reduce the time
    if (timer > 0)
    {
        timer--;
        document.getElementById('timer').innerHTML = timer;
    }
    //End the turn when time runs out
    else if (timer == 0)
    {
        window.dispatchEvent(thisPlayerEndTurn);
    }
}