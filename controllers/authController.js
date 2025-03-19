const User = require('../models/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { sendOtpEmail } = require('../services/emailService.js');

dotenv.config();
const { v4: uuidv4 } = require('uuid');
const register = async (req, res) => {
    const { password, email, name, phone, dateofbirth, gender } = req.body;
    const id = uuidv4();
    try {
        const existingUser = await User.findOne({ where: { email } });
        const phoneNumberCheck = await User.findOne({ where: { phone } });
        if (existingUser || phoneNumberCheck) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({
            id: id,
            email,
            password: hashedPassword,
            name,
            phone,
            dateofbirth,
            gender,
        });
        const token = jwt.sign(
            { userId: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(201).json({ message: 'User registered successfully', userId: newUser.id, token: token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};


const registerAstrologer = async (req, res) => {
    const { password, email, name, phone, dateofbirth, gender } = req.body;
    const id = uuidv4();
    try {
        const existingUser = await User.findOne({ where: { email } });
        const phoneNumberCheck = await User.findOne({ where: { phone } });
        if (existingUser || phoneNumberCheck) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create({
            id: id,
            email,
            password: hashedPassword,
            name,
            phone,
            dateofbirth,
            gender,
            role: "astrologer"
        });
        const token = jwt.sign(
            { userId: newUser.id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(201).json({ message: 'User registered successfully', userId: newUser.id, token: token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email }, attributes: ['name', 'email', 'phone', 'gender', 'role','dateofbirth','password'] });
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

        return res.status(200).json({ message: "Login successful", token, userData: user });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Retrieve user data 
        var user = await User.findOne({ email });
        if (!user) {
            return res.status(403).json({ message: 'Email not registered with us!', 'status': false });
        }

        var otp = !this.STATIC_OTP ? this.generateOtp() : 445566;
        console.log("otp", otp);
        try {
            await setRedisData('otp_' + email, otp, 72000);
            // Send OTP to email
            await sendOtpEmail(email, otp);

        } catch (error) {

        }
        var messages = 'Otp Send successful. Check Your Email!';
        return res.status(200).json({ message: messages, 'status': true });

    } catch (error) {
        // Return error response in case of an exception
        return res.status(500).json({ message: 'Error verifying OTP', error, 'status': false });
    }

}
module.exports = { register, login, forgotPassword, registerAstrologer };