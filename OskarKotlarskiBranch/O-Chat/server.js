const path = require(`path`);
const http = require(`http`);
const express = require(`express`);
const socketio = require(`socket.io`);
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require(`./utility/wiadomosci`);
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require(`./utility/users`);

// folder statyczny
app.use(express.static(path.join(__dirname, `public`)));

const botName = `O-Chat bot`;

io.on(`connection`, (socket) => {
  socket.on(`joinRoom`, ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    console.log(`nowe polaczenie`);

    socket.emit(`wiadomosc`, formatMessage(botName, `witam w O-chat!`));

    //polaczenie
    socket.broadcast
      .to(user.room)
      .emit(
        `wiadomosc`,
        formatMessage(botName, `Uzytkownik ${user.username} sie polaczyl!`)
      );
    //lista uzytkownikow
    io.to(user.room).emit(`roomUsers`, {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //znajdz wiadomosc chatu
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit(`wiadomosc`, formatMessage(user.username, msg));
  });
  //rozloczenie
  socket.on(`disconnect`, () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        `wiadomosc`,
        formatMessage(botName, `Uzytkownik ${user.username} sie rozlaczyl`)
      );
      //lista uzytkownikow
      io.to(user.room).emit(`roomUsers`, {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
