const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const errors = require("./middleware/errors");

const apiV1 = require("./api/v1/");

const app = express();
app.set("x-powered-by", false);

app.use(morgan("common"));
app.use(cors());
app.use(bodyParser.json());

app.use("/v1", apiV1);

app.use(errors);

const port = process.env.PORT || 9900;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log("Starting server on port " + port);
});
