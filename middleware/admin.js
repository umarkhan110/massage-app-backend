const jwt = require('jsonwebtoken');
const Admins = require('../model/Dashboard'); // Use the correct path to your model

const secretKey = "ASDFGHJKLTYUIOPQWERTYUIOPSDFGHJKLXCVBNMBWERTYUIOP"; // Replace this with your actual secret key

async function authenticate(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const admin = await Admins.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    req.token = token;
    next();
  } catch (ex) {
    res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = authenticate;
