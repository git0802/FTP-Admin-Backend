const { response } = require("../app");
const sequelize = require("../config/sequelize");
const { getWhereClause, filterRangeSetHeader } = require("../helpers/filter");
const JsonFind = require("json-find");

module.exports = {
  getConnectionList(req, res) {
    try {
      const where = getWhereClause(req.query);
      sequelize
        .query(`exec PSFTPConnectionActiveList @AdminID = 1057`)
        .then((result) => {
          filterRangeSetHeader(res, result[0].length, where.start, where.end);

          return res.send({"activeconnections": result[0].map((r, index) => {return { id: index, ...r }})});
        })
        .catch((err) => {
          res.json(err);
        });
    } catch (err) {
      //throw error in json response with status 500.
      res.json(err);
    }
  },
  getConnectionInfo(req, res) {
    try {
      sequelize
        .query(`exec PSFTPConnectionActiveList @AdminID = 3`)
        .then((result) => {
          const data = result[0].map((r, index) => {return { id: index, ...r }});
          const item = data.find(item => item.id === parseInt(req.params.id));
          if (item) {
            return res.send(item);
          } else {
            return res.status(404).json({ message: `Item with id ${req.params.id} not found` });
          }
        })
        .catch((e) => {
          return res.status(500).json({ message: e.message });
        });
    } catch (error) {
      console.log(error);
  
      return apiResponse.ErrorResponse(res, "Server Error");
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

      res.json({searchResults: searchResults});
    } catch (err) {
      //throw error in json response with status 500.
      res.json(err);
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
      res.json({totalConnections: totalConnections});
    } catch (err) {
      //throw error in json response with status 500.
      res.json(err);
    }
  },
};
