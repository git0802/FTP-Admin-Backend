require("dotenv").config();

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.MSSQL_DATABASE_NAME,
  process.env.MSSQL_USERNAME,
  process.env.MSSQL_PASSWORD,
  {
    host: process.env.MSSQL_IP_ADDRESS,
    port: process.env.MSSQL_IP_PORT,
    dialect: "mssql",
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
