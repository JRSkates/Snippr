const express = require('express');
const router = express.Router();
const { getAllSnippets, getSnippetById, addSnippet, getSnippetsByLanguage } = require('../models/snippets');

// GET all snippets
router.get('/', (req, res) => {
  const { lang } = req.query;
  if (lang) {
    const snippets = getSnippetsByLanguage(lang);
    res.json(snippets);
  } else {
    const snippets = getAllSnippets();
    res.json(snippets);
  }
});

// GET snippet by ID
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const snippet = getSnippetById(id);
  if (snippet) {
    res.json(snippet);
  } else {
    res.status(404).json({ error: 'Snippet not found' });
  }
});

// POST create a new snippet
router.post('/', (req, res) => {
  const { language, code } = req.body;
  if (!language || !code) {
    res.status(400).json({ error: 'Language and code are required' });
    return;
  }
  const newSnippet = addSnippet(language, code);
  res.status(201).json(newSnippet);
});

module.exports = router;
