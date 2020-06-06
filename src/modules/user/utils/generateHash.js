const bcrypt = require('bcryptjs')

async function generateHash(password) {
  return bcrypt.hash(password, 8)
}

module.exports = {
  generateHash
}