function authenticateAuth0(req, res, next) {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Attach user info from Auth0 to request
  req.user = req.oidc.user;
  next();
}

module.exports = authenticateAuth0;
