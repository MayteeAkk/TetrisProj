//Holds all of the Tetris Pieces
let shapes = []; 
let currentPiece;
//Set Frame for Game Board
const height = 18;
const width = 10;
//Status of the Game, Paused = 0, Start = 1, Ended = 2
var isGameRunning = 0;  
//Colors of the Pieces in Order of Line, Z, L, O, J, S, T 
let colors = ['darkorange', 'greenyellow', 'navy', 'red', 'mediumvioletred', 'mediumturquoise', 'gold'];
//Tracks the Squarest that are filled on the board
let filledSquares = [];
//Declares direction that piece is moving
var direction = '';
//Accumulator for points 
let points = 0;
var timer;
let level = 1;

let move = 0; //Track Moves

function startGame(){
    initializeGame();
    createPieces();
    makePiece();
    drawPiece();
    
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
        row.dataset.row = y;
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

function removeAtIndex(i){
    let locationOfIndex = filledSquares.indexOf(i);
    filledSquares.splice(locationOfIndex, 1);
}

function step(){
    if(move == 0){
        makePiece();
        drawPiece();
    }
    else{
        if(checkYCollision()){
            makePiece();
            drawPiece();
        }
        else{
            clearPiece();
            drawPiece();
        }
    }

    move++;
}

function startTimer(){
    isGameRunning = 1;
    filledSquares = [];
    initializeGame();
    makePiece();
    drawPiece();
    document.onkeydown = checkKeyPressed;

    timer = setInterval(() => {
        direction = 'down';
        drawPiece();
    }, 800);
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

    if (hasCollided()){
        isGameRunning = '2'; //Stops the Game
        document.getElementById('points').innerHTML += 'Sorry! Game Over!';
        clearInterval(timer);
    }
}

function getRelativeLocation(shape, location){
    let numbers = [];

    for(let a = 0; a < shape.length; a++){
        let x = shape[a][0] + location[0];
        let y = shape[a][1] + location[1];

        let queryBlock = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');
        numbers.push(queryBlock.dataset.index);
    }

    return numbers;
}

function drawPiece(){  //Draws the Piece on the Board
    checkYCollision();
    //Obtaining Elements from Object
    let shape = currentPiece.shape;
    let location = currentPiece.locationOnBoard;
    
    clearPiece();
    

    if(direction == 'down'){ //Updates location as Piece goes Down
        currentPiece.locationOnBoard[1]++;
    }
    else if(direction == 'right'){ //Updates location as Piece goes Right
        currentPiece.locationOnBoard[0]++;
    }
    else if(direction == 'left'){ //Updates location as Piece goes Left
        currentPiece.locationOnBoard[0]--;
    }

    for(let a = 0; a < shape.length; a++){
        let x = shape[a][0] + location[0];
        let y = shape[a][1] + location[1];
        let queryBlock = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');

        queryBlock.classList.add('filled');
        queryBlock.style.backgroundColor = currentPiece.color;
    }

    currentPiece.relLocation = getRelativeLocation(currentPiece.shape, currentPiece.locationOnBoard);
}

function clearPiece(){  //Resets the Current Piece
    let shape = currentPiece.shape;
    let location = currentPiece.locationOnBoard;

    for(let a = 0; a < shape.length; a++){
        let x = shape[a][0] + location[0];
        let y = shape[a][1] + location[1];
        let queryBlock = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');

        queryBlock.classList.remove('filled');
        queryBlock.style.backgroundColor = ''; //Removes Color
    }
}

function checkKeyPressed(e){
    e.preventDefault();
    
    e = e || window.event;

    if(e.keyCode == '37'){  //Left Arrow
        direction = 'left';
    }

    else if(e.keyCode == '38'){  //Up Arrow
        direction = 'rotate';
        rotatePiece()
    }

    else if(e.keyCode == '39'){  //Right Arrow
        direction = 'right';
    }
    else if(e.keyCode == '40'){  //Down Arrow
        direction = 'down';
    }

    if(checkWallCollision() == false){
        drawPiece();
    }
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
            collided = true;
            break;
        }

        if(x < 0 && direction == 'left'){ //Left Wall
            collided = true;
            break;
        }

        if (x == width && direction == 'right'){  //Right Wall
            collided = true;
            break;
        }
    }

    return collided;
}

