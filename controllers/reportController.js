const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "/data/reports.json");
const cartsFilePath = './data/carts.json';
const expensesFilePath = './data/expenses.json';

// Utility function to read JSON file
const readJSONFile = (filePath) => {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Utility function to write to JSON file
const writeJSONFile = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Get all products
const getReport = (req, res) => {
    try {
        const { day, month, year } = req.body; // Read day, month, year from request body

        // Validate the incoming date format
        if (!day || !month || !year) {
            return res.status(400).json({ error: "Invalid date format. Please provide day, month, and year." });
        }

        // Read the carts data
        const carts = readJSONFile(cartsFilePath);
        const expenses = readJSONFile(expensesFilePath);

        // Filter carts made on the specified date
        const filteredCarts = carts.filter(cart =>
            cart.date.day === day &&
            cart.date.month === month &&
            cart.date.year === year
        );

        const filteredExpenses = expenses.filter(expense =>
            expense.date.day === day &&
            expense.date.month === month &&
            expense.date.year === year
        );

        // Calculate totalCarts from filtered carts' totalAmount field
        const totalCarts = filteredCarts.reduce((sum, cart) => sum + (cart.totalAmount || 0), 0);

        // Calculate totalExpenses from filtered expenses' price field
        const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + (expense.price || 0), 0);

        // Calculate totalSoldItems by summing up all products' quantities from filtered carts
        const totalSoldItems = filteredCarts.reduce((sum, cart) => {
            return sum + (cart.products || []).reduce((productSum, product) => productSum + (product.quantity || 0), 0);
        }, 0);

        // Calculate totalSoldItemsCostLBP by summing up all products' (costLBP * quantity) from filtered carts
        const totalSoldItemsCostLBP = filteredCarts.reduce((costLBP, cart) => {
            return costLBP + (cart.products || []).reduce((productCostLBP, product) => {
                return productCostLBP + ((product.costLBP || 0) * (product.quantity || 0));
            }, 0);
        }, 0);

        // Calculate totalSoldItemsCostUSD by summing up all products' (costUSD * quantity) from filtered carts
        const totalSoldItemsCostUSD = filteredCarts.reduce((costUSD, cart) => {
            return costUSD + (cart.products || []).reduce((productCostUSD, product) => {
                return productCostUSD + ((product.costUSD || 0) * (product.quantity || 0));
            }, 0);
        }, 0);


        // Return the filtered carts
        res.status(200).json({ carts: filteredCarts, expenses: filteredExpenses, totalCarts: totalCarts, totalExpenses: totalExpenses, totalSoldItems: totalSoldItems, totalSoldItemsCostLBP: totalSoldItemsCostLBP, totalSoldItemsCostUSD: totalSoldItemsCostUSD });
    } catch (error) {
        console.error("Error fetching carts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { getReport };
