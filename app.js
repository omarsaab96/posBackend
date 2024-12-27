require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require('./routes/cartRoutes');
const debtRoutes = require('./routes/debtRoutes');
const expensesRoutes = require('./routes/expensesRoutes');
const reportsRoutes = require('./routes/reportsRoutes');


const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:4200', // Allow only your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true // Include this if cookies or credentials are required
}));

// Use routes
app.use("/api/products", productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/reports', reportsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
