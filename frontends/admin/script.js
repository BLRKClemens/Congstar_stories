var socket = io();

function attachLabel(storyId) {
  const selectedRadioButton = document.querySelector(
    `input[name="names"]:checked`
  );
  console.log("selected: ", selectedRadioButton);
  socket.emit("attachLabel", {
    storyId: storyId,
    stickerId: selectedRadioButton.value,
  });
}

function hideLabel() {
  const selectedRadioButton = document.querySelector(
    `input[name="names"]:checked`
  );
  console.log("selected: ", selectedRadioButton);
  socket.emit("hideLabel", { stickerId: selectedRadioButton.value });
}

function reset() {
  socket.emit("reset");
}

function revealStories() {
  socket.emit("revealStories");
}

function showStories() {
  socket.emit("showStories");
}
function showL3() {
  socket.emit("showL3");
}
