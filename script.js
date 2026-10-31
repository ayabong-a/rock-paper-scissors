"use strict";

const MOVES = ["Rock", "Paper", "Scissors"];
const POINTS_TO_WIN = 5;

const BEATS = {
  "Rock|Scissors": "crushes",
  "Paper|Rock": "covers",
  "Scissors|Paper": "cuts",
};

const score = {
  player: 0,
  computer: 0,
};

let roundNumber = 0;
let gameOver = false;
let confettiTimer = null;

// Find the HTML elements.
const moveButtons = document.querySelectorAll(".move-button");
const playerScoreDisplay = document.querySelector("#player-score");
const computerScoreDisplay = document.querySelector("#computer-score");
const winningScoreDisplay = document.querySelector("#winning-score");
const roundResultDisplay = document.querySelector("#round-result");
const gameResultDisplay = document.querySelector("#game-result");
const restartButton = document.querySelector("#restart-button");

winningScoreDisplay.textContent = POINTS_TO_WIN;

function computerPlay() {
  const randomIndex = Math.floor(Math.random() * MOVES.length);
  return MOVES[randomIndex];
}

function playRound(playerSelection, computerSelection) {
  if (
    !MOVES.includes(playerSelection) ||
    !MOVES.includes(computerSelection)
  ) {
    return {
      outcome: "invalid",
      message: "Invalid selection. No round was played.",
    };
  }

  if (playerSelection === computerSelection) {
    return {
      outcome: "draw",
      message:
        `You both chose ${playerSelection}. ` +
        "It's a draw! No points awarded.",
    };
  }

  const winningAction =
    BEATS[`${playerSelection}|${computerSelection}`];

  if (winningAction) {
    return {
      outcome: "win",
      message:
        `Your ${playerSelection} ${winningAction} ` +
        `the AI's ${computerSelection}. You win this round!`,
    };
  }

  const losingAction =
    BEATS[`${computerSelection}|${playerSelection}`];

  return {
    outcome: "loss",
    message:
      `The AI's ${computerSelection} ${losingAction} ` +
      `your ${playerSelection}. The AI wins this round!`,
  };
}

function updateScoreDisplay() {
  playerScoreDisplay.textContent = score.player;
  computerScoreDisplay.textContent = score.computer;
}

function setMoveButtonsDisabled(disabled) {
  moveButtons.forEach((button) => {
    button.disabled = disabled;
  });
}

function clearConfetti() {
  clearTimeout(confettiTimer);
  confettiTimer = null;

  document.querySelectorAll(".confetti-layer").forEach((layer) => {
    layer.remove();
  });
}

function throwConfetti(isFinalWin = false) {
  clearConfetti();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  layer.setAttribute("aria-hidden", "true");

  const colors = [
    "#facc15",
    "#38bdf8",
    "#f472b6",
    "#4ade80",
    "#a78bfa",
  ];

  const pieceCount = isFinalWin ? 180 : 35;
  const baseSize = isFinalWin ? 10 : 4;

  // Slow falling confetti.
  const baseDuration = isFinalWin ? 8000 : 6000;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;

    piece.style.setProperty(
      "--size",
      `${baseSize + Math.random() * 4}px`,
    );

    piece.style.setProperty(
      "--color",
      colors[Math.floor(Math.random() * colors.length)],
    );

    piece.style.setProperty(
      "--duration",
      `${baseDuration + Math.random() * 1000}ms`,
    );

    piece.style.setProperty(
      "--drift",
      `${Math.random() * 300 - 150}px`,
    );

    piece.style.setProperty(
      "--rotation",
      `${Math.random() * 1080 - 540}deg`,
    );

    layer.appendChild(piece);
  }

  document.body.appendChild(layer);

  confettiTimer = setTimeout(clearConfetti, baseDuration + 1100);
}

function updateGame(result) {
  if (result.outcome === "invalid") {
    roundResultDisplay.textContent = result.message;
    return;
  }

  roundNumber++;

  if (result.outcome === "win") {
    score.player++;
  } else if (result.outcome === "loss") {
    score.computer++;
  }

  updateScoreDisplay();

  roundResultDisplay.textContent =
    `Round ${roundNumber}: ${result.message}`;

  const playerWonGame = score.player >= POINTS_TO_WIN;
  const computerWonGame = score.computer >= POINTS_TO_WIN;

  if (playerWonGame || computerWonGame) {
    gameOver = true;

    gameResultDisplay.textContent = playerWonGame
      ? `You reached ${POINTS_TO_WIN} points! You defeated the Evil AI!`
      : `The Evil AI reached ${POINTS_TO_WIN} points and won the game!`;

    setMoveButtonsDisabled(true);
  }

  if (result.outcome === "win") {
    throwConfetti(playerWonGame);
  }
}

function resetGame() {
  clearConfetti();

  score.player = 0;
  score.computer = 0;
  roundNumber = 0;
  gameOver = false;

  updateScoreDisplay();

  roundResultDisplay.textContent = "Choose a move to start playing.";
  gameResultDisplay.textContent = "";

  setMoveButtonsDisabled(false);
}

// Play one round whenever the player clicks a move button.
moveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Immediately remove confetti from the previous round.
    clearConfetti();

    if (gameOver) {
      return;
    }

    const playerSelection = button.dataset.move;
    const computerSelection = computerPlay();
    const result = playRound(playerSelection, computerSelection);

    updateGame(result);
  });
});

restartButton.addEventListener("click", resetGame);