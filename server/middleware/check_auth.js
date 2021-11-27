const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config');
const Logger = require('../Logger');

/***
 * All the requests except login should go through this middleware.
 * It checks if the user is authorized. It not, sends 401 error.
 * It authorized, adds user property to request for faster access.
 */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, JWT_KEY);
    Logger.log(0, 'User logged in', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
