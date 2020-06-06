const jwt = require('jsonwebtoken')
const {secret} = require('../../../modules/user/config/auth')
const { promisify } = require('util') // Converte callbak em promisse
const AppError = require('../../../shared/errors/AppError')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const [, token] = authHeader.split(' ')
  
  if (!token) {
    throw new AppError('Token not provider')
  }
  
  try {
  const decoded = await promisify(jwt.verify)(token, secret)

  req.headers.idUser = decoded.id
  
  return next()

  } catch {
    throw new AppError('Token Invalid')
  }
}