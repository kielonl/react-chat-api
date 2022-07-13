const crypto = require("crypto");
const users = require("./users").users;
let channels = [];
const isUsernameTaken = (givenUsername) => {
  return users.some((el) => el.username == givenUsername);
};
module.exports = function (app) {
  app.post("/channels", (request, response) => {
    if (!isUsernameTaken(request.body.username)) {
      response
        .status(400)
        .json({ errorMessage: "There's no user with this username" });
    } else {
      if (
        request.body.maxUsers > 128 ||
        request.body.maxUsers < 2 ||
        !Number.isInteger(request.body.maxUsers)
      ) {
        response.status(400).json({
          errorMessage: "Users amount must be a number between 2 and 128",
        });
      } else {
        const channelOwner = {
          owner: request.body.username,
          channelUuid: crypto.randomUUID(),
          dataTime: new Date().toString(),
          maxNumberOfMembers: request.body.maxUsers,
        };
        channels.push(channelOwner);
        response.status(201);
        response.send(channels);
      }
    }
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
