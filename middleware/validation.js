const Joi = require('joi');

// Validation schema for user registration
const registerSchema = Joi.object({
  name: Joi.string().max(255).required(),
  email: Joi.string().email().max(255).required(),
  phone: Joi.string().max(10).allow(null, ''),
  dateofbirth: Joi.date(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  password: Joi.string().min(6).required(),
});

// Validation schema for user login
const loginSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).required(),
});

module.exports = { registerSchema, loginSchema };
