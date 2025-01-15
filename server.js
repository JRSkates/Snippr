const express = require('express');
const app = express();
const snippetsRoutes = require('./routes/snippets');;
const usersRoutes = require('./routes/users');


// Middleware
app.use(express.json());

// Routes
app.use('/snippets', snippetsRoutes);
app.use('/users', usersRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Snippr API is running on http://localhost:${PORT}`);
});
