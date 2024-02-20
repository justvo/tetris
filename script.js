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
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
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
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
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
        row: 1 ,
        column: Math.floor((PLAY_FIELD_COLUMS - matrix[0].length) / 2) ,
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

    }
    draw();
}

function moveTetaminaDown() {
    tetromino.row++;
}

function moveTetaminaLeft() {
    tetromino.column--;
}

function moveTetaminaRight() {
    tetromino.column++;
}

// main 
generatePlayField();
generateTetromino();
const cells = document.querySelectorAll('.grid div')

draw();

document.addEventListener('keydown', onKeyDown);
