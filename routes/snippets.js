const express = require('express');
const router = express.Router();
const authenticateAuth0 = require('../middleware/auth'); // Updated middleware import
const { getAllSnippets, getSnippetById, addSnippet } = require('../models/snippets');

// POST /snippets: Add a new snippet (protected)
router.post('/', authenticateAuth0, (req, res) => {
  const { language, code } = req.body;
  if (!language || !code) return res.status(400).json({ error: 'Language and code are required' });

  const newSnippet = addSnippet(language, code);
  res.status(201).json(newSnippet);
});

// GET /snippets: Get all snippets (protected)
router.get('/', authenticateAuth0, (req, res) => {
  const snippets = getAllSnippets();
  res.json(snippets);
});

// GET /snippets/:id: Get a snippet by ID (protected)
router.get('/:id', authenticateAuth0, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const snippet = getSnippetById(id);
  if (!snippet) return res.status(404).json({ error: 'Snippet not found' });

  res.json(snippet);
});

module.exports = router;
