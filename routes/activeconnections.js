const express = require("express");
const ActiveconnectionsController = require("../controllers/activeconnectionsController");

const router = express.Router();

router.get("/", ActiveconnectionsController.getConnectionList);
router.get("/:id", ActiveconnectionsController.getConnectionInfo);

module.exports = router;
