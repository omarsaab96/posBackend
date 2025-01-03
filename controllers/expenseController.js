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
            label: req.body.label,
            price: req.body.price,
            currency: req.body.currency,
            date: {
                day: req.body.date.day,
                month: req.body.date.month,
                year: req.body.date.year 
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

// Update an existing expense
const updateExpense = (req, res) => {
    try {
        const expenses = readJSONFile();
        const { id } = req.params;

        const index = expenses.findIndex((expense) => expense.id === id);
        
        if (index === -1) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const updatedExpense = {
            ...expenses[index],
            ...req.body, // Update fields from request body
        };

        validateExpense(updatedExpense);

        expenses[index] = updatedExpense;
        writeJSONFile(expenses);
        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an expense
const deleteExpense = (req, res) => {
    try {
        const expenses = readJSONFile();
        const { id } = req.params;

        const index = expenses.findIndex((expense) => expense.id === Number(id));
        if (index === -1) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const deletedExpense = expenses.splice(index, 1);
        writeJSONFile(expenses);
        res.status(200).json(deletedExpense);
    } catch (error) {
        res.status(500).json({ message: "Error deleting expense" });
    }
};


const validateProduct = (expense) => {
    const { label, price, currency } = expense;

    if (!label || typeof label !== "string") {
        throw new Error("Invalid expense label");
    }
    if (isNaN(price) || price <= 0) {
        throw new Error("Invalid price");
    }
    if (!currency || typeof currency !== "string") {
        throw new Error("Invalid currency");
    }
    // Additional checks for optional fields like barcode and img can be added here
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };
