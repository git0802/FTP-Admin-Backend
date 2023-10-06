const { response } = require("../app");
const sequelize = require("../config/sequelize");
const { getWhereClause, filterRangeSetHeader } = require("../helpers/filter");

module.exports = {
  total(req, res) {
    try {
      const where = getWhereClause(req.query);
      sequelize
        .query(`exec PSFTPConnectionActiveList @AdminID = 3`)
        .then(async (result) => {
          filterRangeSetHeader(res, result[0].length, where.start, where.end);

          return res.send(result[0].map((r, index) => {return { id: index, ...r }}));
        })
        .catch((err) => {
          res.json(err);
        });
    } catch (err) {
      //throw error in json response with status 500.
      res.json(err);
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
