const crypto = require("crypto");
const users = [];
const {
  userExists,
  isB64AnImage,
  hasWhiteSpaces,
  isLengthOk,
  isNotANumber,
  isUsernameTaken,
  checkUrl,
  getBrowserData,
  elementExists,
  findUserByUUID,
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
    if (!img && !isB64AnImage(request.body.imageUrl)) {
      console.log(request.body.imageUrl);
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
    response.status(201).json(newUser);
  });

  app.get("/users", (request, response) => {
    response.send(users);
  });
  app.get("/users/:id", (request, response) => {
    if (!elementExists(users, request.params.id)) {
      return response.status(400).json({ errorMessage: "User UUID not found" });
    }
    response.status(200).json(findUserByUUID(users, request.params.id));
  });
  app.post("/users/auth/:username", (request, response) => {
    if (!userExists(users, request.params.username)) {
      return response.status(400).send(false);
    }
    response.status(200).send(true);
  });
};

module.exports.users = users;
