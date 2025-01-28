const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // JWT secret key from .env file
const filePath = path.join(__dirname, '../data/users.json');

let users = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
let nextUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

// Helper function to save users to the JSON file
function saveUsersToFile() {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

// Create a new user (hash password before saving)
async function addUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: nextUserId++, email, password: hashedPassword };
  users.push(user);

  // Save the new user to the JSON file
  saveUsersToFile();

  return { id: user.id, email: user.email }; // Exclude the password from the response
}

// Find a user by email
function getUserByEmail(email) {
  return users.find(user => user.email === email);
}

// Authenticate a user and return a JWT
async function authenticateUser(email, password) {
  const user = getUserByEmail(email);
  if (!user) return null; // User not found

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null; // Password mismatch

  // Generate a JWT for the user
  const token = jwt.sign(
    { id: user.id, email: user.email }, // Payload
    JWT_SECRET, // Secret key
    { expiresIn: '24h' } // Token expiration time
  );

  return token;
}

// Verify a JWT token
function verifyToken(token) {
  try {
    // Decode and verify the token using the secret key
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // Token is invalid or expired
  }
}

module.exports = { addUser, getUserByEmail, authenticateUser, verifyToken };
