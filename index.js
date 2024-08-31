require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const createError = require("http-errors");
const morgan = require("morgan");
const port = process.env.PORT || 5000;
const mainRouter = require("./src/routes");

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("The server is up and running smoothly.");
});
app.use("/v1", mainRouter);
app.use("img", express.static("src/upload"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept, Authorization");
  next();
});

app.all("*", (req, res, next) => {
  next(new createError.NotFound());
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const messError = err.message || "Internal Server Error";
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: messError,
  });
});
app.listen(port, () => console.log(`Server running at on Port: ${port}!`));
