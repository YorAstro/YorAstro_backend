const express = require("express");
const { astrologerList } = require("../controllers/user.js");
const { registerSchema, loginSchema } = require("../middleware/validation.js");
const router = express.Router();
const validateRequest = require('../middleware/validateRequest.js'); // Middleware to validate requests
const authenticate = require('../middleware/auth.js');
router.get('/astrologerList', astrologerList);


module.exports =  router;