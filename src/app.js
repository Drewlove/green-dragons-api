require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const validateBearerToken = require("./validate-bearer-token");

const studentsRouter = require("./students/router");
const challengesRouter = require("./challenges/router");
const communitiesRouter = require("./communities/router");
const subcommunitiesRouter = require("./subcommunities/router");
const exchangesRouter = require("./exchanges/router");

const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test",
  })
);
app.use(cors());
app.use(helmet());

app.use(validateBearerToken);
app.use("/api/students", studentsRouter);
app.use("/api/challenges", challengesRouter);
app.use("/api/communities", communitiesRouter);
app.use("/api/subcommunities", subcommunitiesRouter);
app.use("/api/exchanges", exchangesRouter);
//other routers go here

//Open heroku url in browser, see if {ok: true} appears
app.get("/TEST", (req, res) => {
  res.json({ ok: true });
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: "Server error" };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
