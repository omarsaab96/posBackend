const express = require("express");
const { getProducts, addProduct, deleteProduct, calculatePrices, updatePriceList } = require("../controllers/productController");
const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/calculateprices", calculatePrices);
router.get("/updatePrices", updatePriceList);

module.exports = router;
