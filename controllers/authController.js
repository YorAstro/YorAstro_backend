const User = require('../models/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const { password, email, name, phone, dateofbirth, gender } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password before storing it
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create new user
      const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
        phone,
        dateofbirth,
        gender,
      });
  
      return res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (err) {
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
  };
  

  const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      return res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  };
module.exports = { register, login };