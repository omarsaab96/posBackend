const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Routes
router.get('/', cartController.getCarts);
router.post('/', cartController.addCart);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);

module.exports = router;
