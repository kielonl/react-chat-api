const crypto = require("crypto");
const users = require("./users").users;
let channels = [];

const isValidUUID = (uuid) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(uuid);
};

const usernameExists = (givenUuid) => {
  return users.some((el) => el.uuid == givenUuid);
};

module.exports = function (app) {
  app.post("/channels", (request, response) => {
    if (!isValidUUID(request.body.uuid)) {
      return response.status(400).json({ errorMessage: "UUID is invalid" });
    } else {
      if (!usernameExists(request.body.uuid)) {
        return response
          .status(400)
          .json({ errorMessage: "There's no user with this UUID" });
      }
    }
    if (
      request.body.maxUsers > 128 ||
      request.body.maxUsers < 2 ||
      !Number.isInteger(request.body.maxUsers)
    ) {
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
