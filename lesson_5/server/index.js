const http = require("http");
const fs = require("fs");
const path = require("path");
const { lstatSync } = require("fs");
const fsPromises = require("fs/promises");

const PORT = 8080;
let currentDir = process.cwd();
let list = [];
let items = [];

class ListItem {
  constructor(path, fileName) {
    (this.path = path),
      (this.fileName = fileName),
      (this.typeFolder = this.isDir);
  }
  get isDir() {
    return lstatSync(this.path).isDirectory();
  }
}

const run = async () => {
  list = await fsPromises.readdir(currentDir);
  items = (await fsPromises.readdir(currentDir)).map((fileName) => {
    return new ListItem(path.join(currentDir, fileName), fileName);
  });
  items = [
    ...items,
    { path: path.join(currentDir, ".."), fileName: "..", typeFolder: true },
    { path: path.join(currentDir, "."), fileName: ".", typeFolder: true },
  ];
};

async function getDataFile(item) {
  if (await item.typeFolder) {
    currentDir = item.path;
    run();
    return;
  } else {
    return await fsPromises.readFile(item.path, "utf-8");
  }
}

const server = http.createServer((req, res) => {
  run();

  res.setHeader("Content-Type", "text/html; charset=utf-8;");

  if (req.url === "/style.css") {
    res.writeHead(200, {
      "Content-Type": "text/css",
      Expires: "0",
    });
    fs.createReadStream(path.resolve(__dirname, "../style.css")).pipe(res);
  } else if (req.url === "/explorer.js") {
    res.writeHead(200, {
      "Content-Type": "script/js",
      Expires: "0",
    });
    fs.createReadStream(path.resolve(__dirname, "../explorer.js")).pipe(res);
  } else if (req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html",
      Expires: "0",
    });
    fs.createReadStream(path.resolve(__dirname, "../index.html")).pipe(res);
  } else if (req.url == "/fullPath") {
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(currentDir));
  } else if (req.url == "/listItemsName") {
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(items));
  } else if (req.url == "/targetName") {
    if (req.method === "POST") {
      let data = "";

      req.on("data", (chang) => (data += chang));
      req.on("end", () => {
        const item = items.find(
          (el) => el.fileName === JSON.parse(data).trim()
        );
        getDataFile(item).then((data) => {
          res.setHeader("Content-type", "text/html; charset=utf-8;");
          res.end(data);
        });
      });
    }
  } else {
    res.write("<h2>" + req.url + " Not found</h2>");
  }
});

server.listen(PORT, "localhost", () => {
  console.log("Server started!");
});
