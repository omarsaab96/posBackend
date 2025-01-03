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
            section: req.body.section,
            img: req.body.img || null,
            category: req.body.category || null,
            quantity: req.body.quantity || 0,
            costLBP: req.body.costLBP != 0 ? req.body.costLBP : req.body.costUSD * process.env.USDLBP || 0,
            costUSD: req.body.costUSD != 0 ? req.body.costUSD : req.body.costLBP / process.env.USDLBP || 0
        };

        validateProduct(newProduct); // Validate the product structure

        products.push(newProduct);
        writeJSONFile(products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
//Update an existing product
const updateProduct = (req, res) => {
    try {
        const products = readJSONFile();
        const { id } = req.params;
        const productIndex = products.findIndex((p) => p.id === parseInt(id));

        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found" });
        }

        validateProduct(req.body); // Validate the product structure

        const updatedProduct = { ...products[productIndex], ...req.body };
        products[productIndex] = updatedProduct;

        writeJSONFile(products);
        res.status(200).json({ message: "Product with id " + id + " updated", updatedProduct: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product" });
    }
};

// calculate LBP and USD costs
const calculatePrices = (req, res) => {
    try {
        // Read the JSON file
        const data = fs.readFileSync(filePath, 'utf8');
        const products = JSON.parse(data);

        // Get the USD to LBP exchange rate from the environment variables
        const usdToLbpRate = parseFloat(process.env.USDLBP);

        if (!usdToLbpRate) {
            return res.status(400).json({ error: "USD to LBP exchange rate is not defined" });
        }

        // Iterate over the products and calculate costs
        const updatedProducts = products.map(product => {
            if (!product.costUSD || product.costUSD === 0) {
                // Calculate costUSD and round up to nearest 0.01
                product.costUSD = Math.ceil((product.costLBP / usdToLbpRate) * 100) / 100;
            }

            if (!product.costLBP || product.costLBP === 0) {
                // Calculate costLBP and round up to nearest 500
                product.costLBP = Math.ceil(product.costUSD * usdToLbpRate / 500) * 500;
            }

            return product;
        });

        // Save the updated products back to the JSON file
        fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2));

        // Respond with the updated products
        res.json(updatedProducts);

    } catch (error) {
        console.error("Error processing products:", error);
        res.status(500).json({ message: "Error processing products" });
    }
};

// Update price list if dollar rate changes
const updatePriceList = (req, res) => {
    try {
        // Read the JSON file
        const data = fs.readFileSync(filePath, 'utf8');
        const products = JSON.parse(data);

        // Get the USD to LBP exchange rate from the environment variables
        const usdToLbpRate = parseFloat(process.env.USDLBP);
        const margin = parseFloat(process.env.MARGIN);
        const profit = parseFloat(process.env.PROFIT);

        if (!usdToLbpRate) {
            return res.status(400).json({ error: "USD to LBP exchange rate is not defined" });
        }

        // Iterate over the products and calculate costs
        const updatedProducts = products.map(product => {
            if (product.costUSD && product.costUSD != 0) {
                let productBasePrice = Math.ceil(product.costUSD * usdToLbpRate / 500) * 500;
                product.suggestedPrice = Math.ceil(((productBasePrice * margin) * profit) / 500) * 500;
            }
            return product;
        });

        // Save the updated products back to the JSON file
        fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2));

        // Respond with the updated products
        res.json(updatedProducts);

    } catch (error) {
        console.error("Error processing products:", error);
        res.status(500).json({ message: "Error processing products" });
    }
};

const validateProduct = (product) => {
    const { name, price, currency, section, category, costLBP, costUSD } = product;

    if (!name || typeof name !== "string") {
        throw new Error("Invalid product name");
    }
    if (isNaN(price) || price <= 0) {
        throw new Error("Invalid price");
    }
    if (!currency || typeof currency !== "string") {
        throw new Error("Invalid currency");
    }
    if (!section || typeof section !== "string") {
        throw new Error("Section not specified");
    }
    if (!category || typeof category !== "string") {
        throw new Error("Category not specified");
    }
    if (costUSD == 0 && costLBP == 0) {
        throw new Error("Cost not specified");
    }
};

// Delete a product by ID
const deleteProduct = (req, res) => {
    try {
        // Read the JSON file
        const products = readJSONFile();

        // Get the product ID from the request parameters
        const { id } = req.params;

        // Find the product by ID
        const productIndex = products.findIndex(product => product.id === parseInt(id));

        // If the product does not exist, return a 404 error
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Remove the product from the array
        const deletedProduct = products.splice(productIndex, 1);

        // Save the updated array back to the JSON file
        writeJSONFile(products);

        // Respond with the deleted product
        res.status(200).json(deletedProduct[0]);
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
};


module.exports = { getProducts, addProduct, updateProduct, calculatePrices, updatePriceList, deleteProduct };
