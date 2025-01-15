const express = require('express');
const router = express.Router();
const { addUser, verifyUser } = require('../models/user');

// POST /users: Add a new user
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const newUser = await addUser(email, password);
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
    const { email, password } = req.headers;
    if (!email ||!password) return res.status(400).json({ error: 'Email and password are required' });

    const verifiedUser = await verifyUser(email, password);
    if (!verifiedUser) return res.status(401).json({ error: 'Invalid credentials' });

    res.json(verifiedUser);
});

module.exports = router;