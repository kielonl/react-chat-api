const chatForm = document.getElementById(`chat-form`);
const chatMessages = document.querySelector(`.chat-messages`);
const socket = io();
const roomName = document.getElementById(`room-name`);
const userList = document.getElementById(`users`);

//nazwa uzytkownika i pokoju z url
const { username, room, ulrid } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit(`joinRoom`, { username, room });

console.log(username, room);
//wiadomosc z servera
socket.on(`wiadomosc`, (wiadomosc) => {
  console.log(wiadomosc);
  outputMessage(wiadomosc);

  //automatyczne obnizanie chatu
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//wysylanie wiadomosci

chatForm.addEventListener(`submit`, (e) => {
  e.preventDefault();

  //znajdywanie wiadomosci
  const msg = e.target.elements.msg.value;

  //emit do servera
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = ``;
  e.target.elements.msg.focus();
});

//oddaj wiadomosc
function outputMessage(wiadomosc) {
  const div = document.createElement(`div`);
  div.classList.add(`wiadomosc`);
  div.innerHTML = `<p class="meta"><img src=${ulrid} class="small">${wiadomosc.username}<span>${wiadomosc.time}</span></p>
						<p class="text">
							${wiadomosc.text}
						</p>`;
  document.querySelector(`.chat-messages`).appendChild(div);
}

// zdobadz pokoj i uzytkownikow
socket.on(`roomUsers`, ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// dodaj nazwe pokoju
function outputRoomName(room) {
  roomName.innerText = room;
}
// dodaj uzytkownikow
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join(``)}`;
}
