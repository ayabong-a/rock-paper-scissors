"use strict";

const MOVES = ["Rock", "Paper", "Scissors"];
const ROUNDS_TO_WIN = 3;

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

  if (choice === "rock" || choice === "r") {
    return "Rock";
  }

  if (choice === "paper" || choice === "p") {
    return "Paper";
  }

  if (choice === "scissors" || choice === "scissor" || choice === "s") {
    return "Scissors";
  }

  return null;
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

  if (BEATS[`${playerSelection}|${computerSelection}`]) {
    return {
      outcome: "win",
      message: `Your ${playerSelection} ${BEATS[`${playerSelection}|${computerSelection}`]} the AI's ${computerSelection}. You win this round!`,
    };
  }

  return {
    outcome: "loss",
    message: `The AI's ${computerSelection} ${BEATS[`${computerSelection}|${playerSelection}`]} your ${playerSelection}. The AI wins this round!`,
  };
}

function game() {
  while (true) {
    const startGame = confirm(
      "WELCOME TO ROCK, PAPER, SCISSORS!\n\n" +
        "A rogue AI is trying to take over the world. " +
        "Beat it by winning 3 rounds!\n\n" +
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
      let playerSelection = null;

      while (playerSelection === null) {
        const input = prompt(
          `ROUND ${roundNumber + 1}\n` +
            `Score — You: ${score.player} | Evil AI: ${score.computer}\n\n` +
            "Choose Rock, Paper or Scissors (R / P / S):",
        );

        if (input === null) {
          gameCancelled = true;
          console.log("The player cancelled the current game.");
          break;
        }

        playerSelection = normalizeChoice(input);

        if (playerSelection === null) {
          alert(
            "That is not a valid move. Please enter Rock, Paper, " +
              "Scissors, R, P or S. This attempt does not count as a round.",
          );
        }
      }

      if (gameCancelled) {
        break;
      }

      const computerSelection = computerPlay();
      const result = playRound(playerSelection, computerSelection);

      roundNumber++;

      if (result.outcome === "win") {
        score.player++;
      } else if (result.outcome === "loss") {
        score.computer++;
      }

      console.log(
        `Round ${roundNumber}: You chose ${playerSelection}; ` +
          `the AI chose ${computerSelection}. ${result.message} ` +
          `Score — You: ${score.player} | Evil AI: ${score.computer}`,
      );

      alert(
        `${result.message}\n\n` +
          `Score — You: ${score.player} | Evil AI: ${score.computer}`,
      );
    }

    if (gameCancelled) {
      alert(
        "You cancelled the current game.\n\n" +
          `Your score: ${score.player} | Evil AI: ${score.computer}`,
      );
    } else if (score.player === ROUNDS_TO_WIN) {
      console.log(
        `GAME OVER: You defeated the Evil AI ${score.player}–${score.computer}!`,
      );

      alert(
        "CONGRATULATIONS! YOU DEFEATED THE EVIL AI!\n\n" +
          `Final score: You ${score.player} — ${score.computer} Evil AI.\n\n` +
          "The world is safe... for now!",
      );
    } else {
      console.log(
        `GAME OVER: The Evil AI won ${score.computer}–${score.player}.`,
      );

      alert(
        "THE EVIL AI HAS WON!\n\n" +
          `Final score: Evil AI ${score.computer} — ${score.player} You.\n\n` +
          "The AI is celebrating. You can challenge it again!",
      );
    }

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
