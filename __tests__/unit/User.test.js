const mongoose = require('mongoose');

const {generateHash} = require('../../src/modules/user/utils/generateHash');
const {comparePassword} = require('../../src/modules/user/utils/comparePassoword');
const User = require('../../src/modules/user/entities/User')

mongoose.connect('mongodb://localhost:27017/challenge-confere-user-unit-test', {
  useNewUrlParser: true
})

afterEach(async () => {
  await User.deleteMany()
  await mongoose.connection.db.dropDatabase()
});

beforeEach(async () => {
  await User.deleteMany()
});

it('Enables user password encryption', async () => {
  const user = new User({name: "Ítalo", email: "italo@email.com", password: "123456"})
  const passwordHash = await generateHash(user.password)
  const compareHash = await comparePassword("123456", passwordHash)

  expect(compareHash).toBe(true);
})
