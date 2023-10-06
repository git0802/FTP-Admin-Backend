const express = require("express");
const sequelize = require("./config/sequelize");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const path = require("path");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests
app.use(cors());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Expose-Headers", "Content-Range");
  next();
});

//Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

const port = 3001; // Make sure to define the port

app.listen(port, () => console.log(`Express app running on port ${port}!`));

module.exports = app;
