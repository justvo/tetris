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
let leaderBoard = [];
let playField;
let tetromino;
let nextTetromino;
let COPY_TETROMINO_NAMES = ["O", "J", "T", "I", "S", "Z", "L"];
let scoreValueElement = document.querySelector(".score-value");
let score = 0;
let level = 1;
let isGridShowed = true;
let isTimerRunning;
let lastTime = 0;

let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

let isTetrominoDown;

let isPaused = false;
let elapsedTime = 0;

let startVolume = 0.1;
let isMusic = false;
let nextTetrominoGrid;
let cells;

const audio = new Howl({
  src: ["music/tetrisMusic.mp3"],
  loop: true,
  volume: 0.1,
  preload: "metadata",
});

//MAIN
init();

const btnMenu = document.getElementById("btnMenu");
btnMenu.textContent = "⚙";
btnMenu.addEventListener("click", function () {
  showModalMenu();
  stopTimer();
});

document.addEventListener("touchstart", function (event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

document.addEventListener("touchend", function (event) {
  touchEndX = event.changedTouches[0].clientX;
  touchEndY = event.changedTouches[0].clientY;
  handleSwipe();
});

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
    if (initialWindowWidth < 600) {
      return null;
    }

    // stop all animation
    audio.pause()

    showCustomModal("Pause", " ", "Continue", "Restart");
    clearInterval(intervalId);
    stopTimer();
  });

  // when going to the game page
  window.addEventListener("focus", function () {
    if (initialWindowWidth < 600) {
      return null;
    }
    // StartbacgroundAnimation
    intervalId = setInterval(createFallingSquare, 60);
    audio.play();
  });

  document.addEventListener("visibilitychange", function () {
    if (initialWindowWidth > 600) {
      return null;
    }
    if (document.visibilityState === "hidden") {

      audio.pause()
      showCustomModal("Pause", " ", "Continue", "Restart");
      clearInterval(intervalId);
      stopTimer();
    } else {

      audio.play();
      intervalId = setInterval(createFallingSquare, 60);
    }
  });

  //StartbacgroundAnimation
  intervalId = setInterval(createFallingSquare, 60);
});

// Call the function on page load
window.addEventListener("load", () => {
  setInitialWindowSize();
});

window.addEventListener("resize", () => {
  setInitialWindowSize();
});

function init() {
  generatePlayField();
  nextTetrominoGrid = document.querySelector(".next-tetromino-grid");
  generateNextTetromino();
  generateTetromino();
  cells = document.querySelectorAll(".grid div");
  draw();
  document.addEventListener("keydown", onKeyDown);
  startTimer();
  showCustomModal(
    "Note: The game pauses when you switch to another window. Your final result will be recorded in the leaderboard (top 5 attempts). After a short delay, the music will begin. If it's distracting, you can always mute it",
    "Ready to start?",
    "Start"
  );
}

///////////////and main

///GENERATE FUNCTIONs
//generate tetromino
function generateNextTetromino() {
  const name = tetraminoItem();
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

function generateTetromino() {
  const name =
    nextTetromino && nextTetromino.name ? nextTetromino.name : tetraminoItem();

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

function generatePlayField() {
  for (let i = 0; i < PLAY_FIELD_ROWS * PLAY_FIELD_COLUMS; i++) {
    const div = document.createElement("div");
    document.querySelector(".grid").append(div);
  }
  playField = new Array(PLAY_FIELD_ROWS)
    .fill()
    .map(() => new Array(PLAY_FIELD_COLUMS).fill(0));
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
  isTetrominoDown = true;
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
  changeVisibleGrid();
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
  if(isPaused){
    return null
  }
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
    case " ":
      moweToEnd();
      break;
  }
  draw();
}

//MOVE TOTROMINO BY SWIPE
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
  if (Math.abs(deltaY) > reloadSwipe) {
    location.reload();
  }
}

//MOVE TETRONIMO
function moveTetaminaDown() {
  if(isPaused){
    return null
  }
  tetromino.row += 1;
  if (!isValid()) {
    checkGameOver();
    tetromino.row -= 1;
    placeTetromino();
    removeCompletedRows();
  } else {
    isTetrominoDown = false;
  }

  draw();
}

function moveTetaminaLeft() {
  if(isPaused){
    return null
  }
  tetromino.column -= 1;
  if (!isValid()) {
    tetromino.column += 1;
  }
}

function moveTetaminaRight() {
  if(isPaused){
    return null
  }
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
      if (isHasCollisions(row, column)) {
        return false;
      }
    }
  }
  return true;
}

function isOutSideOfGameBoard(row, column) {
  return (
    tetromino.matrix[row][column] &&
    (tetromino.column + column < 0 ||
      tetromino.column + column >= PLAY_FIELD_COLUMS ||
      tetromino.row + row >= PLAY_FIELD_ROWS)
  );
}

