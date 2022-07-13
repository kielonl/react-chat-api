const crypto = require("crypto");
const users = require("./users").users;
let channels = [];

const usernameExists = (string) => {
  return users.some((el) => el.uuid == string);
};

module.exports = function (app) {
  app.post("/channels", (request, response) => {
    if (!usernameExists(request.body.uuid)) {
      return response
        .status(401)
        .json({ errorMessage: "There's no user with this UUID" });
    }
    if (
      request.body.maxUsers > 128 ||
      request.body.maxUsers < 2 ||
      !Number.isInteger(request.body.maxUsers)
    ) {
      response.status(401).json({
        errorMessage: "Users amount must be a number between 2 and 128",
      });
    }
    const channelOwner = {
      owner: request.body.uuid,
      channelUuid: crypto.randomUUID(),
      dataTime: new Date().toString(),
      maxNumberOfMembers: request.body.maxUsers,
    };
    channels.push(channelOwner);
    response.status(201);
    response.send(channels);
  });
  app.get("/users", (request, response) => {
    response.send(channels);
  });
};
