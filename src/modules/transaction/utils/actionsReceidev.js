const {addMonths} = require("date-fns")

const Received = require('../entities/Received')

async function createDebit(transaction, dateReceived){
  const newValue = transaction.value - (transaction.value * 0.028);

  const recevived = new Received({
    status: "received",
    date_received: dateReceived
  })

  transaction.received.push({_id: recevived._id})
  transaction.value = newValue.toFixed(2);
  // console.log("transaction", transaction)
  // console.log("received", recevived)
  await recevived.save();
  await transaction.save();
}

async function createCredit(transaction, dateReceived){
  const date = addMonths(dateReceived, 1)
  const newValue = transaction.value - (transaction.value * 0.032);

  const recevived = new Received({
    status: "expected",
    date_received: date
  })

  transaction.received.push({_id: recevived._id})
  transaction.value = newValue.toFixed(2);

  // console.log("transaction", transaction)
  // console.log("received", recevived)
  await recevived.save();
  await transaction.save();
}

async function createInstallmentCredit(transaction, dateReceived, installments){
  const percentage = installments <= 6 ?  0.038 : 0.042;
  const newValue = transaction.value - (transaction.value * percentage);

  for(i=1; i<=installments; i++){
    const date = addMonths(dateReceived, i)
    const recevived = await Received.create({
      status: "expected",
      date_received: date
    })

    transaction.received.push({_id: recevived._id})
    transaction.value = newValue.toFixed(2);
  }

  // console.log("transaction", transaction)

  await transaction.save();
}

module.exports = {
  "debit": createDebit,
  "credit": createCredit,
  "installmentCredit": createInstallmentCredit
}
