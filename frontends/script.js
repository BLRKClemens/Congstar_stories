var socket = io();

const storyContainers = Array.from(document.querySelectorAll(".story"));

socket.on("attachLabel", (data) => {
  console.log("attachLabel", data);
  const { storyId, labelId } = data;
});
socket.on("hideLabel", (data) => {});
socket.on("resetLabels", (data) => {});
socket.on("revealStories", (data) => {});
socket.on("showStories", (data) => {});
socket.on("showAddon", (data) => {});
