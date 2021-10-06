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

// task 2, variant 1
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

  initialEmit();

  const interval = setInterval(() => {
    calcTimer(timerStructure, interval);
    showTimer(timerStructure);
  }, 1000);
}
function validationTimer({ hour, day, month, year }) {
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
function showTimer(timerStructure) {
  const { hour, day, month, year, minutes, seconds } = timerStructure;
  const timer = `year: ${year} month: ${month} day: ${day} hour: ${hour} minutes: ${minutes} seconds: ${seconds}`;
  console.clear();

  if (calcTimeIsOver(timerStructure) === 0) {
    console.log("Time is over!");
  } else {
    console.log(timer);
  }
}
function calcTimeIsOver(timerStructure) {
  let sum = 0;
  for (const key in timerStructure) {
    sum += timerStructure[key];
  }
  return sum;
}
function calcTimer(timerStructure, interval) {
  if (calcTimeIsOver(timerStructure) === 0) {
    clearInterval(interval);
    return;
  }

  emitter.emit("seconds", timerStructure);
}
function calcSeconds(timer) {
  if (timer.seconds <= 0) {
    timer.seconds = 59;
    emitter.emit("minutes", timer);
  } else {
    timer.seconds--;
  }
}
function calcMinutes(timer) {
  if (timer.minutes <= 0) {
    timer.minutes = 59;
    emitter.emit("hour", timer);
  } else {
    timer.minutes--;
  }
}
function calcHour(timer) {
  if (timer.hour <= 0) {
    timer.hour = 23;
    emitter.emit("day", timer);
  } else {
    timer.hour--;
  }
}
function calcDay(timer) {
  if (timer.day <= 0) {
    timer.day = 30;
    emitter.emit("month", timer);
  } else {
    timer.day--;
  }
}
function calcMonth(timer) {
  if (timer.month <= 0) {
    timer.month = 11;
    emitter.emit("year", timer);
  } else {
    timer.month--;
  }
}
function calcYear(timer) {
  if (timer.year <= 0) {
    timer.year = 0;
  } else {
    timer.year--;
  }
}
function initialEmit() {
  emitter.on("seconds", (timerStructure) => calcSeconds(timerStructure));
  emitter.on("minutes", (timerStructure) => calcMinutes(timerStructure));
  emitter.on("hour", (timerStructure) => calcHour(timerStructure));
  emitter.on("day", (timerStructure) => calcDay(timerStructure));
  emitter.on("month", (timerStructure) => calcMonth(timerStructure));
  emitter.on("year", (timerStructure) => calcYear(timerStructure));
}

main();


// task 2, variant 2

