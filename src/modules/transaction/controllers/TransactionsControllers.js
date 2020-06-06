const CreateTransactionService = require('../services/CreatetransactionService')
const GetTransactionsService = require('../services/GetTransactionsService')
const DeleteTransactionService = require('../services/DeleteTransactionService')
const UpdateStatusTransactionService = require('../services/UpdateStatusTransactionService')

class TransactionsController {

  async create(req, res) {
    const data = req.body;
    
    const createTransactionService = new CreateTransactionService();
    
    const response = await createTransactionService.execute(data)

    return res.json(response)

  }

  async show(req, res) {
    const {type, limit=undefined, minValue=0, maxValue} = req.query;
 
    const getTransactionsService = new GetTransactionsService();
    
    const response = await getTransactionsService.execute({type, limit, minValue, maxValue})

    return res.json(response)

  }

  async update(req, res) {
    const {id, received} = req.params;
    const {status} = req.body;

    const updateStatusTransactionService = new UpdateStatusTransactionService();
    
    const transaction = await updateStatusTransactionService.execute({id, received, status})

    return res.json(transaction);

  }

  async destroy(req, res) {
    const {id} = req.params;

    const deleteTransactionsService = new DeleteTransactionService();
    
    await deleteTransactionsService.execute(id)

    return res.status(204).send();

  }
}

module.exports = new TransactionsController();