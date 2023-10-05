const express = require("express");
const sequelize = require("./config/sequelize");
const cors = require("cors");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

const app = express();

//To allow cross-origin requests
app.use(cors());

app.use("/", indexRouter);
app.use("/api/", apiRouter);

app.get("/activeconnections/total", async (req, res) => {
  sequelize
    .query(`exec PSFTPConnectionActiveList @AdminID = 3`)
    .then((result) => {
      console.log(result[0]);
      res.json({ activeconnections: result[0] });
    })
    .catch((err) => {
      console.error("Error executing procedure: ", err);
    });
});

app.get("/connections/search", async (req, res) => {
  const { filename } = req.query;

  const connections = await ActiveLog.findAll({
    where: {
      fileName: {
        [Sequelize.Op.like]: `%${filename}%`,
      },
    },
  });
  res.json(connections);
});

app.get("/connections/total-24", async (req, res) => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const totalConnections = await ActiveLog.count({
    where: {
      startTimestampUTC: {
        [Sequelize.Op.gte]: oneDayAgo,
      },
    },
  });
  res.json({ totalConnections });
});

const port = 3001; // Make sure to define the port

app.listen(port, () => console.log(`Express app running on port ${port}!`));
