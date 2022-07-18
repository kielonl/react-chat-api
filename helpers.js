const userAgent = require("user-agent-parse");
const axios = require("axios");

//functions used in users.js below
const hasWhiteSpaces = (string) => {
  return /\s/.test(string);
};
const isLengthOk = (string) => {
  return string.length >= 18 || string.length < 3;
};
const isNotANumber = (value) => {
  return !isNaN(value);
};
const isImage = (url) => {
  if (url.length < 2048) {
    return /\.(jpg|jpeg|png)$/.test(url);
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
  return result == 200;
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
module.exports.isLengthOk = isLengthOk;
module.exports.isNotANumber = isNotANumber;
module.exports.isImage = isImage;
module.exports.isUsernameTaken = isUsernameTaken;
module.exports.checkUrl = checkUrl;
module.exports.getBrowserData = getBrowserData;

//functions used in channels.js
const channelCreated = (array, requstedUuid) => {
  return array.some((el) => el.owner == requstedUuid);
};
const usernameExists = (arrayOfUsers, givenUuid) => {
  return arrayOfUsers.some((el) => el.uuid == givenUuid);
};
const uuidExists = (arrayOfUsers, givenUuid) => {
  return arrayOfUsers.find((x) => x.uuid == givenUuid);
};
const isUsersInRange = (users) => {
  return users > 2 && users < 128 && Number.isInteger(users);
};
const isValidUUID = (uuid) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(uuid);
};

module.exports.uuidExists = uuidExists;
module.exports.channelCreated = channelCreated;
module.exports.isValidUUID = isValidUUID;
module.exports.usernameExists = usernameExists;
module.exports.isUsersInRange = isUsersInRange;
