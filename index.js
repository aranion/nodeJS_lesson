const colors = require("colors");
const readline = require("readline-sync");

(function main() {
  const interval = {
    first: 0,
    second: 0,
  };
  const controlColor = {
    counterColor: 0,
    colorsTab: ["green", "yellow", "red"],
  };
  const primeNumbers = [];

  for (const key in interval) {
    interval[key] = +readline.question(`Enter the ${key} value:`);

    if (interval.first < 0 || interval.second < 0) {
      console.log(colors.red(`Numbers must be positive!`));
      return;
    }
    if (isNaN(interval[key])) {
      console.log(colors.red("You entered not a number!"));
      return;
    }
  }

  if (interval.first > interval.second) {
    console.log(
      colors.red(
        `The first(${interval.first}) number must be greater than the second(${interval.second})!`
      )
    );
    return;
  }

  nextPrime: for (let i = interval.first; i <= interval.second; i++) {
    for (let j = 2; j < i; j++) {
      if (i % j == 0) continue nextPrime;
    }
    primeNumbers.push(i);
  }

  if (primeNumbers.length !== 0) {
    primeNumbers.forEach((el) => {
      console.log(returnColorText(el));
    });
  } else {
    console.log(colors.red("No prime numbers in the range"));
  }

  function returnColorText(text) {
    controlColor.counterColor > 2 ? (controlColor.counterColor = 0) : "";

    return colors[controlColor.colorsTab[controlColor.counterColor++]](text);
  }
})();
