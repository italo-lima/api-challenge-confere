const Transaction = require('../entities/Transaction')
const Received = require('../entities/Received')

const AppError = require('../../../shared/errors/AppError')

class UpdateStatusTransactionService {

  async execute({id, received, status}) {

    const transaction = await Transaction.findOne({_id: id, "received": {"$in": received}}).populate("received")

    if(!transaction){
      throw new AppError('Transaction not found', 404)
    }

    if(transaction.type === "debit" && status != 'received'){
      throw new AppError("Debit must only have received status", 401);
    }

    const checkReceived = await Received.findById(received)

    checkReceived.status = status;

    await checkReceived.save();

    const newTransaction = await Transaction.findOne({_id: id}).populate("received")

    return newTransaction;
  }
}

module.exports = UpdateStatusTransactionService
