var canvas = null;
var header = null;
var dispStamina = null;

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
    updateFrame();
};

function callEvent(event)
{
    if (event == "thisPlayerMoveUp")
    {
        move(currentPlayer, "UP");
    }
    else if (event == "thisPlayerMoveDown")
    {
        move(currentPlayer, "DOWN");
    }
    else if (event == "thisPlayerMoveLeft")
    {
        move(currentPlayer, "LEFT");
    }
    else if (event == "thisPlayerMoveRight")
    {
        move(currentPlayer, "RIGHT");
    }
    else if (event == "thisPlayerEndTurn")
    {

    }
    else if (event == "thisPlayerVisionPow")
    {
        
    }
    else if (event == "thisPlayerMovePow")
    {
        
    }
    else if (event == "oppPlayerMoveUp")
    {
        move(oppPlayer, "UP");
    }
    else if (event == "oppPlayerMoveDown")
    {
        move(oppPlayer, "DOWN");
    }
    else if (event == "oppPlayerMoveLeft")
    {
        move(oppPlayer, "LEFT");
    }
    else if (event == "oppPlayerMoveRight")
    {
        move(oppPlayer, "RIGHT");
    }
    else if (event == "oppPlayerEndTurn")
    {
        
    }
    else if (event == "oppPlayerVisionPow")
    {
        
    }
    else if (event == "oppPlayerMovePow")
    {
        
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

//Move in a direction
function move(player, direction)
{
    if (stamina <= 0)
    {
        return;
    }
    
    getLocation(player);
    
    if (direction == "UP")
    {
        if (legalMove(targetLocation.x,targetLocation.y-1))
        {
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.y = targetLocation.y-1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            stamina--;
        }
    }
    else if (direction == "DOWN")
    {
        if (legalMove(targetLocation.x,targetLocation.y+1))
        {
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.y = targetLocation.y+1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            stamina--;
        }
    }
    else if (direction == "LEFT")
    {
        if (legalMove(targetLocation.x-1,targetLocation.y))
        {
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.x = targetLocation.x-1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            stamina--;
        }
    }
    else if (direction == "RIGHT")
    {
        if (legalMove(targetLocation.x+1,targetLocation.y))
        {
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = 0;
            targetLocation.x = targetLocation.x+1;
            map[(((targetLocation.y)*mapWidth)+targetLocation.x)] = player;
            stamina--;
        }
    }
}

function resetStamina()
{
    stamina = 6;
}

function pressUp()
{
    callEvent("thisPlayerMoveUp");
}

function pressDown()
{
    callEvent("thisPlayerMoveDown");
}

function pressLeft()
{
    callEvent("thisPlayerMoveLeft");
}

function pressRight()
{
    callEvent("thisPlayerMoveRight");
}

function pressSubmit()
{
    callEvent("thisPlayerEndTurn");
}