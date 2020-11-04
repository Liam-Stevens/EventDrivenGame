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
    8, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 4, 0, 0, 0, 0,
    0, 1, 0, 0, 1, 1, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 1, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 1, 0, 0,
    0, 0, 0, 0, 1, 1, 0, 0, 1, 0,
    0, 0, 0, 5, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 9,
];

var screenHeight = window.innerHeight-window.innerHeight/5;
var screenWidth = window.screen.width;

//Change this to screenWidth for production
var display = screenHeight;

var mapWidth = 10, mapHeight = 10;
var tileWidth = display/mapWidth, tileHeight = display/mapHeight;

var currentPlayer = 8;
var oppPlayer = 9;
var targetLocation = {x:0,y:0};

var stamina = 6;

var visionPowFavour = 0;
var visionPowTime = 0;
var movePowFavour = 0;
var movePowTime = 0;

//Setup the canvas environment
window.onload = function()
{
    canvas = document.getElementById('tag').getContext('2d');
    header = document.getElementById('header');
    dispStamina = document.getElementById('staminaNum');
    document.getElementById('tag').setAttribute("height", display);
    document.getElementById('tag').setAttribute("width", display);
    canvas.fillStyle = "#ffffff";
    canvas.fillRect(0, 0, display, display);
    updateFrame();
};

var thisPlayerMoveUp = new Event("thisPlayerMoveUp");
window.addEventListener("thisPlayerMoveUp", function () {
    if (move(currentPlayer, "UP"))
    {
        socket.emit('data', JSON.stringify({move: "UP"}));
        updateFrame();
    }    
});

var thisPlayerMoveDown = new Event("thisPlayerMoveDown");
window.addEventListener("thisPlayerMoveDown", function () { 
    if (move(currentPlayer, "DOWN"))
    {
        socket.emit('data', JSON.stringify({move: "DOWN"}));
        updateFrame();
    }
});

var thisPlayerMoveLeft = new Event("thisPlayerMoveLeft");
window.addEventListener("thisPlayerMoveLeft", function () { 
    if (move(currentPlayer, "LEFT"))
    {
        socket.emit('data', JSON.stringify({move: "LEFT"}));
        updateFrame();
    }
});

var thisPlayerMoveRight = new Event("thisPlayerMoveRight");
window.addEventListener("thisPlayerMoveRight", function () { 
    if (move(currentPlayer, "RIGHT"))
    {
        socket.emit('data', JSON.stringify({move: "RIGHT"}));
        updateFrame();
    }
});

var thisPlayerEndTurn = new Event("thisPlayerEndTurn");
window.addEventListener("thisPlayerEndTurn", function () { 
    //TODO: implement ending of turns
    resetStamina();
    updateFrame();
});

var thisPlayerVisionPow = new Event("thisPlayerVisionPow");
window.addEventListener("thisPlayerVisionPow", function () { 

});

var thisPlayerMovePow = new Event("thisPlayerMovePow");
window.addEventListener("thisPlayerMovePow", function () { 

});

var oppPlayerMoveUp = new Event("oppPlayerMoveUp");
window.addEventListener("oppPlayerMoveUp", function () { 
    move(oppPlayer, "UP");
    updateFrame();
});

var oppPlayerMoveDown = new Event("oppPlayerMoveDown");
window.addEventListener("oppPlayerMoveDown", function () { 
    move(oppPlayer, "DOWN");
    updateFrame();
});

var oppPlayerMoveLeft = new Event("oppPlayerMoveLeft");
window.addEventListener("oppPlayerMoveLeft", function () { 
    move(oppPlayer, "LEFT");
    updateFrame();
});

var oppPlayerMoveRight = new Event("oppPlayerMoveRight");
window.addEventListener("oppPlayerMoveRight", function () { 
    move(oppPlayer, "RIGHT");
    updateFrame();
});

var oppPlayerEndTurn = new Event("oppPlayerEndTurn");
window.addEventListener("oppPlayerEndTurn", function () { 
    
});

var oppPlayerVisionPow = new Event("oppPlayerVisionPow");
window.addEventListener("oppPlayerVisionPow", function () { 

});

var oppPlayerMovePow = new Event("oppPlayerMovePow");
window.addEventListener("oppPlayerMovePow", function () { 

});

//Draw the canvas
function drawGame()
{
    if(canvas==null) {return;}
    
    for(var y = 0; y < mapHeight; y++)
    {
        for(var x = 0; x < mapWidth; x++)
        {
            switch(map[((y*mapWidth)+x)])
            {
                case 0:
                    canvas.fillStyle = "#ffffff";
                    break;
                case 1:
                    canvas.fillStyle = "#444444";
                    break;
                case 4:
                    canvas.fillStyle = "#f6fa00";
                    break;
                case 5:
                    canvas.fillStyle = "#1fcc44";
                    break;
                case 8:
                    canvas.fillStyle = "#03adfc";
                    break;
                case 9:
                    canvas.fillStyle = "#fc0390";
                    break;
                default:
                    canvas.fillStyle = "#000000";
                    break;                    
            }
            
            canvas.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
        }
    }
}

