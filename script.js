const PLAY_FIELD_COLUMS = 10;
const PLAY_FIELD_ROWS = 20;

const TETROMINO_NAMES = ["O", "J", "T", "I", "S", "Z", "L"];
const TETROMINOES = {
  O: [
    [1, 1],
    [1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  I: [
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

let scoreValueElement = document.querySelector(".score-value");
let score = 0;

let isTimerRunning;
let lastTime = 0;


let touchStartX = 0;
let touchEndX = 0;

let touchStartY = 0;
let touchEndY = 0;
let isMobile;

//MAIN

generatePlayField();
const nextTetrominoGrid = document.querySelector(".next-tetromino-grid");
generateNextTetromino();
generateTetromino();

const cells = document.querySelectorAll(".grid div");

draw();
document.addEventListener("keydown", onKeyDown);
startTimer();

const btnInfo = document.getElementById("btnInfo");
const btnStart = document.getElementById("btnStart");
const btnStop = document.getElementById("btnStop");
const btnReset = document.getElementById("btnReset");

btnInfo.addEventListener("click", function () {
  showCustomModal(
    "Control is with the ←, → and ↓ , turn by pressing the ↑ key/buttons ",
    "When using from the phone, swipes are available. \nTo reload the page, make a long swipe",
    "Continue"
  );
});
btnStart.addEventListener("click", function () {
  startTimer();
});
btnStop.addEventListener("click", function () {
  let chitmessage =
    "This button is a cheat whether you choose to use it or not, it stops the tetromin from falling automatically. Do you agree to use it? (to turn off, press the 'Start' button)";
  showCustomModal(chitmessage, "", "No, continue", "Yes, cheaters are cool!!");
  stopTimer();
});
btnReset.addEventListener("click", function () {
  showCustomModal(
    "Are you sure?",
    "Really want to restart?",
    "No, contunue",
    "Restart"
  );
});

showCustomModal(
  "Be careful, when switching to another window, the game stops",
  "Ready to start?",
  "Start"
);





document.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY
});

document.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const threshold = 50; 
    const reloadSwipe = 500;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;


    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
            moveTetaminaRight();
        } else {
            moveTetaminaLeft();
        }
        draw();
    }
    if (Math.abs(deltaY) > threshold) {
        if (deltaY < 0) {
            rotate();
        } else {
            moveTetaminaDown();
        }
        draw();
    }
    if(Math.abs(deltaY) > reloadSwipe){
        location.reload();

    }
}
///////////////and main

//generate tetromino
function generateNextTetromino() {
  const name = tetraminoItem(TETROMINO_NAMES);
  const matrix = TETROMINOES[name];

  nextTetromino = {
    name,
    matrix,
  };

  nextTetrominoGrid.innerHTML = "";

  for (let row = 0; row < 2; row++) {
    for (let column = 0; column < 4; column++) {
      const cell = document.createElement("div");
      cell.classList.add("next-tetromino-cell");
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

///GENERATE FUNCTIONs
function generatePlayField() {
  for (let i = 0; i < PLAY_FIELD_ROWS * PLAY_FIELD_COLUMS; i++) {
    const div = document.createElement("div");
    document.querySelector(".grid").append(div);
  }
  playField = new Array(PLAY_FIELD_ROWS)
    .fill()
    .map(() => new Array(PLAY_FIELD_COLUMS).fill(0));
}

function generateTetromino() {
  const name =
    nextTetromino && nextTetromino.name
      ? nextTetromino.name
      : tetraminoItem(TETROMINO_NAMES);
  const matrix = TETROMINOES[name];
  const column = PLAY_FIELD_COLUMS / 2 - Math.floor(matrix.length / 2);
  const rowTetro = -1;

  tetromino = {
    name,
    matrix,
    row: rowTetro,
    column: column,
  };

  generateNextTetromino();
}
////place tetromino of playfield
function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (tetromino.matrix[row][column]) {
        playField[tetromino.row + row][tetromino.column + column] =
          tetromino.name;
      }
    }
  }
  generateTetromino();
}

//DRAWSFUNCTIONs
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
        cells[cellIndex].classList.add(name);
      }
    }
  }
}

