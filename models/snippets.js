const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes
const IV_LENGTH = 16; // AES requires a 16-byte IV

// Load snippets from JSON file
const filePath = path.join(__dirname, '../data/snippets.json');
let snippets = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
let nextId = snippets.length > 0 ? snippets[snippets.length - 1].id + 1 : 1;

// Helper functions for encryption and decryption
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const [iv, encryptedText] = text.split(':');
  if (!iv || !encryptedText) throw new Error('Invalid encrypted data format');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Save snippets to JSON file
function saveSnippets() {
  fs.writeFileSync(filePath, JSON.stringify(snippets, null, 2));
}

// Get all snippets (decrypt code before returning)
function getAllSnippets() {
  return snippets.map(snippet => ({
    ...snippet,
    code: decrypt(snippet.code),
  }));
}

// Get snippet by ID (decrypt code before returning)
function getSnippetById(id) {
  const snippet = snippets.find(snippet => snippet.id === id);
  if (!snippet) return null;
  return { ...snippet, code: decrypt(snippet.code) };
}

// Add a new snippet (encrypt code before saving)
function addSnippet(language, code) {
  const encryptedCode = encrypt(code);
  const newSnippet = { id: nextId++, language, code: encryptedCode };
  snippets.push(newSnippet);
  saveSnippets();
  return newSnippet;
}

module.exports = { getAllSnippets, getSnippetById, addSnippet };
