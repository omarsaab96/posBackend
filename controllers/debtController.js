const fs = require('fs');
const path = './data/debts.json';

const readJSONFile = () => {
    if (!fs.existsSync(path)) return [];
    return JSON.parse(fs.readFileSync(path, 'utf8'));
};

const writeJSONFile = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
};

// Get all debts
exports.getDebts = (req, res) => {
    const debts = readJSONFile();
    // console.log(debts)
    res.status(200).json(debts);
};

// Add a new debt
exports.addDebt = (req, res) => {
    try {
        const debts = readJSONFile();
        if (!Array.isArray(debts)) {
            throw new Error("Debts is not an array");
        }

        // console.log(req.body);

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

        const newDebt = {
            id: formattedDate, // Use timezone-adjusted date as the ID
            products: req.body.products || [],
            totalAmount: req.body.totalAmount || 0,
            currency: req.body.currency || null,
            label: req.body.name || null,
            cartNumber: req.body.cartNumber || null,
            cartNotes: req.body.cartNotes || null,
            date: {
                day: day || null,
                month: month || null,
                year: year || null,
            },
            time: formattedTime || null
        };

        debts.push(newDebt);
        writeJSONFile(debts);
        res.status(201).json(newDebt);
    } catch (error) {
        console.error("Error saving debt:", error.message);
        res.status(400).json({ message: error.message });
    }
};

// Delete a debt by id
exports.deleteDebt = (req, res) => {
    // console.log('DELETING... ', req.params.id)

    const debtId = req.params.id;  // Get the debt id from the request parameters
    const debts = readJSONFile();  // Read the current debts data

    // Find the index of the debt with the provided id
    const debtIndex = debts.findIndex(debt => debt.id === debtId);

    if (debtIndex === -1) {
        // If no debt with the given id was found, send a 404 response
        return res.status(404).json({ message: "Debt not found" });
    }

    // Remove the debt from the array
    debts.splice(debtIndex, 1);

    // Write the updated debts array back to the JSON file
    writeJSONFile(debts);

    // Send a success response
    res.status(200).json({ message: "Debt deleted successfully" });
};