function draw() {
  cells.forEach((cell) => {
    if (cell) {
      cell.removeAttribute("class");
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

//PRESS KEY FUNCTIONs
function onKeyDown(e) {
  switch (e.key) {
    case "ArrowDown":
      moveTetaminaDown();
      break;
    case "ArrowLeft":
      moveTetaminaLeft();
      break;
    case "ArrowRight":
      moveTetaminaRight();
      break;
    case "ArrowUp":
      rotate();
      break;
  }
  draw();
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

//VALIDATION FUNCTIONs
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
  console.log;
  return (
    tetromino.matrix[row][column] &&
    (tetromino.column + column < 0 ||
      tetromino.column + column >= PLAY_FIELD_COLUMS ||
      tetromino.row + row >= PLAY_FIELD_ROWS)
  );
}

function hasCollisions(row, column) {
  return (
    tetromino.matrix[row][column] &&
    playField[tetromino.row + row][tetromino.column + column]
  );
}

function checkGameOver() {
  for (let column = 0; column < PLAY_FIELD_COLUMS; column++) {
    if (playField[1][column] !== 0) {
      stopTimer();
      showCustomModal("GAME OVER", "Do you want to restart?", "Restart");
      break;
    }
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

//AUTOMOVE TO DOWN

function timerCallback(currentTime) {
  if (!isTimerRunning) {
    return;
  }

  // Calculate the elapsed time since the last frame
  const deltaTime = currentTime - lastTime;

  // If enough time has passed, move the tetramino down and increase the score
  if (deltaTime >= Math.max(50, 1000 - score * 0.01)) {
    moveTetaminaDown();
    lastTime = currentTime;
  }

  // Request the next frame
  timerMove = requestAnimationFrame(timerCallback);
}

function startTimer() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    timerMove = requestAnimationFrame(timerCallback);
  }
}

function stopTimer() {
  if (isTimerRunning) {
    cancelAnimationFrame(timerMove);
    isTimerRunning = false;
  }
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
    scoreValueElement.textContent = `0000${score}`.slice(-6);
  }
}

//MODAL-MESSAGE
function showCustomModal(messageTitle, messageText, confirm, cancel) {
  stopTimer();
  const isModalExists = document.querySelector(".modal");

  if (isModalExists) {
    return null;
  }

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  const buttons = document.createElement("div");
  buttons.classList.add("buttons");

  const modalTitle = document.createElement("p");
  modalTitle.classList.add("modal-title");
  modalTitle.textContent = messageTitle;

  const modalMessage = document.createElement("p");
  modalMessage.classList.add("modal-text");
  modalMessage.textContent = messageText;

  const confirmButton = document.createElement("button");
  confirmButton.classList.add("btn-ok");
  confirmButton.textContent = confirm;
  confirmButton.addEventListener("click", () => {
    if (confirm === "Restart") {
      resetPlayField();
    }
    startTimer();
    modal.style.display = "none";
    modal.remove();
  });
  if (cancel) {
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("btn-cancel");
    cancelButton.textContent = cancel;
    cancelButton.addEventListener("click", () => {
      if (cancel === "Restart") {
        modal.style.display = "none";
        modal.remove();
        resetPlayField();
        startTimer();
        console.log("resetPlayField");
      }
      if (cancel !== "Yes, cheaters are cool!!") {
        stopTimer();
      }
      modal.style.display = "none";
      modal.remove();
    });
    buttons.appendChild(cancelButton);
  }

  modal.appendChild(modalContent);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalMessage);
  modalContent.appendChild(buttons);

  buttons.appendChild(confirmButton);
  modal.style.display = "block";

  // Append the modal to your desired container in the DOM
  document.body.appendChild(modal);
}

///RESET FUNCTION
function resetPlayField() {
  generateNextTetromino();
  generateTetromino();
  playField = new Array(PLAY_FIELD_ROWS)
    .fill()
    .map(() => new Array(PLAY_FIELD_COLUMS).fill(0));
  draw();
  score = 0;
  scoreValueElement.textContent = `0000${score}`.slice(-6);
  showCustomModal("The game was restarted", "", "Ok");
}

//background animation
document.addEventListener("DOMContentLoaded", function () {
  const backgroundContainer = document.getElementById("background-container");
  let intervalId;


  function createFallingSquare() {
    const square = document.createElement("div");
    square.className = "falling-square";

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
    const speed = 0.2;

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
  window.addEventListener("blur", function () {
    // stop all animation
    showCustomModal("Pause", '', 'Continue', 'Restart');
    clearInterval(intervalId);
    stopTimer();
  });

  // when going to the game page
  window.addEventListener("focus", function () {
    // StartbacgroundAnimation
    intervalId = setInterval(createFallingSquare, 60);
  });

  //StartbacgroundAnimation
  intervalId = setInterval(createFallingSquare, 60);
});

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function setInitialWindowSize() {
  initialWindowWidth = window.innerWidth;
  initialWindowHeight = window.innerHeight;

  if (initialWindowWidth < 900) {
    addButton();
  } else {
    removeButton();
  }
}

// Викликати функцію при завантаженні сторінки
window.addEventListener("load", setInitialWindowSize);

window.addEventListener("resize", () => {
  setInitialWindowSize();
});

function addButton() {
  const isButtonsExists = document.querySelector(".controls-button");
  if (isButtonsExists) {
    return null;
  }
  const inform = document.querySelector(".inform");

  const controlsButton = document.createElement("div");
  controlsButton.classList.add("controls-button");

  const createButton = (className, textContent, clickHandler) => {
    const button = document.createElement("button");
    button.classList.add("control-button");
    button.classList.add(className);
    button.addEventListener("click", clickHandler);
    button.innerHTML = textContent;
    return button;
  };

  const rotateButton = createButton("rotate-button", "↻", () => {
    rotate();
    draw();
  });

  const leftButton = createButton("left-button", "←", () => {
    moveTetaminaLeft();
    draw();
  });

  const downButton = createButton("down-button", "↓", () => {
    moveTetaminaDown();
    draw();
  });

  const rightButton = createButton("right-button", "→", () => {
    moveTetaminaRight();
    draw();
  });

  const otherButtons = document.createElement("div");
  otherButtons.classList.add("other-buttons");

  otherButtons.appendChild(leftButton);
  otherButtons.appendChild(downButton);
  otherButtons.appendChild(rightButton);

  controlsButton.appendChild(rotateButton);
  controlsButton.appendChild(otherButtons);

  inform.insertBefore(controlsButton, inform.children[1]);
}

function removeButton() {
  const controlsButton = document.querySelector(".controls-button");
  if (controlsButton) {
    controlsButton.remove();
  }
}
