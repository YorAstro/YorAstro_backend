const  jwt =require('jsonwebtoken');
const dotenv = require('dotenv');
const User =require('../models/users');
dotenv.config();
  const authenticate = async (req ,res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access denied, no token provided' });
      return; // Ensure the function stops execution here
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let { id } = decoded['data'];
      await User.findByIdAndUpdate(id , {lastLogin : new Date()});
      req.user = decoded['data'];
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token', status: false });
      return; // Ensure the function stops execution here
    }
  };

  logout = async (req, res,next)=> {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access denied, no token provided', status: false });
      return; // Ensure the function stops execution here
    }
    try {
      const decoded = jwt.verify(token, this.SECRET_KEY);
      let { id, roles, deviceId, deviceToken } = decoded['data'];

      if (!deviceToken) {
        res.status(400).json({ message: 'Device token missing', status: false });
        return;
      }
      const sessionKey = `session_${id}_${deviceToken}`;
      await invalidateCache(sessionKey);
      req.user = decoded['data'];
      const user = await User.findByIdAndUpdate(id, { deviceTokens: [] }, { new: true });

      res.status(200).json({ message: 'logout success', status: true });

    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token', status: false });
      return; // Ensure the function stops execution here
    }
  };


   adminlogout = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access denied, no token provided', status: false });
      return; // Ensure the function stops execution here
    }
    try {
      const decoded = jwt.verify(token, this.SECRET_KEY);

      const sessionKey = `session_admin_${decoded['data'].id}`;
      await invalidateCache(sessionKey);
      req.user = decoded['data'];

      res.status(200).json({ message: 'logout success', status: true });
      return;

    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token', status: false });
      return; // Ensure the function stops execution here
    }
  };


   adminAuthenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access denied, no token provided' });
      return; // Ensure the function stops execution here
    }

    try {
      const decoded = jwt.verify(token, this.SECRET_KEY);
      req.user = decoded['data'];
      if (decoded['data'].roles != 'ADMIN') {
        res.status(401).json({ message: 'Access denied, admin only', status: false });
        return; // Ensure the function stops execution here
      }
      next();

    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token', status: false });
      return; // Ensure the function stops execution here
    }
  };

  module.exports = {authenticate};
