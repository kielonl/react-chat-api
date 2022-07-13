const userAgent = require("user-agent-parse");
const axios = require("axios");
const crypto = require("crypto");
const users = [];
let currentUser;

const hasWhiteSpaces = (string) => {
  return /\s/.test(string);
};
const isLenghtOk = (string) => {
  if (string.length >= 16 || string.length < 3) {
    return false;
  } else {
    return true;
  }
};
const isNotANumber = (string) => {
  return !isNaN(string);
};

function isImage(url) {
  if (url.length < 2048) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  } else {
    return false;
  }
}

const checkUrl = async (url) => {
  const result = await axios
    .get(url)
    .then((response) => {
      return response.status;
    })
    .catch((error) => {
      return error.status;
    });
  if (result != 200) {
    return false;
  } else {
    return true;
  }
};

module.exports = function (app) {
  app.post("/users", async (request, response) => {
    const img = await checkUrl(request.body.imageUrl).then((result) => {
      return result;
    });
    if (hasWhiteSpaces(request.body.username)) {
      return response.status(400).json({ errorMessage: "has white spaces" });
    }
    if (!isLenghtOk(request.body.username)) {
      return response.status(400).json({
        errorMessage: "username length must be between 3 and 16 characters",
      });
    }
    if (isNotANumber(request.body.username)) {
      return response
        .status(400)
        .json({ errorMessage: "username can't be an integer" });
    }
    const found = users.some((el) => el.username == request.body.username);
    if (found) {
      return response.status(400).json({ errorMessage: "username taken" });
    }
    if (!isImage(request.body.imageUrl) || !img) {
      return response.status(401).json({ errorMessage: "invalid image url" });
    }
    const browserDetails = userAgent.parse(request.get("User-Agent"));
    const browser = browserDetails.full.split("/");
    const newUser = {
      uuid: crypto.randomUUID(),
      username: request.body.username,
      dataTime: new Date().toString(),
      image: request.body.imageUrl,
      browser: {
        browserName: browser[0],
        browserVersion: browser[1],
        osVersion: browserDetails.os,
      },
    };
    users.push(newUser);
    response.status(201);
    response.send(users);
    currentUser = newUser;
  });

  app.get("/users", (request, response) => {
    response.send(users);
  });
  app.get("/users/:id", (request, response) => {
    const result = users.find((x) => x.uuid == request.params.id);
    if (result) {
      response.status(201);
      response.json(result);
    } else {
      response.status(401).json({ errorMessage: "User UUID not found" });
    }
  });
};

module.exports.users = users;
