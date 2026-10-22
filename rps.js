'use strict';

const MOVES = ['Rock', 'Paper', 'Scissors'];
const ROUNDS_TO_WIN = 3;

const BEATS = {
  'Rock|Scissors': 'crushes',
  'Paper|Rock': 'covers',
  'Scissors|Paper': 'cuts'
};

function computerPlay() {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

function normalizeChoice(input) {
  if (typeof input !== 'string') {
    return null;
  }

  const choice = input.trim().toLowerCase().replace(/\s+/g, '');

  if (choice === 'rock' || choice === 'r') {
    return 'Rock';
  }

  if (choice === 'paper' || choice === 'p') {
    return 'Paper';
  }

  if (choice === 'scissors' || choice === 'scissor' || choice === 's') {
    return 'Scissors';
  }

  return null;
}

function playRound(playerSelection, computerSelection) {
  if (playerSelection === computerSelection) {
    return {
      outcome: 'draw',
      message: `You both chose ${playerSelection}. It's a draw! No points awarded.`
    };
  }

  if (BEATS[`${playerSelection}|${computerSelection}`]) {
    return {
      outcome: 'win',
      message: `Your ${playerSelection} ${BEATS[`${playerSelection}|${computerSelection}`]} the AI's ${computerSelection}. You win this round!`
    };
  }

  return {
    outcome: 'loss',
    message: `The AI's ${computerSelection} ${BEATS[`${computerSelection}|${playerSelection}`]} your ${playerSelection}. The AI wins this round!`
  };
}

function game() {
  alert(
    'WELCOME TO ROCK, PAPER, SCISSORS!\n\n' +
    'A rogue AI is trying to take over the world. Beat it by winning 3 rounds!\n\n' +
    'Type Rock, Paper or Scissors. You can also type R, P or S.\n' +
    'Your choice is not case-sensitive. Invalid attempts do not count.\n' +
    'Press Cancel at any time to stop the game safely.\n\n' +
    'Your results will appear in pop-up messages. You can also view the full results in the browser console.\n\n' +
    'To open the console in Chrome or Edge on Windows, press Ctrl + Shift + J.'
  );

  const score = { player: 0, computer: 0 };
  let roundNumber = 0;

  while (score.player < ROUNDS_TO_WIN && score.computer < ROUNDS_TO_WIN) {
    let playerSelection = null;

    while (playerSelection === null) {
      const input = prompt(
        `ROUND ${roundNumber + 1}\n` +
        `Score — You: ${score.player} | Evil AI: ${score.computer}\n\n` +
        'Choose Rock, Paper or Scissors (R / P / S):'
      );

      if (input === null) {
        console.log('The player cancelled the game.');
        alert('You cancelled the game. Thanks for playing!');
        return;
      }

      playerSelection = normalizeChoice(input);

      if (playerSelection === null) {
        alert('That is not a valid move. Please enter Rock, Paper, Scissors, R, P or S. This attempt does not count as a round.');
      }
    }

    const computerSelection = computerPlay();
    const result = playRound(playerSelection, computerSelection);

    roundNumber++;

    if (result.outcome === 'win') {
      score.player++;
    } else if (result.outcome === 'loss') {
      score.computer++;
    }

    console.log(
      `Round ${roundNumber}: You chose ${playerSelection}; the AI chose ${computerSelection}. ` +
      `${result.message} Score — You: ${score.player} | Evil AI: ${score.computer}`
    );

    alert(
      `${result.message}\n\n` +
      `Score — You: ${score.player} | Evil AI: ${score.computer}`
    );
  }

  if (score.player === ROUNDS_TO_WIN) {
    console.log(`GAME OVER: You defeated the Evil AI ${score.player}–${score.computer}!`);
    alert(
      `CONGRATULATIONS! YOU DEFEATED THE EVIL AI!\n\n` +
      `Final score: You ${score.player} — ${score.computer} Evil AI.\n\n` +
      'The world is safe... for now!'
    );
  } else {
    console.log(`GAME OVER: The Evil AI won ${score.computer}–${score.player}.`);
    alert(
      `THE EVIL AI HAS WON!\n\n` +
      `Final score: Evil AI ${score.computer} — ${score.player} You.\n\n` +
      'The AI is celebrating. Refresh the page to try again!'
    );
  }
}

window.addEventListener('load', game);