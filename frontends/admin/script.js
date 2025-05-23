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

function changeStoryText(storyId) {
  console.log("changeStoryId", storyId);
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
  const selectedRadioButtonLie = document.querySelector(
    "input[name=lieStory]:checked"
  );
  console.log("revealStories", selectedRadioButtonLie.value);
  socket.emit("revealStories", { storyId: selectedRadioButtonLie.value });
}

function toggleStories() {
  socket.emit("toggleStories");
}
function showL3() {
  socket.emit("showL3");
}

document
  .querySelector(".storyContainer")
  .querySelectorAll("input[type='text']")
  .forEach((input, storyId) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        console.log("changeStoryText", storyId, input.value);
        socket.emit("changeStoryText", { storyId, storyText: input.value });
      }
    });
  });
