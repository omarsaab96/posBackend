const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(bodyParser.json());

// Use routes
app.use("/api/products", productRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
