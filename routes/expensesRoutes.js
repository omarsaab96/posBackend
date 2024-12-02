const express = require("express");
const { getExpenses, addExpense } = require("../controllers/expenseController");
const router = express.Router();

router.get("/", getExpenses);
router.post("/", addExpense);

module.exports = router;
