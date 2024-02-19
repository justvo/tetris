const PLAYFIELD_COLUMS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = [
    'O'
]
const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1],
    ],
    'J': [
        [1, 0, 0]
        [1, 1, 1]
        [1, 0, 0]
    ]
};
let playField;
let tetromino;

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMS + column
}

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMS; i++) {
        const div = document.createElement('div')
        document.querySelector('.grid').append(div)
    }
    playField = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMS).fill(0))
}

function generateTetromino() {
    const name = TETROMINO_NAMES[1];
    const matrix = TETROMINOES[name];
    tetromino = {
        name,
        matrix,
        row: 1,
        column: 3
    }
}

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll('.grid div')


function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMS; column++) {
            if (playField[row][column] == 0) continue;
            drawTetromino();
            drawPlayField();
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
            cells[cellIndex].classList.add(TETROMINO_NAMES)
        }
    }

}
// drawTetromino();
// drawPlayField();

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'))
}
// draw();

document.addEventListener('keydown', onKeyDown)
function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowDown':
            moveTetaminaDown();
            break;
        case 'ArrowDown':
            moveTetaminaLeft();
            break;
        case 'ArrowDown':
            moveTetaminaRight();
            break;
        case 'ArrowDown':
            moveTetaminaDown();
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