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
const moment = require("moment");
require("moment-precise-range-plugin");

// task 2
function main() {
  const dateNow = new Date();
  const [hours, days, months, years] = readline
    .question(
      'Enter timer value in the format "hour-day-month-year"(13-05-10-2021):'
    )
    .split("-");
  const timerStructure = {};

  if (new Date(years, months, days, hours, 0, 0) - dateNow <= 0) {
    console.log("Please enter a date greater than this!");
    return;
  } else {
    if (validationTimer({ hours, days, months, years })) {
      console.log("The timer is entered incorrectly! Try again.");
      return;
    }
  }

  const intervalDate = moment(dateNow).preciseDiff(
    new Date(years, months, days, hours, 0, 0),
    true
  );

  for (const key in intervalDate) {
    if (Object.hasOwnProperty.call(intervalDate, key)) {
      if (key !== "firstDateWasLater") timerStructure[key] = +intervalDate[key]
    }
  }

  initialEmit();

  const interval = setInterval(() => {
    calcTimer(timerStructure, interval);
    showTimer(timerStructure);
  }, 1000);
}
function validationTimer({ hours, days, months, years }) {
  console.clear();

  if (!hours || isNaN(+hours) || +hours > 23 || +hours < 0) {
    console.log(`The hour ('${hours}') is specified incorrectly! (PM: 0..23)`);
    return true;
  }
  if (!days || isNaN(+days) || +days > 31 || +days < 0) {
    console.log(`The day ('${days}') is specified incorrectly! (0..31)`);
    return true;
  }
  if (!months || isNaN(+months) || +months > 11 || +months < 0) {
    console.log(`The month ('${months}') is specified incorrectly! (0..11)`);
    return true;
  }
  if (!years || isNaN(+years) || +years > 9999 || +years < 0) {
    console.log(
      `The year ('${years}') is specified incorrectly! (${new Date().getFullYear()}..9999)`
    );
    return true;
  }
}
function showTimer(timerStructure) {
  const { hours, days, months, years, minutes, seconds } = timerStructure;
  const timer = `year: ${years} month: ${months} day: ${days} hour: ${hours} minutes: ${minutes} seconds: ${seconds}`;
  console.clear();

  if (calcTimeIsOver(timerStructure) === 0) {
    emitter.emit("endTimer");
  } else {
    console.log(timer);
  }
}
function calcTimeIsOver(timerStructure) {
  let sum = 0;
  for (const key in timerStructure) {
    sum += timerStructure[key];
  }
  return +sum;
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
  if (timer.hours <= 0) {
    timer.hours = 23;
    emitter.emit("day", timer);
  } else {
    timer.hours--;
  }
}
function calcDay(timer) {
  if (timer.days <= 0) {
    timer.days = 30;
    emitter.emit("month", timer);
  } else {
    timer.days--;
  }
}
function calcMonth(timer) {
  if (timer.months <= 0) {
    timer.months = 11;
    emitter.emit("year", timer);
  } else {
    timer.months--;
  }
}
function calcYear(timer) {
  if (timer.years <= 0) {
    timer.years = 0;
  } else {
    timer.years--;
  }
}
function initialEmit() {
  emitter.on("seconds", (timerStructure) => calcSeconds(timerStructure));
  emitter.on("minutes", (timerStructure) => calcMinutes(timerStructure));
  emitter.on("hours", (timerStructure) => calcHour(timerStructure));
  emitter.on("days", (timerStructure) => calcDay(timerStructure));
  emitter.on("months", (timerStructure) => calcMonth(timerStructure));
  emitter.on("years", (timerStructure) => calcYear(timerStructure));
  emitter.on("endTimer", () => endTimer());
}
function endTimer() {
  console.log("Time is over!");
}

main();
