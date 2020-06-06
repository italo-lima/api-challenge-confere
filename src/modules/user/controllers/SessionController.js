const CreateSessionService = require('../services/CreateSessionService')

class SessionController{
    async store(req, res){

      const {email, password} = req.body

      const createSessionService = new CreateSessionService();
    
      const response = await createSessionService.excute({email, password})

      return res.json(response)
      
    }
}

module.exports = new SessionController();