function checkYCollision(){ //collided
    let blocks = currentPiece.shape;
    let locationOnBoard = currentPiece.locationOnBoard;
    let collided = false;
    
    for(let a = 0; a < blocks.length; a++){
        let selectedBlock = blocks[a];
        let x = selectedBlock[0] + locationOnBoard[0];
        let y = selectedBlock[1] + locationOnBoard[1];

        if(direction == 'down'){
            y++;
        }

        let queryBlock = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');

        if(y == height){
            collided = true;
            break;
        }
        if(filledSquares.indexOf(queryBlock.dataset.index) > -1){
            collided = true;
            break;
        }
    }


    if(collided){
        for(let a = 0; a < blocks.length; a++){
            let selectedBlock = blocks[a];
            let x = selectedBlock[0] + locationOnBoard[0];
            let y = selectedBlock[1] + locationOnBoard[1];

            let queryBlock = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');
            queryBlock.dataset.state = '1';
        }

        filledSquares = filledSquares.concat(currentPiece.relLocation);
        makePiece();
        checkRowForCompletion();
    }
    
    return collided;
}


function checkRowForCompletion(){
    let accum = 0;
    let shift = 0;

    for(let a = 0; a < height; a++){
        let lineFilled = true;
        for(let b = 0; b < width; b++){
            let queryBlock = document.querySelector('[data-x="' + b + '"][data-y="' + a + '"]');
            if(queryBlock.dataset.state == '0'){
                lineFilled = false;
                break;
            }
        }

        if (lineFilled){
            if(shift == 0){
                shift = a;
            }

            accum++;

            for(let c = 0; c < width; c++){ //Clears the Line Graphically
                let qBlock = document.querySelector('[data-x="' + c + '"][data-y="' + a + '"]');
                qBlock.dataset.state = '0';
                qBlock.style.backgroundColor = 'white';
                removeAtIndex(qBlock.dataset.index);
            }
        }
    }

    if(accum > 0){ //Add to Points
        points += accum * 100;
        shiftBlocksDown(accum, shift);
        document.getElementById('points').innerHTML = points;
    }
}

function shiftBlocksDown(accum, shift){
    for(let a = shift - 1; a >= 0; a--){
        for(let b = 0; b < width; b++){
            let y = a + accum;
            let queryBlock = document.querySelector('[data-x="' + b + '"][data-y="' + a + '"]');
            let nextBlock = document.querySelector('[data-x="' + b + '"][data-y="' + y + '"]');

            if(queryBlock.dataset.state == '1'){
                nextBlock.style.backgroundColor = queryBlock.style.backgroundColor;
                nextBlock.dataset.state = '1';
                queryBlock.style.backgroundColor = 'white';
                queryBlock.dataset.state = '0';
                removeAtIndex(queryBlock.dataset.index);
                filledSquares.push(nextBlock.dataset.index);
            }
        }
    }
}

function hasCollided(){ //iscollision
    let block = currentPiece.shape;
    let relPosition = currentPiece.locationOnBoard;
    let collided = false;

    for(let a = 0; a < block.length; a++){
        let currentBlock = block[a];
        let x = currentBlock[0] + relPosition[0];
        let y = currentBlock[1] + relPosition[1];

        if(direction == 'down'){
            y++;
        }
        let queryBlock = document.querySelector('[data-x="' + x + '"][data-y="' + y + '"]');

        if(filledSquares.indexOf(queryBlock.dataset.index) > -1 || y == height){
            collided = true;
            break;
        }
    }

    if(collided){
        filledSquares = filledSquares.concat(currentPiece.relLocation);
        makePiece();
        checkRowForCompletion();
        
    }

    return collided;

}


function rotatePiece(){
    let newOrientation = [];
    let shape = currentPiece.shape;

    for(let a = 0; a < shape.length; a++){
        let x = shape[a][0];
        let y = shape[a][1];

        let newXValue = (getNewWidth() - y);
        let newYValue = x;

        newOrientation.push([newXValue, newYValue]);
    }

    clearPiece();
    currentPiece.shape = newOrientation;
    currentPiece.relLocation = getRelativeLocation(newOrientation, currentPiece.locationOnBoard);
}

// function getNewHeight(){
//     let y = 0;

//     for(let a = 0; a < currentPiece.shape.length; a++){
//         let currentBlock = currentPiece.shape[a];
//         if(currentBlock[1] > y){
//             y = currentBlock[1];
//         }
//     }

//     return y;
// }

function getNewWidth(){
    let x = 0;

    for(let a = 0; a < currentPiece.shape.length; a++){
        let currentBlock = currentPiece.shape[a];
        if(currentBlock[0] > x){
            x = currentBlock[0];
        }
    }

    return x;
}