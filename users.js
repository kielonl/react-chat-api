const crypto = require("crypto");
const users = [];
const {
  hasWhiteSpaces,
  isLengthOk,
  isNotANumber,
  isImage,
  isUsernameTaken,
  checkUrl,
  getBrowserData,
  elementExists,
  uuidExists,
} = require("./helpers");

module.exports = function (app) {
  app.post("/users", async (request, response) => {
    const img = await checkUrl(request.body.imageUrl).then((result) => {
      return result;
    });
    if (hasWhiteSpaces(request.body.username)) {
      return response.status(400).json({ errorMessage: "has white spaces" });
    }
    if (isLengthOk(request.body.username, 3, 18)) {
      return response.status(400).json({
        errorMessage: "username length must be between 3 and 18 characters",
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
      username: request.body.username.trim(),
      dataTime: new Date().toString(),
      image: request.body.imageUrl.trim(),
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

    if (!elementExists(users, request.params.id)) {
      return response.status(400).json({ errorMessage: "User UUID not found" });
    }
    response.status(200).json(uuidExists(users, request.params.id));
  });
};

module.exports.users = users;
