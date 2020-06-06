const {celebrate, Joi, Segments} = require('celebrate')

module.exports = {
  createUser: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      password: Joi.string().min(6).required(),
      email: Joi.string().email().required()
    })
   })
}