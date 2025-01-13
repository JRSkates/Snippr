let snippets = [
    { id: 1, language: 'JavaScript', code: 'console.log("Hello, world!");' },
    { id: 2, language: 'Python', code: 'print("Hello, world!")' },
  ];
  
  let nextId = 3;
  
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
    return newSnippet;
  }
  
  // Get snippets by language
  function getSnippetsByLanguage(lang) {
    return snippets.filter(snippet => snippet.language.toLowerCase() === lang.toLowerCase());
  }
  
  module.exports = { getAllSnippets, getSnippetById, addSnippet, getSnippetsByLanguage };
  