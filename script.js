const cells = document.querySelectorAll(".cell");
const statusDisplay = document.getElementById("status");
const resetButton = document.getElementById("resetBtn");
const toggleMode = document.getElementById("toggleMode");
const playerXWinsEl = document.getElementById("playerXWins");
const playerOWinsEl = document.getElementById("playerOWins");
const drawsEl = document.getElementById("draws");
const playerXLabel = document.getElementById("playerXLabel");
const playerOLabel = document.getElementById("playerOLabel");
const playerXNameInput = document.getElementById("playerXName");
const playerONameInput = document.getElementById("playerOName");
const updateNamesBtn = document.getElementById("updateNamesBtn");
const moveHistoryList = document.getElementById("moveHistory");
const historySidebar = document.getElementById("historySidebar");
const toggleHistoryBtn = document.getElementById("toggleHistoryBtn");
const closeHistoryBtn = document.getElementById("closeHistoryBtn");


let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "Player";
let isAIEnabled = false;
let gameActive = true;
let playerXWins = 0;
let playerOWins = 0;
let draws = 0;
let playerXName = "Player X";
let playerOName = "Player O";
let moveHistory = [];

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
function updateScoreboard() {
    playerXWinsEl.textContent = playerXWins;
    playerOWinsEl.textContent = playerOWins;
    drawsEl.textContent = draws;
  }
  
  function handleWinner() {
    if (checkWinner()) {
        if (currentPlayer === "X") {
          playerXWins++;
          statusDisplay.textContent = `${playerXName} wins! 🎉`;
        } else {
          playerOWins++;
          statusDisplay.textContent = `${playerOName} wins! 🎉`;
        }
        updateScoreboard();
        gameActive = false;
        return true;
      }
    
      if (board.every((cell) => cell !== "")) {
        draws++;
        statusDisplay.textContent = "It's a draw! 🤝";
        updateScoreboard();
        gameActive = false;
        return true;
      }
    
      return false;
    }

  updateNamesBtn.addEventListener("click", () => {
    const newPlayerXName = playerXNameInput.value.trim();
    const newPlayerOName = playerONameInput.value.trim();
  
    if (newPlayerXName) {
      playerXName = newPlayerXName;
      playerXLabel.textContent = playerXName;
    }
  
    if (newPlayerOName) {
      playerOName = newPlayerOName;
      playerOLabel.textContent = playerOName;
    }
  
    // Update the status display with the new player names
    statusDisplay.textContent = `${playerXName}'s turn`;
  
    // Clear input fields
    playerXNameInput.value = "";
    playerONameInput.value = "";
  });

  function updateMoveHistory(player, index) {
    const row = Math.floor(index / 3) + 1; // Row: 1-based
    const col = (index % 3) + 1; // Column: 1-based
    moveHistory.push({ player, index });
  
  // Display formatted move
    const listItem = document.createElement("li");
    listItem.textContent = `${player} played on cell ${row}-${col}`;
    moveHistoryList.appendChild(listItem);
}

function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute("data-index");

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  updateMoveHistory(currentPlayer, index);

  if (handleWinner()) return;

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.textContent = `${currentPlayer === "X" ? playerXName : playerOName}'s turn`;

  if (isAIEnabled && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

resetGame();

function checkWinner() {
  return winningConditions.some((combination) =>
    combination.every((index) => board[index] === currentPlayer)
  );
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  cells.forEach((cell) => (cell.textContent = ""));
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function aiMove() {
  const emptyCells = board
    .map((value, index) => (value === "" ? index : null))
    .filter((value) => value !== null);

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = currentPlayer;
  cells[randomIndex].textContent = currentPlayer;

  if (checkWinner()) {
    statusDisplay.textContent = `${currentPlayer} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (board.every((cell) => cell !== "")) {
    statusDisplay.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

toggleMode.addEventListener("click", () => {
  isAIEnabled = !isAIEnabled;
  toggleMode.textContent = isAIEnabled
    ? "Switch to Two-Player Mode"
    : "Switch to AI Mode";
  resetGame();
});

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);

resetGame();

toggleHistoryBtn.addEventListener("click", () => {
    historySidebar.classList.toggle("sidebar-open");
  });
  
  closeHistoryBtn.addEventListener("click", () => {
    historySidebar.classList.remove("sidebar-open");
  });

  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    cells.forEach((cell) => (cell.textContent = ""));
    statusDisplay.textContent = `Player ${currentPlayer === "X" ? playerXName : playerOName}'s turn`;
  
    // Clear Move History
    moveHistory = [];
    moveHistoryList.innerHTML = "";
  }