#!/usr/bin/env node

// Запрос вида "reade -p C:/Users/Aranion/Desktop/Учеба/nodeJS/lesson_1 -s '89.123.1.41'"
// открывает директорию  "C:/Users/Aranion/Desktop/Учеба/nodeJS/lesson_1"
// ищет в открываемых файлах строки с текстом '89.123.1.41'
// * тестировалось на Windows 10

const readline = require("readline");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");
const inquirer = require("inquirer");
const colors = require("colors");

// Объявление параметров для запроса -p и -s
const optionsYargs = yargs
  .usage("Usage: -p <path> to file")
  .options("p", {
    alias: "path",
    describe: "Path to file",
    type: "string",
    demandOption: false,
  })
  .options("s", {
    alias: "search",
    describe: "Search for text in a file",
    type: "string",
    demandOption: false,
  }).argv;

// Если параметр -p не задан, используется путь по умолчанию
let executorDir = optionsYargs.path || process.cwd();
const searchText = optionsYargs.search;

const isFile = (fileName) => fs.lstatSync(fileName).isFile();
const getList = (executorDir) => {
  const list = [".", ".."];
  fs.readdirSync(executorDir).map((el) => list.push(el));
  return list;
};

const selectFileName = (list) => {
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

      console.clear();

      // Проверка является ли выбранное значение файлом или директорией
      if (isFile(fullPatch)) {
        if (searchText) searchInFile(fullPatch, searchText);
        else console.log(fs.readFileSync(fullPatch, "utf-8"));
      } else {
        executorDir = fullPatch;
        // Запуск повторно для выбора директории
        selectFileName(getList(executorDir));
      }
    })
    .catch((err) => console.log(err));
};

selectFileName(getList(executorDir));

// Поиск по файлу и вывод строки в консоль
const searchInFile = (pathToFile, searchText) => {
  let counterSearch = 0;
  const readStream = fs.createReadStream(pathToFile, {
    flags: "r",
    encoding: "utf-8",
  });
  
  readStream.on("open", () => console.log(`Start search <${searchText}>...`));
  readStream.on("error", (err) => console.log("error", err));

  const rl = readline.createInterface({
    input: readStream,
  });

  rl.on("line", (input) => {
    if (input.includes(searchText)) {
      counterSearch++;
      console.log(colors.green(input)); 
    }
  });
  rl.on("close", () => {
    console.log(`Search counter <${searchText}>: ${counterSearch} шт.`);
  });
};



// Код с урока...

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