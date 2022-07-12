const express = require("express");
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

require("./users")(app);

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
