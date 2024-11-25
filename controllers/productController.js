const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/products.json");

// Utility function to read JSON file
const readJSONFile = () => {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
};

// Utility function to write to JSON file
const writeJSONFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Get all products
const getProducts = (req, res) => {
    try {
        const products = readJSONFile();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error reading data" });
    }
};

// Add a new product
const addProduct = (req, res) => {
    try {
        const products = readJSONFile();
        const newProduct = {
            id: Date.now(),
            barcode: req.body.barcode || null,
            name: req.body.name,
            price: req.body.price,
            currency: req.body.currency,
            type: req.body.type,
            img: req.body.img || null
        };

        validateProduct(newProduct); // Validate the product structure

        products.push(newProduct);
        writeJSONFile(products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const validateProduct = (product) => {
    const { name, price, currency, type } = product;

    if (!name || typeof name !== "string") {
        throw new Error("Invalid product name");
    }
    if (isNaN(price) || price <= 0) {
        throw new Error("Invalid price");
    }
    if (!currency || typeof currency !== "string") {
        throw new Error("Invalid currency");
    }
    if (!type || typeof type !== "string") {
        throw new Error("Invalid type");
    }
    // Additional checks for optional fields like barcode and img can be added here
};

module.exports = { getProducts, addProduct };
