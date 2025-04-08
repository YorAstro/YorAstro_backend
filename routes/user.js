const express = require("express");
const { astrologerList,addressSave,addressList } = require("../controllers/user.js");
const { registerSchema, loginSchema } = require("../middleware/validation.js");
const router = express.Router();
const validateRequest = require('../middleware/validateRequest.js'); // Middleware to validate requests
const authenticate = require('../middleware/auth.js');
router.get('/astrologerList', astrologerList);
router.post('/address',authenticate.authenticate, addressSave);
router.get('/address',authenticate.authenticate, addressList);

module.exports =  router;