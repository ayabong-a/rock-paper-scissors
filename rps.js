"use strict";

const MOVES = ["Rock", "Paper", "Scissors"];
const ROUNDS_TO_WIN = 3;

const CHOICE_ALIASES = {
  rock: "Rock",
  r: "Rock",
  paper: "Paper",
  p: "Paper",
  scissors: "Scissors",
  scissor: "Scissors",
  s: "Scissors",
};

const BEATS = {
  "Rock|Scissors": "crushes",
  "Paper|Rock": "covers",
  "Scissors|Paper": "cuts",
};

function computerPlay() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function normalizeChoice(input) {
  if (typeof input !== "string") {
    return null;
  }

  const choice = input.trim().toLowerCase().replace(/\s+/g, "");

  return Object.hasOwn(CHOICE_ALIASES, choice)
    ? CHOICE_ALIASES[choice]
    : null;
}

function formatScore(score) {
  return `Score — You: ${score.player} | Evil AI: ${score.computer}`;
}

function playRound(playerSelection, computerSelection) {
  if (!MOVES.includes(playerSelection) || !MOVES.includes(computerSelection)) {
    return {
      outcome: "invalid",
      message: "Invalid selection. No round was played.",
    };
  }

  if (playerSelection === computerSelection) {
    return {
      outcome: "draw",
      message: `You both chose ${playerSelection}. It's a draw! No points awarded.`,
    };
  }

  const winningAction = BEATS[`${playerSelection}|${computerSelection}`];

  if (winningAction) {
    return {
      outcome: "win",
      message: `Your ${playerSelection} ${winningAction} the AI's ${computerSelection}. You win this round!`,
    };
  }

  const losingAction = BEATS[`${computerSelection}|${playerSelection}`];

  return {
    outcome: "loss",
    message: `The AI's ${computerSelection} ${losingAction} your ${playerSelection}. The AI wins this round!`,
  };
}

function showGameResult(score, gameCancelled) {
  if (gameCancelled) {
    alert(`You cancelled the current game.\n\n${formatScore(score)}`);
    return;
  }

  const playerWon = score.player === ROUNDS_TO_WIN;

  const heading = playerWon
    ? "CONGRATULATIONS! YOU DEFEATED THE EVIL AI!"
    : "THE EVIL AI HAS WON!";

  const closingMessage = playerWon
    ? "The world is safe... for now!"
    : "The AI is celebrating. You can challenge it again!";

  console.log(`GAME OVER: ${heading} ${formatScore(score)}`);

  alert(`${heading}\n\n${formatScore(score)}\n\n${closingMessage}`);
}

function game() {
  while (true) {
    const startGame = confirm(
      "WELCOME TO ROCK, PAPER, SCISSORS!\n\n" +
        "A rogue AI is trying to take over the world. " +
        `Beat it by winning ${ROUNDS_TO_WIN} rounds!\n\n` +
        "HOW TO PLAY\n" +
        "Type Rock, Paper or Scissors. You can also type R, P or S.\n" +
        "Your choice is not case-sensitive. Invalid attempts do not count.\n" +
        "Draws do not award points.\n" +
        "Press Cancel during a move prompt to stop the current game.\n\n" +
        "YOUR RESULTS\n" +
        "Round results and scores will appear in pop-up messages. " +
        "The browser console will also show the full game log.\n\n" +
        "To open the console in Chrome or Edge on Windows, " +
        "press Ctrl + Shift + J.\n\n" +
        "Want to play later? Open the browser console, type game(), " +
        "and press Enter to restart the game without refreshing the page.\n\n" +
        "Click OK to start playing, or Cancel for more options.",
    );

    if (!startGame) {
      const tryAgain = confirm(
        "You chose not to start the game.\n\n" +
          "Would you like to return to the instructions?\n\n" +
          "Click OK to try again, or Cancel to exit.",
      );

      if (tryAgain) {
        continue;
      }

      console.log("The player exited without starting the game.");
      return;
    }

    const score = { player: 0, computer: 0 };
    let roundNumber = 0;
    let gameCancelled = false;

    while (score.player < ROUNDS_TO_WIN && score.computer < ROUNDS_TO_WIN) {
      const input = prompt(
        `ROUND ${roundNumber + 1}\n` +
          `${formatScore(score)}\n\n` +
          "Choose Rock, Paper or Scissors (R / P / S):",
      );

      if (input === null) {
        gameCancelled = true;
        console.log("The player cancelled the current game.");
        break;
      }

      const playerSelection = normalizeChoice(input);

      if (playerSelection === null) {
        alert(
          "That is not a valid move. Please enter Rock, Paper, " +
            "Scissors, R, P or S. This attempt does not count as a round.",
        );
        continue;
      }

      const computerSelection = computerPlay();
      const result = playRound(playerSelection, computerSelection);

      roundNumber++;

      if (result.outcome === "win") {
        score.player++;
      } else if (result.outcome === "loss") {
        score.computer++;
      }

      const roundSummary = `${result.message}\n\n${formatScore(score)}`;

      console.log(
        `Round ${roundNumber}: You chose ${playerSelection}; ` +
          `the AI chose ${computerSelection}.\n${roundSummary}`,
      );

      alert(roundSummary);
    }

    showGameResult(score, gameCancelled);

    const playAgain = confirm(
      "Would you like to play another game?\n\n" +
        "Click OK to return to the instructions, or Cancel to exit.",
    );

    if (!playAgain) {
      console.log("The player exited the game.");

      alert(
        "Thanks for playing! You can return anytime by typing game() " +
          "into the browser console and pressing Enter.",
      );

      return;
    }
  }
}

window.addEventListener("load", game);