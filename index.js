import express from "express";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";
import https from "https";

const port = 3000;

const app = express();
let server;
const publicServer = false;
if (publicServer) {
  //These files are autoupdated every 90 days on tools1
  let options = {
    key: fs.readFileSync("C:/Certbot/live/connect.blrk.io/privkey.pem"),
    cert: fs.readFileSync("C:/Certbot/live/connect.blrk.io/fullchain.pem"),
  };
  server = https.createServer(options, app).listen(port, () => {
    console.log(`Server listening on port ${port} via HTTPS!`);
  });
} else {
  server = http.createServer(app).listen(port, () => {
    console.log(`Server listening on port ${port} via HTTP!`);
  });
}
const io = new Server(server);

app.use(express.static("frontends"));

io.on("connection", (socket) => {
  console.log(
    `${socket.handshake.address} has connected to ${socket.handshake.headers.referer}!`
  );

  socket.on("attachLabel", (data) => {
    console.log("attachLabel: ", data);
    socket.broadcast.emit("attachLabel", data);
  });

  socket.on("hideLabel", (data) => {
    console.log("hideLabel: ", data);
    socket.broadcast.emit("hideLabel", data);
  });

  socket.on("reset", (data) => {
    console.log("resetLabels: ", data);
    socket.broadcast.emit("reset", data);
  });

  socket.on("revealStories", (data) => {
    console.log("revealStories: ", data);
    socket.broadcast.emit("revealStories", data);
  });

  socket.on("showStories", (data) => {
    console.log("showStories: ", data);
    socket.broadcast.emit("showStories", data);
  });

  socket.on("showL3", (data) => {
    console.log("showL3: ", data);
    socket.broadcast.emit("showL3", data);
  });
});
