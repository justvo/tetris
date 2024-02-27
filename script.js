


//const
const PLAY_FIELD_COLUMS = 10;
const PLAY_FIELD_ROWS = 20;

const TETROMINO_NAMES = [
    'O',
    'J',
    'T',
    'I',
    'S',
    'Z',
    'L',
]
const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1],
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'T': [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
};

//var
let playField;
let tetromino;
let nextTetromino;

let scoreValueElement = document.querySelector('.score-value');;
let score = 0;
let timerMove;
let isTimerRunning;


//MAIN

generatePlayField();
const nextTetrominoGrid = document.querySelector('.next-tetromino-grid');
generateNextTetromino();
generateTetromino();

const cells = document.querySelectorAll('.grid div')

draw();
document.addEventListener('keydown', onKeyDown);
startTimer();

const btnInfo = document.getElementById('btnInfo');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const btnReset = document.getElementById('btnReset');

btnInfo.addEventListener('click', function () {
    showCustomModal('Control is with the right, left and down arrows, turn by pressing the up arrow')
})
btnReset.addEventListener('click', function () {
    resetPlayField();
    generateNextTetromino();
    generateTetromino();
    score = 0;
    showCustomModal('the game was restarted')

})

showCustomModal('Be careful, when switching to another window, the game stops.\nReady to start?');






function generateNextTetromino() {
    const name = tetraminoItem(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];

    nextTetromino = {
        name,
        matrix,
    };

    nextTetrominoGrid.innerHTML = '';



    ;

    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
            const cell = document.createElement('div');
            cell.classList.add('next-tetromino-cell');
            if (matrix[row] && matrix[row][column]) {
                cell.classList.add(nextTetromino.name);
            }

            nextTetrominoGrid.appendChild(cell);
        }
    }
}



//random
function tetraminoItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}



function convertPositionToIndex(row, column) {
    return row * PLAY_FIELD_COLUMS + column;
}




///GENERATE FUNCTION
function generatePlayField() {
    for (let i = 0; i < PLAY_FIELD_ROWS * PLAY_FIELD_COLUMS; i++) {
        const div = document.createElement('div')
        document.querySelector('.grid').append(div)
    }
    playField = new Array(PLAY_FIELD_ROWS).fill()
        .map(() => new Array(PLAY_FIELD_COLUMS).fill(0))
}



function generateTetromino() {

    const name = (nextTetromino && nextTetromino.name) ? nextTetromino.name : tetraminoItem(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];
    const column = PLAY_FIELD_COLUMS / 2 - Math.floor(matrix.length / 2);
    const rowTetro = -1;



    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: column,
    }

    generateNextTetromino();

}

function placeTetromino() {

    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (tetromino.matrix[row][column]) {
                playField[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }
    generateTetromino();
}


//DRAWSFUNCTION
function drawPlayField() {
    for (let row = 0; row < PLAY_FIELD_ROWS; row++) {
        for (let column = 0; column < PLAY_FIELD_COLUMS; column++) {
            if (playField[row][column] == 0) continue;

            const name = playField[row][column];
            const cellIndex = convertPositionToIndex(row, column);

            cells[cellIndex].classList.add(name);
        }
    }


}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            if (!tetromino.matrix[row][column]) continue;

            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            if (cells[cellIndex]) {
                cells[cellIndex].classList.add(name)
            }
        }
    }


}


function draw() {
    cells.forEach(cell => {
        if (cell) {
            cell.removeAttribute('class')
        }
    });
    drawPlayField();
    drawTetromino();
}


//ROTATE FUNCTIONS
function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const roratedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = roratedMatrix;
    if (!isValid()) {
        tetromino.matrix = oldMatrix;
    }

}



function rotate() {
    rotateTetromino();
    draw();
}



//PRESS KEY FUNCTION
function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowDown':
            moveTetaminaDown();
            break;
        case 'ArrowLeft':
            moveTetaminaLeft();
            break;
        case 'ArrowRight':
            moveTetaminaRight();
            break;
        case 'ArrowUp':
            rotate();
            break;

    }
    draw();
}

function rotateMatrix(matrixTetromino) {
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;

}

function moveTetaminaDown() {
    tetromino.row += 1;
    if (!isValid()) {
        checkGameOver();
        tetromino.row -= 1;
        placeTetromino();
        removeCompletedRows();
    }
    draw();

}

function moveTetaminaLeft() {
    tetromino.column -= 1;
    if (!isValid()) {
        tetromino.column += 1;

    }
}