//Get the location of the specified
function getLocation(searchTile)
{  
    for(var y = 0; y < mapHeight; y++)
    {
        for(var x = 0; x < mapWidth; x++)
        {
            if (map[((y*mapWidth)+x)] == searchTile)
            {
                targetLocation.x = x;
                targetLocation.y = y;
            }
        }
    }
}

function updateFrame()
{
    dispStamina.innerHTML = stamina;
    requestAnimationFrame(drawGame);
}

//Check if position is legal
function legalMove(posX, posY)
{
    if (posY >= 0 && posY < mapHeight && posX >= 0 && posX < mapWidth)
    {
        if (map[((posY*mapWidth)+posX)] != 1)
        {
            return true;
        }
    }
    return false;
}

function powerTrigger(player, posX, posY)
{
    if (player == currentPlayer)
    {
        if (map[((posY*mapWidth)+posX)] == 4)
        {
            window.dispatchEvent(thisPlayerMovePow);
        }
        else if (map[((posY*mapWidth)+posX)] == 5)
        {
            window.dispatchEvent(thisPlayerVisionPow);
        }
    }
    else
    {
        if (map[((posY*mapWidth)+posX)] == 4)
        {
            window.dispatchEvent(oppPlayerMovePow);
        }
        else if (map[((posY*mapWidth)+posX)] == 5)
        {
            window.dispatchEvent(oppPlayerVisionPow);
        }
    }
}

//Move in a direction
function move(player, direction)
{
    if (stamina <= 0)
    {
        return false;
    }
    
    getLocation(player);
    
    if (direction == "UP")
    {
        if (legalMove(targetLocation.x,targetLocation.y-1))
        {
            powerTrigger(player, targetLocation.x,targetLocation.y-1);
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.y = targetLocation.y-1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            stamina--;
            return true;
        }
    }
    else if (direction == "DOWN")
    {
        if (legalMove(targetLocation.x,targetLocation.y+1))
        {
            powerTrigger(player, targetLocation.x,targetLocation.y+1);
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.y = targetLocation.y+1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            stamina--;
            return true;
        }
    }
    else if (direction == "LEFT")
    {
        if (legalMove(targetLocation.x-1,targetLocation.y))
        {
            powerTrigger(player, targetLocation.x-1,targetLocation.y);
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.x = targetLocation.x-1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            stamina--;
            return true;
        }
    }
    else if (direction == "RIGHT")
    {
        if (legalMove(targetLocation.x+1,targetLocation.y))
        {
            powerTrigger(player, targetLocation.x+1,targetLocation.y);
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.x = targetLocation.x+1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            stamina--;
            return true;
        }
    }
    return false;
}

function resetStamina()
{
    stamina = 6;
}

function pressUp()
{
    window.dispatchEvent(thisPlayerMoveUp);
}

function pressDown()
{
    window.dispatchEvent(thisPlayerMoveDown);
}

function pressLeft()
{
    window.dispatchEvent(thisPlayerMoveLeft);
}

function pressRight()
{
    window.dispatchEvent(thisPlayerMoveRight);
}

function pressSubmit()
{
    window.dispatchEvent(thisPlayerEndTurn);
}

function connect(url)
{
    socket = io.connect("http://"+url);
    //Remove JSON
    var inputData = rxjs.fromEvent(socket,'data').pipe(rxjs.operators.map(function (data)
    {
        return JSON.parse(data);
    }));
    
    //Show the waiting screen
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.connected == "true" || data.connected == "false");
    }))
    .subscribe(function(data) {
        if (data.connected == "true")
        {
            document.getElementById('refused').style.display = "none";
            document.getElementById('connector').style.display = "none";
            document.getElementById('wait').style.display = "inline";
            document.getElementById('game').style.display = "none";
        }
        else
        {
            document.getElementById('refused').style.display = "inline";
        }
    });
    
    //Show the game screen
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.ready == "true");
    }))
    .subscribe(function() {
        document.getElementById('connector').style.display = "none";
        document.getElementById('wait').style.display = "none";
        document.getElementById('game').style.display = "inline";
    });
    
    //Player assignment data
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.player != null);
    }))
    .pipe(rxjs.operators.map(function (data)
    {
        return data.player + 8;
    }))
    .subscribe(function(data) {
        console.log(data);
        currentPlayer = data;
        if (currentPlayer == 9)
        {
            oppPlayer = 8;
        }
        else if (currentPlayer == 8)
        {
            oppPlayer = 9;
        }
    });
    
    inputData.pipe(rxjs.operators.filter(function (data)
    {
        return (data.move != null);
    }))
    .subscribe(function(data) {
        if (data.move == "UP")
        {
            window.dispatchEvent(oppPlayerMoveUp);
        }
        else if (data.move == "DOWN")
        {
            window.dispatchEvent(oppPlayerMoveDown);
        }
        else if (data.move == "LEFT")
        {
            window.dispatchEvent(oppPlayerMoveLeft);
        }
        else if (data.move == "RIGHT")
        {
            window.dispatchEvent(oppPlayerMoveRight);
        }
    });
    
}