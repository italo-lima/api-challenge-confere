const {Router} = require('express')
const {createUser} = require('../validations/UserValidation')

const UsersController = require('../controllers/UsersController')
const routes = Router()

routes.post('/', createUser, UsersController.store);

module.exports = routes;