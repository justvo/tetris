//!!!The logic of obtaining points has not been created!!!
// !!! the number changes statically !!!



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

let scoreValueElement = document.querySelector('.score-value');;
let score = 100;

//random
const tetraminoItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}



function convertPositionToIndex(row, column) {
    return row * PLAY_FIELD_COLUMS + column;
}



function generatePlayField() {
    for (let i = 0; i < PLAY_FIELD_ROWS * PLAY_FIELD_COLUMS; i++) {
        const div = document.createElement('div')
        document.querySelector('.grid').append(div)
    }
    playField = new Array(PLAY_FIELD_ROWS).fill()
        .map(() => new Array(PLAY_FIELD_COLUMS).fill(0))
}



function generateTetromino() {

    const name = tetraminoItem(TETROMINO_NAMES);
    const matrix = TETROMINOES[name];
    const column = PLAY_FIELD_COLUMS / 2 - Math.floor(matrix.length / 2);
    const rowTetro = -2;



    tetromino = {
        name,
        matrix,
        row: rowTetro,
        column: column,
    }
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
generatePlayField();
generateTetromino();

const cells = document.querySelectorAll('.grid div')


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

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const roratedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = roratedMatrix;
    if (!isValid()) {
        tetromino.matrix = oldMatrix;
    }

}

draw();

function rotate() {
    rotateTetromino();
    draw();
}



document.addEventListener('keydown', onKeyDown);
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
        tetromino.row -= 1;
        placeTetromino();
    }
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
    return tetromino.matrix[row][column] && (tetromino.column + column < 0 ||
        tetromino.column + column >= PLAY_FIELD_COLUMS ||
        tetromino.row + row >= PLAY_FIELD_ROWS)
}

function hasCollisions(row, column) {
    return tetromino.matrix[row][column] && playField[tetromino.row + row][tetromino.column + column];

}

function startTimer() {

    timer = setInterval(function () {
        score += 10;
        scoreValueElement.textContent = score;
        moveTetaminaDown();
        draw();
    }, 1000);
}

// main 
startTimer();




