const crypto = require("crypto");
const users = require("./users").users;
let channels = [];
const {
  usernameExists,
  isUsersInRange,
  isValidUUID,
  channelCreated,
} = require("./helpers");

module.exports = function (app) {
  app.post("/channels", (request, response) => {
    if (!isValidUUID(request.body.uuid)) {
      return response.status(400).json({ errorMessage: "UUID is invalid" });
    }
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
    if (channelCreated(channels, request.body.uuid)) {
      return response.status(400).json({
        errorMessage: "This user already has his own channel",
      });
    }
    const channelOwner = {
      owner: request.body.uuid,
      channelUuid: crypto.randomUUID(),
      dataTime: new Date().toString(),
      maxNumberOfMembers: request.body.maxUsers,
    };
    channels.push(channelOwner);
    response.status(201).json(channels);
  });
  app.get("/users", (request, response) => {
    response.send(channels);
  });
  app.get("/channels/:uuid", (request, response) => {
    if (isValidUUID(request.params.uuid)) {
      const result = channels.find((x) => x.channelUuid == request.params.uuid);
      if (result) {
        response.status(200).json(result);
      } else {
        response.status(400).json({ errorMessage: "Channel UUID not found" });
      }
    } else {
      response
        .status(400)
        .json({ errorMessage: "given UUID format is invalid" });
    }
  });
};
