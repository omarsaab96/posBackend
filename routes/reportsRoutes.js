const express = require("express");
const router = express.Router();
const { getReport } = require("../controllers/reportController");

// Middleware to parse JSON request bodies
router.use(express.json());

router.post("/", getReport);

module.exports = router;
