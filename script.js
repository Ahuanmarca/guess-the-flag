import { getHints } from './functions/getHints.js'; // -> Array of Strings
import { getCountries } from './functions/getCountries.js'; // -> Array with one or more Objects
import { shuffleArray } from './functions/shuffleArray.js';
import { handleSubmit } from './functions/handleSubmit.js';

const gameState = {
  countries: [],
  correct: [],
  incorrect: [],
  skipped: [],
  country: undefined,
  hints: [],
  validAnswers: [],
  hp: 60,
  correctBonus: 10,
  hintPenalty: 1,
  incorrectPenalty: 5,
  frameRate: 1000 * 60 * 60,

  // METHODS
  resetCountry() {
    this.country = this.countries.pop();
    this.hints.length = 0;
    this.hints.push(...getHints(this.country));
    this.validAnswers.length = 0;
    this.validAnswers.push(...this.country.name);
    const flagImg = document.querySelector('.flag-img');
    flagImg.src = this.country.flags.svg;
    flagImg.alt = this.country.flags.alt;
    document.querySelectorAll('.hint').forEach((d) => (d.innerText = ''));
    // eslint-disable-next-line no-console
    console.log(this.validAnswers);
    // eslint-disable-next-line no-console
    console.log(this.hints);
  },
};

async function runGame() {
  const domPointers = {
    flagImg: document.querySelector('.flag-img'),
    hintDivs: document.querySelectorAll('.hint'),
    userInput: document.querySelector('.guess-input'),
    scoreValue: document.querySelector('.score-value'),
    hpValue: document.querySelector('.hp-value'),
    solutionText: document.querySelector('.solution-text'),
  };

  const data = await getCountries();
  gameState.countries = shuffleArray(data);
  gameState.resetCountry({ ...domPointers });

  document
    .querySelector('.guess-form')
    .addEventListener('submit', (e) =>
      handleSubmit(e, gameState, { ...domPointers })
    );

  const intervalId = setInterval(() => {
    gameState.hp--;
    domPointers.hpValue.innerText = gameState.hp;
    if (gameState.hp <= 0) {
      clearInterval(intervalId);
      alert(`
        GAME OVER!
        Final Score: ${gameState.correct.length}
      `);
    }
  }, gameState.frameRate);
}

runGame();
