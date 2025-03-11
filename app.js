const express =require("express");
const connectDB =require('./services/databaseConnection.js');
const app = express();
const routes = require('./routes/authRoutes.js');
const userroutes = require('./routes/user.js')
const productRoutes = require('./routes/product.js');
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
app.use('/user',userroutes);
app.use('/product',productRoutes)
module.exports = app;