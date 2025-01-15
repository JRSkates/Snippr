const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

// Load the user data from the JSON file
const filePath = path.join(__dirname, '../data/users.json');
let users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
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

// Verify user credentials
async function verifyUser(email, password) {
  const user = getUserByEmail(email);
  if (!user) return false;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? { id: user.id, email: user.email } : null;
}

module.exports = { addUser, getUserByEmail, verifyUser };
