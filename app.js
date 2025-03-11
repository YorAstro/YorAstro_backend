const express =require("express");
const connectDB =require('./services/databaseConnection.js');
const app = express();
const routes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/user.js')
const productRoutes = require('./routes/product.js');
const categoryRoutes = require('./routes/category.js')
var bp = require('body-parser')

app.use(express.json());
app.use(bp.json());
// app.use(bp.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//     console.log("Received Body:", req.body);
//     next();
// });

// app.use((req, res, next) => {
//     if (typeof req.body === 'object' && req.body !== null) {
//         req.body = JSON.parse(JSON.stringify(req.body)); // Removes unexpected characters
//     }
//     next();
// });
app.use(routes);
app.use('/user',userRoutes);
app.use('/product',productRoutes);
app.use('/category',categoryRoutes);

module.exports = app;