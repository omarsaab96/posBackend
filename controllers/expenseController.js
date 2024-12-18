const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/expenses.json");

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
const getExpenses = (req, res) => {
    try {
        const products = readJSONFile();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error reading data" });
    }
};

// Add a new product
const addExpense = (req, res) => {
    try {
        const expenses = readJSONFile();
        const newExpense = {
            id: Date.now(),
            name: req.body.name,
            price: req.body.price,
            currency: req.body.currency,
            date: {
                day: req.body.date,
                month: req.body.date,
                year: req.body.date 
            },
        };

        validateProduct(newExpense); // Validate the product structure

        expenses.push(newExpense);
        writeJSONFile(expenses);
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const validateProduct = (expense) => {
    const { name, price, currency } = expense;

    if (!name || typeof name !== "string") {
        throw new Error("Invalid product name");
    }
    if (isNaN(price) || price <= 0) {
        throw new Error("Invalid price");
    }
    if (!currency || typeof currency !== "string") {
        throw new Error("Invalid currency");
    }
    // Additional checks for optional fields like barcode and img can be added here
};

module.exports = { getExpenses, addExpense };
