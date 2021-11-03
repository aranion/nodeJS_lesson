const socket = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 5555;
const users = {};

const server = http.createServer((req, res) => {
  const indexPath = path.join(__dirname, "index.html");
  const readStream = fs.createReadStream(indexPath);
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  readStream.pipe(res);
});

const io = socket(server);

io.on("connection", (client) => {
  console.log("--Connected--");
  users[client.id] = generationName();

  client.on("setUserName", (name) => (users[client.id] = name));

  io.sockets.emit("counterClients", users);

  client.on("checkConnect", () => {
    client.broadcast.emit("checkConnectUser", users[client.id]);
  });

  client.on("client-msg", ({ message }) => {
    const data = {
      name: users[client.id],
      message: message.split("").reverse().join(""),
    };
    client.broadcast.emit("server-msg", data);
    client.emit("server-msg", data);
  });

  client.on("disconnect", () => {
    console.log("-----disconnect-----");
    const disconnectUserName = users[client.id];
    delete users[client.id];

    client.broadcast.emit("counterClients", users);
    client.broadcast.emit("checkDisconnectUser", disconnectUserName);
  });
  client.on("disconnectButton", () => {
    client.disconnect();
  });
});

function generationName() {
  return "Anonym" + Math.round(Math.random() * 100);
}

server.listen(port);