function isHasCollisions(row, column) {
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
      leaderBoard.push(score);
      leaderBoard.sort((a, b) => b - a);

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

function ischangeVisibleGrid() {
  isGridShowed = !isGridShowed;
}

//AUTOMOVE TO DOWN
function moweToEnd() {
  while (!isTetrominoDown) {
    moveTetaminaDown();
  }
}

//TIME FUNCTIONS
function timerCallback(currentTime) {
  const MIN_SPEED = 50;
  if (!isTimerRunning ) {
    return;
  }

  // Calculate the elapsed time since the last frame
  const deltaTime = currentTime - lastTime;

  // If enough time has passed, move the tetramino down and increase the score
  if (deltaTime >= speedOfFallen()) {
    moveTetaminaDown();
    lastTime = currentTime;
    elapsedTime += deltaTime;
    updateDisplay();
  }

  function speedOfFallen() {
    const currSpeed = 1000 - getCurrLvl() * 50;
    return Math.max(MIN_SPEED, currSpeed);
  }

  // Request the next frame
  timerMove = requestAnimationFrame(timerCallback);
}

function startTimer() {
  if (!isTimerRunning) {
    isPaused = false;
    isTimerRunning = true;
    lastTime = performance.now();
    timerMove = requestAnimationFrame(timerCallback);
  }
}

function stopTimer() {
  if (isTimerRunning) {
    isPaused = true;
    cancelAnimationFrame(timerMove);
    isTimerRunning = false;
  }
}

//UPDATE INFORMATION FOR DISPLAY
function updateDisplay() {
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  const levelDisplay = ` ${getCurrLvl()}`;

  document.getElementById("timer").textContent = formattedTime;
  document.getElementById("level").textContent = levelDisplay;
}

function getCurrLvl() {
  const scoreInOneLvl = 500;
  level = Math.ceil((score + 1) / scoreInOneLvl);

  return level;
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
  const isMenuExist = document.querySelector(".modal-menu");
  const isLiderBoardExist = document.querySelector("#list-container-content");

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
    switch (confirm) {
      case "Start":
        audio.play();
        isMusic = true;
        break;
      case "Restart":
        resetPlayField();

        break;
    }

    startTimer();
    isMenuExist ? isMenuExist.remove() : null;
    isLiderBoardExist ? isLiderBoardExist.remove() : null;

    modal.style.display = "none";
    modal.remove();
  });

  if (cancel) {
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("btn-cancel");
    cancelButton.textContent = cancel;
    cancelButton.addEventListener("click", () => {
      if (cancel === "Restart") {
        isMenuExist ? isMenuExist.remove() : null;
        modal.remove();
        resetPlayField();
      }
      modal.style.display = "none";
      modal.remove();
      isLiderBoardExist ? isLiderBoardExist.remove() : null;
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

function showModalMenu() {
  const isMenuExist = document.querySelector(".modal-menu");

  if (isMenuExist) {
    return null;
  }

  const modal = document.createElement("div");
  modal.classList.add("modal-menu");
  modal.style.display = "block";

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-menu-content");

  const title = document.createElement("h2");
  title.textContent = "Menu";
  modalContent.appendChild(title);

  const buttons = document.createElement("div");
  buttons.classList.add("buttons-menu");

  const buttonsData = [
    {
      className: "menu-button",
      label: "Change grid visibility",
      action: () => {
        ischangeVisibleGrid();
        changeVisibleGrid();
        startTimer();
      },
    },
    {
      className: "menu-button",
      label: "Info",
      action: () =>
        showCustomModal(
          "Navigate using ←, →, and ↓ keys. Turn with ↑ key/buttons, and use ⇓/space for a quick drop.",
          "On mobile, use swipes. Reload the page with a long swipe.",
          "Continue"
        ),
    },
    {
      className: "menu-button",
      label: "Restart",
      action: () =>
        showCustomModal(
          "Are you sure? Really want to restart?",
          "Restarting won't save the result in the leaderboard, so no step backward!",
          "No, contunue",
          "Restart"
        ),
    },
    {
      className: "menu-button",
      label: "Leader board",
      action: () => showLiderBoard(),
    },
    {
      className: "menu-button",
      label: "Close",
      action: () => {
        startTimer();
      },
    },
  ];

  buttonsData.forEach((buttonData) => {
    const buttonElement = createButton(
      "modal-buttons",
      buttonData.className,
      buttonData.label,
      () => {
        buttonData.action();
        closeModalMenu();
      }
    );
    buttons.appendChild(buttonElement);
  });
  const musicControle = document.createElement("div");

  const musicButton = document.createElement("button");
  musicButton.textContent = isMusic ? "🔈" : "🔇";
  musicButton.classList.add("menu-button");
  musicButton.classList.add("music-button");
  musicButton.addEventListener("click", () => {
    if (isMusic) {
      audio.mute(true);
      musicButton.textContent = "🔇";
    } else {
      audio.mute(false);
      musicButton.textContent = "🔈";
    }
    isMusic = !isMusic;
  });

  const volumeControl = document.createElement("input");
  volumeControl.type = "range";

  volumeControl.value = (audio.volume() * 100).toFixed(0);

  volumeControl.addEventListener("input", changeVolume);

  musicControle.appendChild(musicButton);
  musicControle.appendChild(volumeControl);
  buttons.appendChild(musicControle);

  function changeVolume() {
    const volume = volumeControl.value / 100;
    audio.volume(volume);
  }

  modalContent.appendChild(buttons);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  function closeModalMenu() {
    modal.remove();
  }
}

function showLiderBoard() {
  const liderList = document.createElement("div");
  liderList.id = "list-container";
  const liderListContent = document.createElement("div");
  liderList.id = "list-container-content";

  const list = document.createElement("ul");
  list.textContent = "Leader Board";

  for (let i = 0; i < 5; i++) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-item");
    listItem.textContent = `${i + 1} - ${
      leaderBoard[i] != null ? leaderBoard[i] : "Unknown"
    }`;
    list.appendChild(listItem);
  }

  const closeButton = document.createElement("div");
  closeButton.id = "close-btn";
  closeButton.classList.add("menu-button");
  closeButton.textContent = "Close";
  closeButton.onclick = () => {
    document.body.removeChild(liderList);
    startTimer();
  };

  liderListContent.appendChild(list);
  liderListContent.appendChild(closeButton);
  liderList.appendChild(liderListContent);

  document.body.appendChild(liderList);
}

///RESET/RESTART FUNCTION
function resetPlayField() {
  elapsedTime = 0;
  updateDisplay();
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

//HELPS FUNCTIONS
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
//get random item
function tetraminoItem() {
  const randomIndex = Math.floor(Math.random() * COPY_TETROMINO_NAMES.length);
  const randomElement = COPY_TETROMINO_NAMES.splice(randomIndex, 1)[0];
  if (COPY_TETROMINO_NAMES.length < 1) {
    COPY_TETROMINO_NAMES = [...TETROMINO_NAMES];
  }
  return randomElement;
}

function convertPositionToIndex(row, column) {
  return row * PLAY_FIELD_COLUMS + column;
}

function setInitialWindowSize() {
  initialWindowWidth = window.innerWidth;
  initialWindowHeight = window.innerHeight;

  if (initialWindowWidth < 600) {
    addButton();
  } else {
    removeButton();
  }
}

function addButton() {
  const isButtonsExists = document.querySelector(".controls-button");

  if (isButtonsExists) {
    return null;
  }
  const mobileButtons = document.querySelector(".mobile-buttons");

  const controlsButton = document.createElement("div");
  controlsButton.classList.add("controls-button");

  const rotateButton = createButton(
    "control-button",
    "rotate-button",
    "↻",
    () => {
      rotate();
      draw();
    }
  );

  const leftButton = createButton("control-button", "left-button", "←", () => {
    moveTetaminaLeft();
    draw();
  });

  const downButton = createButton("control-button", "down-button", "↓", () => {
    moveTetaminaDown();
    draw();
  });

  const rightButton = createButton(
    "control-button",
    "right-button",
    "→",
    () => {
      moveTetaminaRight();
      draw();
    }
  );
  const spaceButton = createButton(
    "control-button",
    "space-button",
    "⇓",
    () => {
      moweToEnd();
      draw();
    }
  );

  const otherButtons = document.createElement("div");
  otherButtons.classList.add("other-buttons");

  otherButtons.appendChild(leftButton);
  otherButtons.appendChild(downButton);
  otherButtons.appendChild(rightButton);

  controlsButton.appendChild(rotateButton);
  controlsButton.appendChild(otherButtons);
  controlsButton.appendChild(spaceButton);

  mobileButtons.insertBefore(controlsButton, mobileButtons.children[1]);
}

function createButton(parentclassName, className, textContent, clickHandler) {
  const button = document.createElement("button");
  button.classList.add(parentclassName);
  button.classList.add(className);
  button.addEventListener("click", clickHandler);
  button.innerHTML = textContent;
  return button;
}

function removeButton() {
  const controlsButton = document.querySelector(".controls-button");
  if (controlsButton) {
    controlsButton.remove();
  }
}

function changeVisibleGrid() {
  const gridDivs = document.querySelectorAll(".grid > div");
  if (!isGridShowed) {
    gridDivs.forEach((div) => {
      div.classList.add("visible-grid");
    });
  } else {
    gridDivs.forEach((div) => {
      div.classList.remove("visible-grid");
    });
  }
}
