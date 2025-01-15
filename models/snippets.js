const fs = require('fs');
const path = require('path');

// Load seed data from the JSON file
const filePath = path.join(__dirname, '../data/snippets.json');
let snippets = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let nextId = snippets.length + 1;

// Get all snippets
function getAllSnippets() {
  return snippets;
}

// Get snippet by ID
function getSnippetById(id) {
  return snippets.find(snippet => snippet.id === id);
}

// Add a new snippet
function addSnippet(language, code) {
  const newSnippet = { id: nextId++, language, code };
  snippets.push(newSnippet);

  // Persist the new snippet to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(snippets, null, 2));
  return newSnippet;
}

// Get snippets by language
function getSnippetsByLanguage(lang) {
  return snippets.filter(snippet => snippet.language.toLowerCase() === lang.toLowerCase());
}

module.exports = { getAllSnippets, getSnippetById, addSnippet, getSnippetsByLanguage };
