const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtController');

// Routes
router.get('/', debtController.getDebts);
router.post('/', debtController.addDebt);
// router.put('/:id', debtController.updateDebt);
router.delete('/:id', debtController.deleteDebt);


module.exports = router;
