var canvas = null;

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

var mapWidth = 10, mapHeight = 10;
var tileWidth = window.screen.width/mapWidth, tileHeight = window.screen.width/mapHeight;

var currentPlayer = 1;



window.onload = function()
{
    canvas = document.getElementById('tag').getContext('2d');
    document.getElementById('tag').setAttribute("height", window.screen.width);
    document.getElementById('tag').setAttribute("width", window.screen.width);
    requestAnimationFrame(drawGame);
};

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

function updateFrame()
{
    requestAnimationFrame(drawGame);
}

function pressUp()
{
    map[2] = 1;
    updateFrame();
}

function pressDown()
{
    updateFrame();
}

function pressLeft()
{
    updateFrame();
}

function pressRight()
{
    updateFrame();
}

function pressSubmit()
{
    
}