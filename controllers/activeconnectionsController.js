const apiResponse = require("../helpers/apiResponse");

const sequelize = require("../config/sequelize");

module.exports = {
  total(req, res) {
    try {
      sequelize
        .query(`exec PSFTPConnectionActiveList @AdminID = 3`)
        .then((result) => {
          console.log(result[0]);
          apiResponse.successResponse(res, "Activeconnections total", {
            activeconnections: result[0],
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
};
