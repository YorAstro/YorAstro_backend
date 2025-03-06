const express =require("express");
const connectDB =require('./services/databaseConnection.js');
const app = express();
const routes = require('./routes/authRoutes.js')
app.use(express.json());
app.use(routes);
module.exports = app;