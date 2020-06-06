const {format, parseISO} = require("date-fns")

const Transaction = require('../entities/Transaction')

const {credit, debit, installmentCredit} = require('../utils/actionsReceidev')
const AppError = require('../../../shared/errors/AppError')

const lastFourCardNumbers = require('../../../shared/utils/lastFourCardNumbers')

class CreateTransactionService {

  async execute(data) {
    const type = data.type.toLowerCase();
    const installments = data.installments

    if(type === "debit" && installments != null){
      throw new AppError("Debt cannot have installments ", 401);

    } else if(type === "credit" && installments != 1){
      throw new AppError("Credit must have a portion", 401)

    } else if(type==='installment_credit' && (installments <2 || installments > 12)){
      throw new AppError("Number of invalid installments for installment credit", 401)
    }

    const numbers = data.card.number;
    const initialNumbers = Number(numbers.length) - 4;
    const finalNumbers = String(numbers).length;

    const numbersCard = lastFourCardNumbers(numbers, initialNumbers, finalNumbers)
    data.card.number = numbersCard;

    const transaction = new Transaction(data)
    const dateNow = new Date();
    const dateForm = parseISO(format(dateNow, "yyyy-MM-dd"))

    if(type === "credit") {
      await credit(transaction, dateForm)
    }
    else if(type==="debit"){
      await debit(transaction, dateForm)
    } else {
      await installmentCredit(transaction, dateForm, data.installments);
    }

    return transaction
  }
}

module.exports = CreateTransactionService
