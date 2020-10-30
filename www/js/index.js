var canvas = null;

/*
    Map for play
    0: moveable tile
    1: immoveable tile
    4: powerup 1
    5: powerup 2
    8: player 1
    9: player 2
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

var screenHeight = window.innerHeight-window.innerHeight/10;
var screenWidth = window.screen.width;

//Change this to screenWidth for production
var display = screenHeight;

var mapWidth = 10, mapHeight = 10;
var tileWidth = display/mapWidth, tileHeight = display/mapHeight;

var currentPlayer = 8;
var currentLocation = {x:0,y:0};

//Setup the canvas environment
window.onload = function()
{
    canvas = document.getElementById('tag').getContext('2d');
    document.getElementById('tag').setAttribute("height", display);
    document.getElementById('tag').setAttribute("width", display);
    getLocation();
    requestAnimationFrame(drawGame);
};

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

//Get the location of the current player
function getLocation()
{  
    for(var y = 0; y < mapHeight; y++)
    {
        for(var x = 0; x < mapWidth; x++)
        {
            if (map[((y*mapWidth)+x)] == currentPlayer)
            {
                currentLocation.x = x;
                currentLocation.y = y;
            }
        }
    }
}

function updateFrame()
{
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

//Move in a direction
function move(direction)
{
    if (direction == "UP")
    {
        if (legalMove(currentLocation.x,currentLocation.y-1))
        {
            map[(((currentLocation.y)*mapWidth)+currentLocation.x)] = 0;
            currentLocation.y = currentLocation.y-1;
            map[(((currentLocation.y)*mapWidth)+currentLocation.x)] = currentPlayer;
        }
    }
    else if (direction == "DOWN")
    {
        if (legalMove(currentLocation.x,currentLocation.y+1))
        {
            map[(((currentLocation.y)*mapWidth)+currentLocation.x)] = 0;
            currentLocation.y = currentLocation.y+1;
            map[(((currentLocation.y)*mapWidth)+currentLocation.x)] = currentPlayer;
        }
    }
    else if (direction == "LEFT")
    {
        if (legalMove(currentLocation.x-1,currentLocation.y))
        {
            map[(((currentLocation.y)*mapWidth)+currentLocation.x)] = 0;
            currentLocation.x = currentLocation.x-1;
            map[(((currentLocation.y)*mapWidth)+currentLocation.x)] = currentPlayer;
        }
    }
    else if (direction == "RIGHT")
    {
        if (legalMove(currentLocation.x+1,currentLocation.y))
        {
            map[(((currentLocation.y)*mapWidth)+currentLocation.x)] = 0;
            currentLocation.x = currentLocation.x+1;
            map[(((currentLocation.y)*mapWidth)+currentLocation.x)] = currentPlayer;
        }
    }
}

function pressUp()
{
    move("UP");
    updateFrame();
}

function pressDown()
{
    move("DOWN");
    updateFrame();
}

function pressLeft()
{
    move("LEFT");
    updateFrame();
}

function pressRight()
{
    move("RIGHT");
    updateFrame();
}

function pressSubmit()
{
    //TODO: Remove this
    switchPlayer();
}

//DEBUG function
function switchPlayer()
{
    if (currentPlayer == 8)
    {
        currentPlayer = 9;
    }
    else
    {
        currentPlayer = 8;
    }
    getLocation();
}