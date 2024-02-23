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
        [0, 0, 1],
        [0, 0, 1],
        [0, 1, 1],
    ],
    'L': [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
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

//random
const tetraminoItem = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

    const name = TETROMINO_NAMES[tetraminoItem(0, TETROMINO_NAMES.length - 1)];
    const matrix = TETROMINOES[name];

    tetromino = {
        name,
        matrix,
        row: 0,
        column: Math.floor((PLAY_FIELD_COLUMS - matrix[0].length) / 2),
    }
}


function drawPlayField() {
    for (let row = 0; row < PLAY_FIELD_ROWS; row++) {
        for (let column = 0; column < PLAY_FIELD_COLUMS; column++) {
            if (playField[row][column] === 0) continue;

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
            cells[cellIndex].classList.add(name)

        }
    }

}


function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawTetromino();
    drawPlayField();
}

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
            const rotatedMatrix = rotateTetromino(tetromino.matrix);

            if (!checkColision(tetromino.row, tetromino.column, rotatedMatrix)) {
                tetromino.matrix = rotatedMatrix;
            }
            break;

    }
    draw();
}

function moveTetaminaDown() {
    if (!checkColision(tetromino.row + 1, tetromino.column)) {
        tetromino.row++;
    }
}

function moveTetaminaLeft() {
    if (!checkColision(tetromino.row, tetromino.column - 1)) {
        tetromino.column--;
    }
}

function moveTetaminaRight() {
    if (!checkColision(tetromino.row, tetromino.column + 1)) {
        tetromino.column++;
    }
}

function rotateTetromino(matrix) {

    const rotatedMatrix = [];

    for (let i = 0; i < matrix[0].length; i++) {
        rotatedMatrix[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            rotatedMatrix[i][j] = matrix[j][i];
        }
    }

    for (let i = 0; i < rotatedMatrix.length; i++) {
        rotatedMatrix[i].reverse();
    }

    return rotatedMatrix;
}


function removeZeros(matrix) {

    let newMatrix =[];

    matrix.forEach((row, rowIndex) => {
        newMatrix[rowIndex] = row.filter(element => element !== 0);
    });

    newMatrix = newMatrix.filter(row => row.length > 0);

    return newMatrix;
}

function longestIndexOfRow(matrix) {
    const indexOfLongestRow = matrix.reduce((longestIndex, currentRow, currentIndex, array) => {
        return currentRow.length > array[longestIndex].length ? currentIndex : longestIndex;
    }, 0);
    console.log(indexOfLongestRow)
    return indexOfLongestRow;
}


function checkColision(newPositionRow, newPositionColumn, newMatrix = tetromino.matrix) {
    const cleanedMatrix = removeZeros(newMatrix);

    if (
        newPositionRow < 0 ||
        newPositionRow + cleanedMatrix.length > PLAY_FIELD_ROWS ||
        newPositionColumn < 0 ||
        newPositionColumn + cleanedMatrix[longestIndexOfRow(cleanedMatrix)].length > PLAY_FIELD_COLUMS
    ) {
        return true; 
    }

    return false; 
}

// main 
generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div')

draw();

document.addEventListener('keydown', onKeyDown);
