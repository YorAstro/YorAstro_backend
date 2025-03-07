const express = require("express");
const { register, login,registerAstrologer } = require("../controllers/authController.js");
const { registerSchema, loginSchema } = require("../middleware/validation.js");
const router = express.Router();
const validateRequest = require('../middleware/validateRequest.js'); // Middleware to validate requests

router.post('/register',validateRequest(registerSchema),  register);
router.post('/registerastrologer',validateRequest(registerSchema),  registerAstrologer);
router.post('/login',validateRequest(loginSchema), login);

module.exports =  router;