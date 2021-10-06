// lesson 2( task 1)
// console.log("Record 1"); // синхронное исполнение №1

// setTimeout(() => {
//   // макротаска, исполнение №5
//   console.log("Record 2"); // синхронное исполнение в макротаске, №6
//   Promise.resolve().then(() => {
//     // микротаска в макротаске, исполнение №7
//     setTimeout(() => {
//       // макротаска в микротаске, исполнение №8
//       console.log("Record 3"); // синхронное исполнение в макротаске №9
//       Promise.resolve().then(() => {
//         console.log("Record 4"); // микротаска в макротаске, исполнение №10
//       });
//     });
//   });
// });

// console.log("Record 5"); // синхронное исполнение №2

// Promise.resolve().then(
//   () =>
//     // микротаска, исполнение №3
//     Promise.resolve().then(() => console.log("Record 6")) // микротаска в микротаске, исполнение №4
// );

// вывод в консоль:
// Record 1
// Record 5
// Record 6
// Record 2
// Record 3
// Record 4

// lesson 2( task 2)

// Напишите программу, которая будет принимать на вход несколько аргументов: дату и время в формате
// «час-день-месяц-год». Задача программы — создавать для каждого аргумента таймер с обратным отсчётом:
// посекундный вывод в терминал состояния таймеров (сколько осталось). По истечении какого-либо таймера,
// вместо сообщения о том, сколько осталось, требуется показать сообщение о завершении его работы.
// Важно, чтобы работа программы основывалась на событиях.

const readline = require("readline-sync");
const EventEmitter = require("events");
const emitter = new EventEmitter();


function main() {
  const timer = readline.question(
    'Enter timer value in the format "hour-day-month-year"(13-05-10-2021):'
  );
  const [hour, day, month, year] = timer.split("-");
  const timerStructure = {
    hour,
    day,
    month,
    year,
    minutes: 0,
    seconds: 0,
  };

  if (validationTimer(timerStructure)) {
    console.log("The timer is entered incorrectly! Try again.");
    return;
  }

  

  
  run(timerStructure)
  

  // showTimer(timerStructure);
}

function validationTimer({hour, day, month, year}) {
  console.clear();

  if (!hour || isNaN(+hour) || +hour > 23 || +hour < 0) {
    console.log(`The hour ('${hour}') is specified incorrectly! (PM: 0..23)`);
    return true;
  }
  if (!day || isNaN(+day) || +day > 31 || +day < 0) {
    console.log(`The day ('${day}') is specified incorrectly! (0..31)`);
    return true;
  }
  if (!month || isNaN(+month) || +month > 12 || +month < 0) {
    console.log(`The month ('${month}') is specified incorrectly! (0..12)`);
    return true;
  }
  if (!year || isNaN(+year) || +year > 9999 || +year < 0) {
    console.log(`The year ('${year}') is specified incorrectly! (0..9999)`);
    return true;
  }
}
function showTimer({hour, day, month, year, minutes, seconds}) {
  const timer = `year: ${year} month: ${month} day: ${day} hour: ${hour} minutes: ${minutes} seconds: ${seconds}`;
  console.clear();

  if (hour + day + month + year + minutes + seconds > 0) {
    console.log(timer);
  } else {
    console.log("Time is over!");
    return;
  }
}
function calcSeconds(timerStructure) {

  if( timerStructure.seconds === 0 ) {
    timerStructure.seconds = 59;
    emitter.emit('minutes',  calcMinutes(timerStructure));
    return timerStructure;
  } 
  timerStructure.seconds--;

  return timerStructure;
};
function calcMinutes(timerStructure) {

  if( timerStructure.minutes === 0 ) {
    timerStructure.minutes = 59;
    return timerStructure;
  }
  timerStructure.minutes--;

  return timerStructure;
};
function run(timerStructure) {

  emitter.on('minutes', (timerStructure)=> {
  });
  emitter.on('second', (timerStructure)=> {
    showTimer(timerStructure);
  });
  
  emitter.on('hour', (timerStructure)=> {
    showTimer(timerStructure);
  });
  emitter.on('day', (timerStructure)=> {
    showTimer(timerStructure);
  });
  emitter.on('year', (timerStructure)=> {
    showTimer(timerStructure);
  });
  const interval = setInterval(()=> emitter.emit('second',  calcSeconds(timerStructure)), 50);
  // const interval = setInterval(()=> emitter.emit('second',  'text test'), 500);
};

main();



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
