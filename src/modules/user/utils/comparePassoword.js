const bcrypt = require("bcryptjs")

async function comparePassword(password, hashed){
  return bcrypt.compare(password, hashed)
}

module.exports = {
  comparePassword
}