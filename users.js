const userAgent = require("user-agent-parse");
const axios = require("axios");
const crypto = require("crypto");
const users = [];

const hasWhiteSpaces = (string) => {
  return /\s/.test(string);
};

const validation = (string) => {
  if (hasWhiteSpaces(string)) {
    return {
      errorMessage: "has white spaces",
    };
  } else if (string.length >= 16 || string.length < 3) {
    return {
      errorMessage: "username length must be between 3 and 16 characters",
    };
  } else if (!isNaN(string)) {
    return {
      errorMessage: "username cannot be a number",
    };
  } else {
    return true;
  }
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
    if (validation(request.body.username) == true) {
      const found = users.some((el) => el.username == request.body.username);
      if (!found) {
        if (isImage(request.body.imageUrl) && img) {
          const browserDetails = userAgent.parse(request.get("User-Agent"));
          const newUser = {
            UUID: crypto.randomUUID(),
            username: request.body.username,
            dataTime: new Date().toString(),
            browser: browserDetails,
            image: request.body.imageUrl,
          };
          users.push(newUser);
          response.status(201);
          response.send(users);
        } else {
          response.status(400);
          response.send("invalid image url");
        }
      } else {
        response.status(400);
        response.send("username taken");
      }
    } else {
      response.status(400);
      response.send(validation(request.body.username));
    }
  });

  app.get("/users", (request, response) => {
    response.send(users);
  });
  app.get("/users/:id", (request, response) => {
    const result = users.find((x) => x.UUID == request.params.id);
    if (result) {
      response.status(201);
      response.json(result);
    } else {
      response.status(401).json({ errorMessage: "User UID not found" });
    }
  });
};
