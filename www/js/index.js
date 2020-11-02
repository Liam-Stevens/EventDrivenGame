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
var targetLocation = {x:0,y:0};

//Setup the canvas environment
window.onload = function()
{
    canvas = document.getElementById('tag').getContext('2d');
    document.getElementById('tag').setAttribute("height", display);
    document.getElementById('tag').setAttribute("width", display);
    getLocation(currentPlayer);
    requestAnimationFrame(drawGame);
};

function callEvent(event)
{
    if (event == "player1MoveUp")
    {
        move(8, "UP");
    }
    else if (event == "player1MoveDown")
    {
        move(8, "DOWN");
    }
    else if (event == "player1MoveLeft")
    {
        move(8, "LEFT");
    }
    else if (event == "player1MoveRight")
    {
        move(8, "RIGHT");
    }
    else if (event == "player2MoveUp")
    {
        move(9, "UP");
    }
    else if (event == "player2MoveDown")
    {
        move(9, "DOWN");
    }
    else if (event == "player2MoveLeft")
    {
        move(9, "LEFT");
    }
    else if (event == "player2MoveRight")
    {
        move(9, "RIGHT");
    }
    updateFrame();
}

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
function move(player, direction)
{
    getLocation(player);
    
    if (direction == "UP")
    {
        if (legalMove(targetLocation.x,targetLocation.y-1))
        {
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.y = targetLocation.y-1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
        }
    }
    else if (direction == "DOWN")
    {
        if (legalMove(targetLocation.x,targetLocation.y+1))
        {
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.y = targetLocation.y+1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
        }
    }
    else if (direction == "LEFT")
    {
        if (legalMove(targetLocation.x-1,targetLocation.y))
        {
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.x = targetLocation.x-1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
        }
    }
    else if (direction == "RIGHT")
    {
        if (legalMove(targetLocation.x+1,targetLocation.y))
        {
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.x = targetLocation.x+1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
        }
    }
}

function pressUp()
{
    callEvent("player1MoveUp");
}

function pressDown()
{
    callEvent("player1MoveDown");
}

function pressLeft()
{
    callEvent("player1MoveLeft");
}

function pressRight()
{
    callEvent("player1MoveRight");
}

function pressSubmit()
{
    //TODO: Remove this
    callEvent("player2MoveUp");
}