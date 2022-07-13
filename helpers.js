const userAgent = require("user-agent-parse");
const axios = require("axios");

//functions used in users.js below
const hasWhiteSpaces = (string) => {
  return /\s/.test(string);
};
const isLenghtOk = (string) => {
  return string.length >= 22 || string.length < 5;
};
const isNotANumber = (value) => {
  return !isNaN(value);
};
const isImage = (url) => {
  if (url.length < 2048) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  } else {
    return false;
  }
};

const isUsernameTaken = (arr, username) => {
  return arr.some((el) => el.username == username);
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

module.exports.hasWhiteSpaces = hasWhiteSpaces;
module.exports.isLenghtOk = isLenghtOk;
module.exports.isNotANumber = isNotANumber;
module.exports.isImage = isImage;
module.exports.isUsernameTaken = isUsernameTaken;
module.exports.checkUrl = checkUrl;
module.exports.getBrowserData = getBrowserData;

//functions used in channels.js

const usernameExists = (arrayOfUsers, givenUuid) => {
  return arrayOfUsers.some((el) => el.uuid == givenUuid);
};
const isUsersInRange = (users) => {
  return users > 2 && users < 128 && Number.isInteger(users);
};

module.exports.usernameExists = usernameExists;
module.exports.isUsersInRange = isUsersInRange;
