const fs = require('fs');
const path = './data/carts.json';

const readJSONFile = () => {
    if (!fs.existsSync(path)) return [];
    return JSON.parse(fs.readFileSync(path, 'utf8'));
};

const writeJSONFile = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
};

// Get all carts
exports.getCarts = (req, res) => {
    const carts = readJSONFile();
    res.status(200).json(carts);
};

// Add a new cart
exports.addCart = (req, res) => {
    try {
        const carts = readJSONFile();
        if (!Array.isArray(carts)) {
            throw new Error("Carts is not an array");
        }

        // Get the current date with the desired timezone adjustment
        const now = new Date();
        const options = { timeZone: "Asia/Beirut", hour12: false }; // Replace with your timezone
        const formatter = new Intl.DateTimeFormat("en-US", {
            ...options,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        const formattedDate = formatter.format(now).replace(/[\s,\/:]/g, ""); // Clean up formatting

        const day = now.getDate();
        const monthNumber = now.getMonth();
        const year = now.getFullYear();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[monthNumber];

        // Format time in 12-hour format with AM/PM
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;

        const newCart = {
            id: req.body.cartid ? req.body.cartid : formattedDate, // Use timezone-adjusted date as the ID
            products: req.body.products || [],
            totalAmount: req.body.totalAmount || 0,
            currency: req.body.currency || null,
            cartName: req.body.name || null,
            cartNumber: req.body.cartNumber || null,
            cartNotes: req.body.cartNotes || null,
            date: {
                day: req.body.date.day ? req.body.date.day : day,
                month: req.body.date.month ? req.body.date.month : month,
                year: req.body.date.year ? req.body.date.year : year
            },
            time: req.body.time ? req.body.time: formattedTime
        };

        carts.push(newCart);
        writeJSONFile(carts);
        res.status(201).json(newCart);
    } catch (error) {
        console.error("Error saving cart:", error.message);
        res.status(400).json({ message: error.message });
    }
};


// Update a cart
exports.updateCart = (req, res) => {
    try {
        const carts = readJSONFile();
        const cartId = parseInt(req.params.id, 10);
        const cartIndex = carts.findIndex(cart => cart.id === cartId);

        if (cartIndex === -1) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Update cart details
        const updatedCart = {
            ...carts[cartIndex],
            ...req.body,
            totalAmount: req.body.products.reduce((total, product) => {
                return total + product.price * product.quantity;
            }, 0)
        };

        carts[cartIndex] = updatedCart;
        writeJSONFile(carts);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a cart
exports.deleteCart = (req, res) => {
    const carts = readJSONFile();
    const cartId = parseInt(req.params.id, 10);
    const updatedCarts = carts.filter(cart => cart.id !== cartId);

    if (carts.length === updatedCarts.length) {
        return res.status(404).json({ message: "Cart not found" });
    }

    writeJSONFile(updatedCarts);
    res.status(200).json({ message: "Cart deleted successfully" });
};
