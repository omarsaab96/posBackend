# POS System Backend

This is the backend for a Point of Sale (POS) system built using Node.js and Express.js. It provides RESTful APIs for managing products, orders, customers, and more. The backend connects to a MongoDB database for storing and retrieving data.

## Features

- CRUD operations for products.
- Database integration with MongoDB.
- Middleware for request parsing and cross-origin resource sharing (CORS).
- Environment variable management with `dotenv`.

## Technologies Used

- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **dotenv**: For managing environment variables.
- **cors**: Middleware for enabling Cross-Origin Resource Sharing.

## Project Structure

pos-system-backend/ ├── config/ │ └── db.js # Database connection setup ├── controllers/ │ └── productController.js # Business logic for products ├── models/ │ └── product.js # Mongoose schema for products ├── routes/ │ └── productRoutes.js # API routes for products ├── .env # Environment variables ├── app.js # Main server file ├── package.json # Project dependencies and scripts └── README.md # Project documentation


## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/pos-system-backend.git
   cd pos-system-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```