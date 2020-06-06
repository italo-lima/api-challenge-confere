const mongoose = require('mongoose');

const UserService = require('../../src/modules/user/services/CreateUserService');
const User = require('../../src/modules/user/entities/User')
const AppError = require('../../src/shared/errors/AppError');

mongoose.connect('mongodb://localhost:27017/challenge-confere-user-service', {
  useNewUrlParser: true
})

afterEach(async () => {
  await User.deleteMany()
  await mongoose.connection.db.dropDatabase()
});

beforeEach(async () => {
  await User.deleteMany()
});

describe('User', () => {

  it('allows creating a user', async () => {
    const userService = new UserService();
    const user = await userService.execute({name: "Ítalo", email: "italo@email.com", password: "123456"})

    expect(user).toHaveProperty('_id')
  })

  it('does not allow creating a user with existing email', async () => {
    const userService = new UserService();
    await userService.execute({name: "Ítalo Lima", email: "italo@email.com", password: "123456"})

    expect(userService.execute(
      {
        name: "Ítalo Lima", email: "italo@email.com", password: "123456"
      }
    )).rejects.toBeInstanceOf(AppError)
  })

})
