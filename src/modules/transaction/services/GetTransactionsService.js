const Transaction = require('../entities/Transaction')

class GetTransactionsService {

  async execute({type, limit, minValue, maxValue}) {
    const limitTransaction = Number(limit)
    let transactions = []

    if(type && maxValue>0){
      transactions = await Transaction.find({type ,"value":{"$gte":minValue,"$lte":maxValue}}).limit(limitTransaction).populate('received')
    } else if(type) {
      transactions = await Transaction.find({type}).limit(limitTransaction).populate('received')
    }else if(maxValue){
      transactions = await Transaction.find({"value":{"$gte":minValue,"$lte":maxValue}}).limit(limitTransaction).populate('received')
    } else {
      transactions = await Transaction.find().limit(limitTransaction).populate('received')
    }
    
    return transactions;
  }
}

module.exports = GetTransactionsService