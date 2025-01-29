require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');
const snippetsRoutes = require('./routes/snippets');

const app = express();

// Auth0 Configuration
const config = {
  authRequired: false,  // Users can access the app, but restricted routes require authentication
  auth0Logout: true,    // Allows logging out via Auth0
  secret: process.env.AUTH0_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
};

// Middleware
app.use(express.json());
app.use(auth(config));  // Auth0 authentication middleware

// Routes
app.use('/snippets', snippetsRoutes);

// Home Route - Displays authentication status
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() 
    ? `Logged in as ${req.oidc.user.email}` 
    : 'Not logged in. <a href="/login">Login</a>');
});

// Logout Route
app.get('/logout', (req, res) => {
  res.oidc.logout({ returnTo: 'http://localhost:3000' });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Snippr API is running on http://localhost:${PORT}`);
});
