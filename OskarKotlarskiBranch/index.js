const {
  postIget,
} = require("../oskar_kotlarski_backend/chat-backend/OskarKotlarskiBranch/modulo.js/index.js");
const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const userAgent = require("user-agent-parse");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const validation = (string) => {
  if (hasWhiteSpaces(string)) {
    return "has white spaces";
  } else if (string.length >= 16 || string.length < 3) {
    return "username length must be between 3 and 16 characters";
  } else if (!isNaN(string)) {
    return "username cannot be a number";
  } else {
    return true;
  }
};

let val = postIget();
app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
