//Holds all of the Tetris Pieces
let shapes = []; 
let currentPiece;
//Set Frame for Game Board
const height = 18;
const width = 10;
//Status of the Game, Paused = 0, Start = 1, Ended = 2
let isGameRunning = 0;  
//Colors of the Pieces in Order of Line, Z, L, O, J, S, T 
let colors = ['darkorange', 'greenyellow', 'navy', 'red', 'mediumvioletred', 'mediumturquoise', 'gold'];
//Tracks the Squarest that are filled on the board
let filledSquares = [];
//Declares direction that piece is moving
let direction;
//Accumulator for points 
let points = 0;

function startGame(){
    initializeGame();
    createPieces();
    makePiece();
    drawPiece();
    document.onkeydown = checkKeyPressed;
}

window.addEventListener('load', function(){
    startGame();
})


function initializeGame(){  //Initializes the Game Arena
    let board = document.getElementsByClassName('game-arena')[0];
    board.innerHTML = '';
    let acc = 0;
    for(let y = 0; y < height; y++){  //Create Rows
        let row = document.createElement('div');
        row.className = 'row';
        row.className.row = y;
        
        for(let x = 0; x < width; x++){ //Create the Columns
            let block = document.createElement('div');
            block.className= 'block';
            block.dataset.x = x;
            block.dataset.y = y;
            block.dataset.index = acc;
            block.dataset.state = 0;
            row.appendChild(block);
            acc++;
        }
        board.appendChild(row);
    }
}

function createPieces(){ //This will Initialize and create the Pieces for the Game
    let tPiece = [[1,0], [0,1], [1,1], [2,1]]; //T-Piece Dimenstions
    let linePiece = [[0,0], [1,0], [2,0], [3,0]]; //Line Piece Dimensions
    let zPiece = [[0,0], [1,0], [1,1], [2,1]]; //Z-Piece Dimensions
    let sPiece = [[0,1], [1,1], [1,0], [2,0]]; //S-Piece Dimensions
    let lPiece = [[0,1], [1,1], [2,1], [2,0]]; //L-Piece Dimensions
    let jPiece = [[0,0], [0,1], [1,1], [2,1]]; //J-Piece Dimensions
    let oPiece = [[0,0], [0,1], [1,0], [1,1]]; //O-Piece Dimensions

    shapes.push(linePiece);
    shapes.push(zPiece);
    shapes.push(lPiece);
    shapes.push(oPiece);
    shapes.push(jPiece);
    shapes.push(sPiece);
    shapes.push(tPiece); //Add Shapes to Shape Array

}

function makePiece(){  //Makes the Piece Object
    let randomPiece = Math.floor(Math.random() * shapes.length);
    let center = Math.floor(width/2); //Find the Center of the Game Board
    let shape = shapes[randomPiece]; //Picks the Shape to Draw
    let location = [center, 0]; //Location to Create the Shape

    currentPiece = {
        shape: shape,
        color: colors[randomPiece],
        locationOnBoard: location,
        relLocation: getRelativeLocation(shape, location)
    };


}

function getRelativeLocation(shape, location){

}

function drawPiece(){  //Draws the Piece on the Board
    //Obtaining Elements from Object
    let shape = currentPiece.shape;
    let location = currentPiece.locationOnBoard;

    clearPiece();
    

    if(direction == 'left'){ //Updates location as Piece goes Left
        currentPiece.locationOnBoard[0]--;
    }
    else if(direction == 'right'){ //Updates location as Piece goes Right
        currentPiece.locationOnBoard[0]++;
    }
    else if(direction == 'down'){ //Updates location as Piece Falls
        currentPiece.locationOnBoard[1]++;
    }

    for(let a = 0; a < shape.length; a++){
        let x = shape[a][0] + location[0];
        let y = shape[a][1] + location[1];
        let block = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');


        block.classList.add('filled');
        block.style.backgroundColor = currentPiece.color;
    }

    currentPiece.relLocation = getRelativeLocation(currentPiece.shape, currentPiece.locationOnBoard);
}

function clearPiece(){  //Resets the Current Piece
    let shape = currentPiece.shape;
    let location = currentPiece.locationOnBoard;

    for(let a = 0; a < shape.length; a++){
        let x = shape[a][0] + location[0];
        let y = shape[a][1] + location[1];
        let block = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');

        block.classList.remove('filled');
        block.style.backgroundColor = ''; //Removes Color
    }
}

function checkKeyPressed(e){
    e.preventDefault();
    
    e = e || window.event;

    if(e.keyCode == '37'){  //Left Arrow
        direction = 'left'
    }

    if(e.keyCode == '39'){  //Right Arrow
        direction = 'right'
    }

    if(e.keyCode == '40'){  //Down Arrow
        direction = 'down'
    }

    drawPiece();
}

function getNextBlock(){ //Get the Next Block in Queue and Display It in Separate Div
    
}

function checkWallCollision(){  //Check if Piece has hit Wall
    let blocks = currentPiece.shape;
    let locationOnBoard = currentPiece.locationOnBoard;
    let collided = false;

    for(let a = 0; a < blocks.length; a++){
        let block = blocks[a];
        let x = block[0] + locationOnBoard[0];
        let y = block[1] + locationOnBoard[1];

        if (direction == 'left'){
            x--;
        }
        else if (direction == 'right'){
            x++;
        }

        let selectedBlock = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');

        if(filledSquares.indexOf(selectedBlock.dataset.index) > -1){  //Already at either wall
            collision = true;
            break;
        }

        if(x < 0 && direction == 'left'){ //Left Wall
            collsion = true;
            break;
        }

        if (x == width && direction == 'right'){  //Right Wall
            collsion = true;
            break;
        }
    }

    return collision;
}

function checkYCollision(){
    
}
