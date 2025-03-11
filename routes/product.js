const express = require("express");
const { productList } = require("../controllers/product.js");
const { registerSchema, loginSchema } = require("../middleware/validation.js");
const router = express.Router();
const validateRequest = require('../middleware/validateRequest.js'); // Middleware to validate requests
const authenticate = require('../middleware/auth.js');
router.get('/productList', productList);


module.exports =  router;