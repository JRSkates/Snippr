const bcrypt = require('bcrypt');
const users = [];
let nextUserId = 1;

// Create a new user (hash password before saving)
async function addUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: nextUserId++, email, password: hashedPassword };
  users.push(user);
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
