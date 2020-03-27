const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Message from server
socket.on("message", message => {
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Submit message realtime
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit the message to the server
  socket.emit("chatMessage", msg);

  // Clear input text
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Add roomname to DOM
function outputRoomName() {
  roomName.innerText = room;
}

// Add/Update user list to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join("")}
  `;
}
