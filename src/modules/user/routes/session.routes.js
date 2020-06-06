const {Router} = require('express')
const {sessionCreate} = require('../validations/SessionValidation')

const SessionController = require('../controllers/SessionController')
const routes = Router()

routes.post('/', sessionCreate, SessionController.store);

module.exports = routes;