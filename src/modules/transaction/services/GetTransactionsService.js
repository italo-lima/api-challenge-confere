const Transaction = require('../entities/Transaction')

class GetTransactionsService {

  async execute({type, limit, minValue, maxValue, idUser}) {
    const limitTransaction = Number(limit)
    let transactions = []

    if(type && maxValue>0){
      transactions = await Transaction.find({idUser, type, "value":{"$gte":minValue,"$lte":maxValue}}).limit(limitTransaction).populate('received')
    } else if(type) {
      transactions = await Transaction.find({idUser, type, "value":{"$gte":minValue}}).limit(limitTransaction).populate('received')
    }else if(maxValue){
      transactions = await Transaction.find({idUser, "value":{"$gte":minValue,"$lte":maxValue}}).limit(limitTransaction).populate('received')
    } else if(minValue){
      transactions = await Transaction.find({idUser, "value":{"$gte":minValue}}).limit(limitTransaction).populate('received')
    } else {
      //adicionar idUser depois
      transactions = await Transaction.find({idUser}).limit(limitTransaction).populate('received');
    }

    return transactions;

  }
}

module.exports = GetTransactionsService
