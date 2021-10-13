const fs = require("fs");
const readline = require("readline");

const ACCESS_LOG = "./access.log";
const searchIP = ["89.123.1.41", "34.48.240.111"];
const searchIPcounter = { "89.123.1.41": 0, "34.48.240.111": 0 };
const writeStream = {};

const readStream = fs.createReadStream(ACCESS_LOG, {
  flags: "r",
  encoding: "utf-8",
  // readline: 1,
  // start: 0,
  // end: 1024,
  // highWaterMark:  1024,
});
const rl = readline.createInterface({
  input: readStream,
});
searchIP.forEach((el) => {
  writeStream[el] = fs.createWriteStream(`./${el}_requests.log`, {
    encoding: "utf-8",
    flags: "a",
  });
});

readStream.on('open', ()=> console.log('Start...') );
readStream.on('end', ()=> console.log('End') );
readStream.on('error', (err)=> console.log('error', err) );

rl.on("line", (input) => {
  searchIP.forEach((el) => {
    if (input.includes(el)) {
      searchIPcounter[el]++;
      writeStream[el].write(input);
      writeStream[el].write("\n");
    }
  });
});

rl.on("close", () => {
  console.clear();
  console.log("Counter: ");
  for (const key in searchIPcounter) {
    console.log(`${key}: ${searchIPcounter[key]}`);
  }
});




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