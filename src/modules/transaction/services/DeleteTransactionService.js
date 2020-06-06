const Transaction = require('../entities/Transaction')

const AppError = require('../../../shared/errors/AppError')

class DeleteTransactionsService {

  async execute(id) {

    const transaction = await Transaction.findById(id)

    if(!transaction){
      throw new AppError('Transaction not found', 404)
    }
    
    await transaction.remove();

    return true;
  }
}

module.exports = DeleteTransactionsService