const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const bearerToken = req.header('Authorization');

  let token;
  if (bearerToken && bearerToken.startsWith('Bearer ')) {
    token = bearerToken.split(' ')[1]; // Get token from Bearer string
  } else {
    // Fallback to custom header if provided, though Bearer is standard
    token = req.header('x-auth-token');
  }

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretTEMPORARY');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
