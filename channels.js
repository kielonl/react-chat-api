const crypto = require("crypto");
const users = require("./users").users;
let channels = [];
const usernameExists = require("./helpers").usernameExists;
const isUsersInRange = require("./helpers").isUsersInRange;

module.exports = function (app) {
  app.post("/channels", (request, response) => {
    if (!usernameExists(users, request.body.uuid)) {
      return response
        .status(400)
        .json({ errorMessage: "There's no user with this UUID" });
    }
    if (!isUsersInRange(request.body.maxUsers)) {
      return response.status(400).json({
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
  app.get("/channels/:uuid", (request, response) => {
    const result = channels.find((x) => x.channelUuid == request.params.uuid);
    if (result) {
      response.status(200).json(result);
    } else {
      response.status(400).json({ errorMessage: "Channel UUID not found" });
    }
  });
};
