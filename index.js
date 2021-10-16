#!/usr/bin/env node

const fs = require("fs");
const fsPromises = require("fs/promises");
const readline = require("readline");
const path = require("path");
const inquirer = require("inquirer");

const executorDir = process.cwd();
// перечень всей дирриктории
// const list = fs.readdirSync(__dirname);
const isFile = (fileName) => fs.lstatSync(fileName).isFile();
// const list = fs.readdirSync(__dirname).filter(isFile);
const list = fs.readdirSync(executorDir).filter(isFile);
// console.log(list);

inquirer
  .prompt([
    {
      name: "fileName",
      type: "list",
      message: "Choose a file to read",
      choices: list,
    },
  ])
  .then((answer) => answer.fileName)
  .then((fileName) => {
    const fullPatch = path.join(executorDir, fileName);
    const data = fs.readFileSync(fullPatch, "utf-8");

    console.log(data);
  });

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// // rl.question('Please enter path to the file:', pathToFile => {
// //   const filePath = path.join(__dirname, pathToFile);
// //   console.log('pathToFile', pathToFile);
// //   console.log('filePath', filePath);

// //   fs.readFile(filePath, 'utf-8', (err, data) => {
// //     if (data === undefined) console.log('Files not found...');
// //     else console.log(data);
// //   });
// //   rl.close();
// // });

// const question = async (query) =>
//   new Promise((resolve) => rl.question(query, resolve));

// (async () => {
//   try {
//     const pathToFile =
//       (await question("Please enter path to the file:")) || "./access2.log";
//     const encode = (await question("Please enter encode:")) || "utf-8";
//     const filePath = path.join(__dirname, pathToFile);
//     // через fsPromises
//     const data = await fsPromises.readFile(filePath, encode);
//     console.log(data);
//     rl.close();

//     // fs.readFile(filePath, encode, (err, data)=> {
//     //   if (data === undefined) console.log('Files not found...');
//     //   else console.log(data);
//     // })
//   } catch (error) {
//     console.log(error);
//     rl.close();
//   }
// })();

// const ACCESS_LOG = "./access.log";
// const searchIP = ["89.123.1.41", "34.48.240.111"];
// const searchIPcounter = { "89.123.1.41": 0, "34.48.240.111": 0 };
// const writeStream = {};

// const readStream = fs.createReadStream(ACCESS_LOG, {
//   flags: "r",
//   encoding: "utf-8",
//   // readline: 1,
//   // start: 0,
//   // end: 1024,
//   // highWaterMark:  1024,
// });
// const rl = readline.createInterface({
//   input: readStream,
// });
// searchIP.forEach((el) => {
//   writeStream[el] = fs.createWriteStream(`./${el}_requests.log`, {
//     encoding: "utf-8",
//     flags: "a",
//   });
// });

// readStream.on('open', ()=> console.log('Start...') );
// readStream.on('end', ()=> console.log('End') );
// readStream.on('error', (err)=> console.log('error', err) );

// rl.on("line", (input) => {
//   searchIP.forEach((el) => {
//     if (input.includes(el)) {
//       searchIPcounter[el]++;
//       writeStream[el].write(input);
//       writeStream[el].write("\n");
//     }
//   });
// });

// rl.on("close", () => {
//   console.clear();
//   console.log("Counter: ");
//   for (const key in searchIPcounter) {
//     console.log(`${key}: ${searchIPcounter[key]}`);
//   }
// });

// readStream.on("data", (chunk) => {
//   console.log(chunk);
//   console.log('-----');
// });
// readStream.on("end", () => console.log("Finished!"));
// readStream.on("error", (err) => console.log("error!", err));

// // requests.forEach((log) => {
// //   writeStream.write(log);
// //   writeStream.write("\n");
// // });
