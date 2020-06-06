const CreateUserService = require('../services/CreateUserService')

class UserController{
    async store(req, res){

      const {name, email, password} = req.body

      const createUserService = new CreateUserService();
    
      const response = await createUserService.execute({name, email, password})

      return res.json(response)
    }
}

module.exports = new UserController();