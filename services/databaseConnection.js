const { Sequelize } = require("sequelize");

// Database configuration
const sequelize = new Sequelize("astroyor", "root", "password", {
  host: "localhost", // Change as per your database server
  dialect: "mysql", // Change to "postgres", "sqlite", "mssql" as needed
  logging: false, // Set to true for debugging SQL queries
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
