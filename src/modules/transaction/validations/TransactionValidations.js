const {celebrate, Joi, Segments} = require('celebrate')

module.exports = {
  postTransaction: celebrate({
    [Segments.BODY]: Joi.object().keys({
      value: Joi.number().required(),
      description: Joi.string().required(),
      type: Joi.string().valid("credit", "debit", "installment_credit").lowercase().required(),
      installments: Joi.number().allow(null).min(1).max(12).required(),
      card: {
        number: Joi.string().min(15).required(),
        expiry: Joi.string().required(),
        cvv: Joi.string().required(),
        holder: Joi.string().required()
      }
    })
   }),
   getTransactions: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      limit: Joi.number(),
      type: Joi.string().valid("credit", "debit", "installment_credit").lowercase(),
      minValue: Joi.number(),
      maxValue: Joi.number()
    })
  }),
  destroyTransaction: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required()
    })
  }),
  updateStateReceived: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
      received: Joi.string().required()
    })
  })
}