const e = require("express");
const crypto = require("crypto");
const users = require("./users").users;
let channels = [];

module.exports = function (app) {
  app.post("/channels", (request, response) => {
    const found = users.some((el) => el.username == request.body.username);
    if (!found) {
      response.status(400);
      response.send({
        message: "There's no user with this username",
      });
    } else {
      if (
        request.body.maxUsers > 128 ||
        request.body.maxUsers < 2 ||
        !Number.isInteger(request.body.maxUsers)
      ) {
        response.status(400);
        response.send({
          message: "Users amount must be a number between 2 and 128",
        });
      } else {
        const ChannelOwner = {
          owner: request.body.username,
          channelUuid: crypto.randomUUID(),
          dataTime: new Date().toString(),
          maxNumberOfMembers: request.body.maxUsers,
        };
        channels.push(ChannelOwner);
        response.status(201);
        response.send(channels);
      }
    }
  });
  app.get("/users", (request, response) => {
    response.send(channels);
  });
};
