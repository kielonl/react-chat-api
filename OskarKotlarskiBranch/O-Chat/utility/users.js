const users = [];

//dolacz uzytkownika do pokoju
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);

  return user;
}
//znajdz terazniejszego uzytkownika
function getCurrentUser(id) {
  console.log(users);
  return users.find((user) => user.id === id);
}
// uzytkownik wyszedl
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1);
  }
}
// znajdz uzytkownikow w pokoju
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
