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

  if (
    score.player >= POINTS_TO_WIN ||
    score.computer >= POINTS_TO_WIN
  ) {
    gameOver = true;

    gameResultDisplay.textContent =
      score.player >= POINTS_TO_WIN
        ? "You reached 5 points! You defeated the Evil AI!"
        : "The Evil AI reached 5 points and won the game!";

    setMoveButtonsDisabled(true);
  }
}

function resetGame() {
  score.player = 0;
  score.computer = 0;
  roundNumber = 0;
  gameOver = false;

  updateScoreDisplay();

  roundResultDisplay.textContent = "Choose a move to start playing.";
  gameResultDisplay.textContent = "";

  setMoveButtonsDisabled(false);
}

// Each button supplies its own move through its data-move attribute.
moveButtons.forEach((button) => {
  button.addEventListener("click", () => {
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