const users = [];
const hasWhiteSpaces = (string) => {
  return /\s/.test(string);
};

module.exports.postIget = (app) => {
  app.post("/users", (request, response) => {
    if (validation(request.body.username) == true) {
      const found = users.some((el) => el.username == request.body.username);
      if (!found) {
        const browserDetails = userAgent.parse(request.get("User-Agent"));
        const newUser = {
          username: request.body.username,
          dataTime: new Date().toString(),
          browser: browserDetails,
        };
        users.push(newUser);
        response.send(users);
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
};
