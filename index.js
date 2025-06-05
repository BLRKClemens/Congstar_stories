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
function initStickerMap(stickerNumber) {
  return [
    new Array(stickerNumber).fill(0),
    new Array(stickerNumber).fill(0),
    new Array(stickerNumber).fill(0),
  ];
}
const stickerNumber = 2;

const serverData = {
  storiesVisible: false,
  l3Visible: false,
  storiesRevealed: false,
  lieStoryId: 0,
  stickerNumber,
  stickerMapRevealed: initStickerMap(stickerNumber),
  storyTexts: ["Story 1", "Story 2", "Story 3"],
};

io.on("connection", (socket) => {
  console.log(
    `${socket.handshake.address} has connected to ${socket.handshake.headers.referer}!`
  );

  socket.emit("serverData", serverData);

  socket.on("attachLabel", (data) => {
    console.log("attachLabel: ", data);
    const { storyId, stickerId } = data;
    serverData.stickerMapRevealed.forEach((story) => {
      story[stickerId] = 0;
    });
    serverData.stickerMapRevealed[storyId][stickerId] = 1;
    socket.broadcast.emit("attachLabel", data);
  });

  socket.on("hideLabel", (data) => {
    console.log("hideLabel: ", data);
    const { stickerId } = data;
    serverData.stickerMapRevealed.forEach((story) => {
      story[stickerId] = 0;
    });
    socket.broadcast.emit("hideLabel", data);
  });

  socket.on("reset", (data) => {
    console.log("resetLabels: ", data);
    serverData.storiesRevealed = false;
    serverData.l3Visible = false;

    serverData.stickerMapRevealed = initStickerMap(stickerNumber);

    socket.broadcast.emit("reset", data);
  });

  socket.on("revealStories", (data) => {
    console.log("revealStories: ", data);
    const { storyId } = data;

    serverData.storiesRevealed = true;
    serverData.lieStoryId = storyId;

    socket.broadcast.emit("revealStories", data);
  });

  socket.on("toggleStories", (data) => {
    console.log("toggleStories: ", data);
    serverData.storiesVisible = serverData.storiesVisible ? false : true;
    socket.broadcast.emit("toggleStories", data);
  });

  socket.on("showL3", (data) => {
    serverData.l3Visible = serverData.l3Visible ? false : true;
    console.log("showL3: ", data);
    socket.broadcast.emit("showL3", data);
  });

  socket.on("changeStoryText", (data) => {
    console.log("changeStoryText", data);
    const { storyId, storyText } = data;
    serverData.storyTexts[storyId] = storyText;
    socket.broadcast.emit("changeStoryText", data);
  });
});
