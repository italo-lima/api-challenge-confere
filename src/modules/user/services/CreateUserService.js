const User = require("../entities/User")
const AppError = require('../../../shared/errors/AppError')
const {generateHash} = require('../utils/generateHash')

class CreateUserService {

  async execute({name, email, password}) {

    const checkUser = await User.findOne({email})

    if(checkUser){
      throw new AppError("Email Already in use");
    }

    const passwordHash = await generateHash(password)

    const user = await User.create({name, email, password: passwordHash})

    const {_id} = user

    return {name, email,_id}
  }
}

module.exports = CreateUserService;
