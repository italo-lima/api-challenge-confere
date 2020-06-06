const User = require("../entities/User")
const jwt = require("jsonwebtoken");

const {expiresIn, secret} = require('../config/auth')
const {comparePassword} = require('../utils/comparePassoword')
const AppError = require('../../../shared/errors/AppError')

class CreateSessionService {

  async excute({email, password}) {

    const user = await User.findOne({email})

    if(!user){
      throw new AppError("User not found", 404);
    }
    
    const checkPassword = await comparePassword(password, user.password)

    if(!checkPassword){
      throw new AppError("Password does not match")
    }

    const { id, name } = user

    return {
        user:{
            id, name, email
        }, 
        token: jwt.sign({id}, secret, {
            expiresIn
        })
      }
  }
}

module.exports = CreateSessionService;