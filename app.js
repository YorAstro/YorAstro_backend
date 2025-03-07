const express =require("express");
const connectDB =require('./services/databaseConnection.js');
const app = express();
const routes = require('./routes/authRoutes.js')
app.use(express.json());
app.use((req, res, next) => {
    console.log("Received Body:", req.body);
    next();
});

app.use((req, res, next) => {
    if (typeof req.body === 'object' && req.body !== null) {
        req.body = JSON.parse(JSON.stringify(req.body)); // Removes unexpected characters
    }
    next();
});
app.use(routes);
module.exports = app;