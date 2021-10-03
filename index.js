// lesson 2( task 1)
console.log("Record 1"); // синхронное исполнение №1

setTimeout(() => {
  // макротаска, исполнение №5
  console.log("Record 2"); // синхронное исполнение в макротаске, №6
  Promise.resolve().then(() => {
    // микротаска в макротаске, исполнение №7
    setTimeout(() => {
      // макротаска в микротаске, исполнение №8
      console.log("Record 3"); // синхронное исполнение в макротаске №9
      Promise.resolve().then(() => {
        console.log("Record 4"); // микротаска в макротаске, исполнение №10
      });
    });
  });
});

console.log("Record 5"); // синхронное исполнение №2

Promise.resolve().then(
  () =>
    // микротаска, исполнение №3
    Promise.resolve().then(() => console.log("Record 6")) // микротаска в микротаске, исполнение №4
);

// вывод в консоль:
// Record 1
// Record 5
// Record 6
// Record 2
// Record 3
// Record 4

// const colors = require("colors");
// const readline = require("readline-sync");

// (function main() {
//   const interval = {
//     beginning: 0,
//     end: 0,
//   };
//   const controlColor = {
//     counterColor: 0,
//     colorsTab: ["green", "yellow", "red"],
//   };
//   const primeNumbers = [];

//   for (const key in interval) {
//     interval[key] = +readline.question(`Enter the ${key} value:`);

//     const check = checkNumber(interval[key]);

//     if (check) {
//       console.log(colors.red(check.textErr));
//       return;
//     }
//   }

//   if (interval.beginning > interval.end) {
//     console.log(
//       colors.red(
//         `The first(${interval.beginning}) number must be greater than the second(${interval.end})!`
//       )
//     );
//     return;
//   }

//   nextPrime: for (let i = interval.beginning; i <= interval.end; i++) {
//     for (let j = 2; j < i; j++) {
//       if (i % j == 0) continue nextPrime;
//     }
//     primeNumbers.push(i);
//   }

//   if (primeNumbers.length !== 0) {
//     primeNumbers.forEach((el) => {
//       console.log(returnColorText(el));
//     });
//   } else {
//     console.log(colors.red("No prime numbers in the range"));
//   }

//   function checkNumber(num) {
//     if (num < 0) {
//       return { textErr: "Numbers must be positive!" };
//     }
//     if (isNaN(num)) {
//       return { textErr: "You entered not a number!" };
//     }
//     return false;
//   }

//   function returnColorText(text) {
//     controlColor.counterColor > 2 ? (controlColor.counterColor = 0) : "";

//     return colors[controlColor.colorsTab[controlColor.counterColor++]](text);
//   }
// })();
