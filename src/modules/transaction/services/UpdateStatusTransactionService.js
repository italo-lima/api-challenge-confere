const Transaction = require('../entities/Transaction')
const Received = require('../entities/Received')

const AppError = require('../../../shared/errors/AppError')

class UpdateStatusTransactionService {

  async execute({id, received, status}) {

    const transaction = await Transaction.findOne({_id: id, "received": {"$in": received}}).populate("received")

    if(!transaction){
      throw new AppError('Transaction not found', 404)
    }

    const checkReceived = await Received.findById(received)

    checkReceived.status = status;

    await checkReceived.save();

    const { _id, date_received} = checkReceived

    return {_id, date_received, status, idTransaction: transaction._id};
  }
}

module.exports = UpdateStatusTransactionService
