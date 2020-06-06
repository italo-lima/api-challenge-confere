const {Router} = require('express')
const Transaction = require('../entities/Transaction')
const {postTransaction, getTransactions, destroyTransaction, updateStateReceived} = require('../validations/TransactionValidations')

const TransactionControllers = require('../controllers/TransactionsControllers')
const routes = Router()

const authMiddleware = require('../../../shared/http/middlewares/auth')

routes.use(authMiddleware)

routes.post('/', postTransaction, TransactionControllers.create);
routes.get('/', getTransactions, TransactionControllers.show);
routes.delete('/:id', destroyTransaction, TransactionControllers.destroy);
routes.put('/:id/:received', updateStateReceived, TransactionControllers.update);

module.exports = routes;
