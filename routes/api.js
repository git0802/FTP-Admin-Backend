const express = require("express");
const app = express();

app.use("/activeconnections/", require("./activeconnections"));
