const express = require("express");
const ActiveconnectionsController = require("../controllers/activeconnectionsController");

const router = express.Router();

router.get("/total", ActiveconnectionsController.total);

module.exports = router;
