const apiResponse = require("../helpers/apiResponse");

const sequelize = require("../config/sequelize");

module.exports = {
  total(req, res) {
    try {
      sequelize
        .query(`exec PSFTPConnectionActiveList @AdminID = 3`)
        .then((result) => {
          console.log(result[0]);
          apiResponse.successResponse(res, "ActiveConnections total", {
            activeConnections: result[0],
          });
        })
        .catch((err) => {
          console.error("Error executing procedure: ", err);
          apiResponse.ErrorResponse(
            res,
            "Error executing procedure: " + err.message
          );
        });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
  search(req, res) {
    try {
      const { fileName } = req.query;

      const searchResults = sequelize
        .query(`exec PSFTPConnectionActiveList @AdminID = 3`)
        .findAll({
          where: {
            fileName: {
              [Sequelize.Op.like]: `${fileName}`,
            },
          },
        });

      apiResponse.successResponse(res, "ActiveConnections search results", {
        searchResults: searchResults,
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
  total24(req, res) {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const totalConnections = sequelize
        .query(`exec PSFTPConnectionActiveList @AdminID = 3`)
        .count({
          where: {
            startTimestampUTC: {
              [Sequelize.Op.gte]: oneDayAgo,
            },
          },
        });

      apiResponse.successResponse(res, "Activeconnections total", {
        totalConnections: totalConnections,
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
};
