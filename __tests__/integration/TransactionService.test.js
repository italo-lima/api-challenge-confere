const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../src/shared/http/index');
const Transaction = require("../../src/modules/transaction/entities/Transaction")
const UserService = require('../../src/modules/user/services/CreateUserService');
const AppError = require('../../src/shared/errors/AppError');
const CreateSessionService = require('../../src/modules/user/services/CreateSessionService')
const CreateTransactionService = require('../../src/modules/transaction/services/CreatetransactionService');
const DeleteTransactionService = require('../../src/modules/transaction/services/DeleteTransactionService');
const UpdateStatusTransactionService = require('../../src/modules/transaction/services/UpdateStatusTransactionService');

const mockDebit = {
	"value": 150.00,
	"description": "Bicicleta ZXY Aro 22",
	"type": "debit",
	"installments": null,
	"card": {
		"number": "5200555500001234",
		"expiry": "20/21",
		"cvv": "123",
		"holder": "Fulano de tal"
	}
}

const mockCredit = {
	"value": 150.00,
	"description": "Bicicleta ZXY Aro 22",
	"type": "credit",
	"installments": 1,
	"card": {
		"number": "5200555500001234",
		"expiry": "20/21",
		"cvv": "123",
		"holder": "Fulano de tal"
	}
}

const mockInstalmentsCredit = {
	"value": 150.00,
	"description": "Bicicleta ZXY Aro 22",
	"type": "installment_credit",
	"installments": 6,
	"card": {
		"number": "5200555500001234",
		"expiry": "20/21",
		"cvv": "123",
		"holder": "Fulano de tal"
	}
}

mongoose.connect('mongodb://localhost:27017/challenge-confere-transaction-service', {
  useNewUrlParser: true
})

afterEach(async () => {
  await Transaction.deleteMany()
  await mongoose.connection.db.dropDatabase()
});

beforeEach(async () => {
  await Transaction.deleteMany()
});

describe('Transaction', () => {

  it('allows you to create a credit type transaction', async () => {
    const createTransactionService = new CreateTransactionService()
    const userService = new UserService()
    const user = await userService.execute({name:"Ítalo", email:"italo@email.com", password:"123456"})

    const transaction = await createTransactionService.execute({...mockCredit, idUser: user._id})
    expect(transaction.received).toHaveLength(1)
  })

  it('allows you to create a debit type transaction', async () => {
    const createTransactionService = new CreateTransactionService()
    const userService = new UserService()
    const user = await userService.execute({name:"Ítalo", email:"italo@email.com", password:"123456"})

    const transaction = await createTransactionService.execute({...mockDebit, idUser: user._id})

    expect(transaction.received).toHaveLength(1)
  })

  it('allows you to create a installment credit type transaction', async () => {
    const createTransactionService = new CreateTransactionService()
    const userService = new UserService()
    const user = await userService.execute({name:"Ítalo", email:"italo@email.com", password:"123456"})

    const transaction = await createTransactionService.execute({...mockInstalmentsCredit, idUser: user._id})

    expect(transaction.received).toHaveLength(6)
  })

  it('does not allow to create an installment credit type transaction with an invalid number of installments', async () => {
    const createTransactionService = new CreateTransactionService()
    const userService = new UserService()
    const user = await userService.execute({name:"Ítalo", email:"italo@email.com", password:"123456"})

    expect(createTransactionService.execute({
      "value": 150.00,
      "description": "Bicicleta ZXY Aro 22",
      "type": "credit",
      "installments": 0,
      "card": {
        "number": "5200555500001234",
        "expiry": "20/21",
        "cvv": "123",
        "holder": "Fulano de tal"
      },
      "idUser": user._id
    })).rejects.toBeInstanceOf(AppError)
  })

  it('does not allow to create an debit type transaction with a number of installments other than null', async () => {
    const createTransactionService = new CreateTransactionService()
    const userService = new UserService()
    const user = await userService.execute({name:"Ítalo", email:"italo@email.com", password:"123456"})

    expect(createTransactionService.execute(
      {
      "value": 150.00,
      "description": "Bicicleta ZXY Aro 22",
      "type": "debit",
      "installments": 1,
      "card": {
        "number": "5200555500001234",
        "expiry": "20/21",
        "cvv": "123",
        "holder": "Fulano de tal"
      },
      "idUser": user._id
    }
    )).rejects.toBeInstanceOf(AppError)
  })

  it('does not allow to create a credit type transaction with a number of invalid installments', async () => {
    const createTransactionService = new CreateTransactionService()
    const userService = new UserService()
    const user = await userService.execute({name:"Ítalo", email:"italo@email.com", password:"123456"})

    expect(createTransactionService.execute(
      {
      "value": 150.00,
      "description": "Bicicleta ZXY Aro 22",
      "type": "installment_credit",
      "installments": 13,
      "card": {
        "number": "5200555500001234",
        "expiry": "20/21",
        "cvv": "123",
        "holder": "Fulano de tal"
      },
      "idUser": user._id
    }
    )).rejects.toBeInstanceOf(AppError)
  })

  it('allows you to delete an existing transaction', async () => {
    const userService = new UserService()
    const createTransactionService = new CreateTransactionService()
    const deleteTransactionService = new DeleteTransactionService()
    const user = await userService.execute({name:"Ítalo", email:"italo@email.com", password:"123456"})

    const transaction = await createTransactionService.execute({...mockCredit, idUser: user._id});
    const response = await deleteTransactionService.execute(transaction._id)

    expect(response).toBe(true);
  })

  it('does not allow deleting a not existent transaction', async () => {
    const deleteTransactionService = new DeleteTransactionService()

    expect(deleteTransactionService.execute(`5ed83bea4c1ee6915cb182c2`)).rejects.toBeInstanceOf(AppError);
  })

  it('allows you to return all transactions', async () => {
    const userService = new UserService();
    const createTransactionService = new CreateTransactionService()
    const createSessionService = new CreateSessionService()
    const user = await userService.execute({name: "Ítalo", email: "italo@email.com", password: "123456"})
    const {token} = await createSessionService.excute({email: "italo@email.com", password: "123456"})
    await createTransactionService.execute({...mockCredit, idUser: user._id});

    const response = await request(app)
      .get('/transaction')
      .set('Authorization', `Bearer ${token}`)

    expect(response.body).toBeInstanceOf(Array);
  })


  it('allows you to make changes to the transaction', async () => {
    const userService = new UserService()
    const user = await userService.execute({name:"Ítalo", email:"italo@email.com", password:"123456"})
    const createTransactionService = new CreateTransactionService()
    const transaction = await createTransactionService.execute({...mockCredit, idUser: user._id});
    const updateTransactionService = new UpdateStatusTransactionService()
    const response = await updateTransactionService.execute({
      id: transaction._id,
      received: transaction.received[0]._id,
      status: "received"
    })

    expect(response.status).toEqual('received');
  })

  it('does not allow changes to be made if there is no transaction', async () => {
    const updateTransactionService = new UpdateStatusTransactionService()

    expect(updateTransactionService.execute(
      {
      id: "5ed83b874c1ee6915cb182ba",
      received: "5ed83b874c1ee6915cb182ba",
      status: "received"
    }
    )).rejects.toBeInstanceOf(AppError)
  })

})
