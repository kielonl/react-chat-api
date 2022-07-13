const crypto = require("crypto");
const users = [];
const hasWhiteSpaces = require("./helpers").hasWhiteSpaces;
const isLenghtOk = require("./helpers").isLenghtOk;
const isNotANumber = require("./helpers").isNotANumber;
const isImage = require("./helpers").isImage;
const isUsernameTaken = require("./helpers").isUsernameTaken;
const checkUrl = require("./helpers").checkUrl;
const getBrowserData = require("./helpers").getBrowserData;

module.exports = function (app) {
  app.post("/users", async (request, response) => {
    const img = await checkUrl(request.body.imageUrl).then((result) => {
      return result;
    });
    if (hasWhiteSpaces(request.body.username)) {
      return response.status(400).json({ errorMessage: "has white spaces" });
    }
    if (isLenghtOk(request.body.username)) {
      return response.status(400).json({
        errorMessage: "username length must be between 3 and 16 characters",
      });
    }
    if (isNotANumber(request.body.username)) {
      return response
        .status(400)
        .json({ errorMessage: "username can't be an integer" });
    }
    if (isUsernameTaken(users, request.body.username)) {
      return response.status(400).json({ errorMessage: "username taken" });
    }
    if (!isImage(request.body.imageUrl) || !img) {
      return response.status(401).json({ errorMessage: "invalid image url" });
    }

    const newUser = {
      uuid: crypto.randomUUID(),
      username: request.body.username,
      dataTime: new Date().toString(),
      image: request.body.imageUrl,
      browser: getBrowserData(request),
    };
    users.push(newUser);
    response.status(201);
    response.send(users);
  });

  app.get("/users", (request, response) => {
    response.send(users);
  });
  app.get("/users/:id", (request, response) => {
    const result = users.find((x) => x.uuid == request.params.id);
    if (result) {
      response.status(200);
      response.json(result);
    } else {
      response.status(400).json({ errorMessage: "User UUID not found" });
    }
  });
};

module.exports.users = users;
