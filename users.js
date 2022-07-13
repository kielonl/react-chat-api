const userAgent = require("user-agent-parse");
const axios = require("axios");
const crypto = require("crypto");
const users = [];

const hasWhiteSpaces = (string) => {
  return /\s/.test(string);
};
const isLenghtOk = (string) => {
  return string.length >= 16 || string.length < 3;
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
const isUsernameTaken = (string) => {
  return users.some((el) => el.username == string);
};

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
const getBrowserData = (req) => {
  const browserDetails = userAgent.parse(req.get("User-Agent"));
  const browser = browserDetails.full.split("/");

  return {
    browserName: browser[0],
    browserVersion: browser[1],
    osVersion: browserDetails.os,
  };
};

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
    if (isUsernameTaken(request.body.username)) {
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
      response.status(201);
      response.json(result);
    } else {
      response.status(401).json({ errorMessage: "User UUID not found" });
    }
  });
};

module.exports.users = users;
