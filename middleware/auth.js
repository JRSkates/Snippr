const { verifyToken } = require('../models/user'); // Import verifyToken function

function authenticateToken(req, res, next) {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "

  if (!token) {
    return res.status(401).json({ error: 'Token is required for authentication' });
  }

  // Verify the token
  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Attach the user to the request object for further use
  req.user = user;
  next(); // Proceed to the next middleware or route handler
}

module.exports = authenticateToken;