function moveTetaminaRight() {
    tetromino.column += 1;
    if (!isValid()) {
        tetromino.column -= 1;

    }
}


//VALIDATION FUNCTION
function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if (isOutSideOfGameBoard(row, column)) {

                return false;
            }
            if (hasCollisions(row, column)) {
                return false;
            }
        }
    }
    return true;

}





function isOutSideOfGameBoard(row, column) {
    console.log
    return tetromino.matrix[row][column] && (tetromino.column + column < 0 ||
        tetromino.column + column >= PLAY_FIELD_COLUMS ||
        tetromino.row + row >= PLAY_FIELD_ROWS)
}

function hasCollisions(row, column) {
    return tetromino.matrix[row][column] && playField[tetromino.row + row][tetromino.column + column];

}

function checkGameOver() {
    console.log("check");
    for (let column = 0; column < PLAY_FIELD_COLUMS; column++) {
        if (playField[1][column] !== 0) {
            console.log("check success");
            stopTimer();
            showCustomModal('GAME OVER \nDo you want ro restart?');
            break;
        }
    }
}



//AUTOMOVE TO DOWN
function startTimer() {
    if (!isTimerRunning) {

        timerMove = setInterval(function () {
            moveTetaminaDown();
        }, 500);
    }
    isTimerRunning = true;
}

function stopTimer() {
    clearInterval(timerMove);
    isTimerRunning = false;
}


//REMOVE FUNCTIONS
function removeCompletedRows() {
    let rowsToRemove = [];
    for (let row = PLAY_FIELD_ROWS - 1; row >= 0; row--) {
        if (isRowCompleted(row)) {
            rowsToRemove.push(row);
        }
    }

    for (let i = 0; i < rowsToRemove.length; i++) {
        const rowToRemove = rowsToRemove[i];
        playField.splice(rowToRemove, 1);
    }

    for (let i = 0; i < rowsToRemove.length; i++) {
        playField.unshift(new Array(PLAY_FIELD_COLUMS).fill(0));
    }

    if (rowsToRemove.length > 0) {
        score += 100 * rowsToRemove.length;
        scoreValueElement.textContent = `0000${score}`.slice(-6);;

    }
}


function isRowCompleted(row) {
    for (let column = 0; column < PLAY_FIELD_COLUMS; column++) {
        if (playField[row][column] === 0) {
            return false;
        }
    }
    return true;
}



//CUSTOMALERT
function showCustomModal(message) {
    stopTimer();
    const modal = document.getElementById('custom-modal');
    const textContant = document.getElementById('modal-text')
    textContant.textContent = message;
    modal.style.display = 'block';

    const btnOK = document.getElementById('btn-ok');
    const btnCancel = document.getElementById('btn-cancel');

    btnOK.addEventListener('click', function () {
        startTimer();
        modal.style.display = 'none';
    });

    btnCancel.addEventListener('click', function () {
        modal.style.display = 'none';
    });
}




//bacground animation
document.addEventListener('DOMContentLoaded', function () {
    const backgroundContainer = document.getElementById('background-container');
    let intervalId;

    function createFallingSquare() {
        const square = document.createElement('div');
        square.className = 'falling-square';

        const size = Math.floor(Math.random() * 30) + 10;
        square.style.width = `${size}px`;
        square.style.height = `${size}px`;

        const color = getRandomColor();
        square.style.backgroundColor = color;

        square.style.left = `${Math.random() * 100}vw`;
        backgroundContainer.appendChild(square);

        animateFallingSquare(square);
    }

    function animateFallingSquare(square) {
        let positionY = 0;
        const speed = 1;

        function moveSquare() {
            positionY += speed;
            square.style.top = `${positionY}vh`;

            if (positionY < 100) {
                requestAnimationFrame(moveSquare);
            } else {
                square.remove();
            }
        }

        moveSquare();
    }

    // Add an event handler for losing focus
    window.addEventListener('blur', function () {
        // stop all animation
        clearInterval(intervalId);
        stopTimer()
    });

    // when going to the game page 
    window.addEventListener('focus', function () {

        // StartbacgroundAnimation
        intervalId = setInterval(createFallingSquare, 60);
        //start Move tetraminoe
        console.log('eroror')
        startTimer();

    });

    //StartbacgroundAnimation
    intervalId = setInterval(createFallingSquare, 60);

});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function resetPlayField() {
    playField = new Array(PLAY_FIELD_ROWS).fill()
        .map(() => new Array(PLAY_FIELD_COLUMS).fill(0));
    draw();
}




