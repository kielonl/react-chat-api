const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(cors());

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

require("./users")(app);
require("./channels")(app);

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
