const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../src/shared/http/index');
const User = require("../../src/modules/user/entities/User")
const UserService = require('../../src/modules/user/services/CreateUserService');

mongoose.connect('mongodb://localhost:27017/challenge-confere-authentication-test', {
  useNewUrlParser: true
})

afterEach(async () => {
  await User.deleteMany()
  await mongoose.connection.db.dropDatabase()
});

beforeEach(async () => {
  await User.deleteMany()
});

describe('Authetication', () => {

  it('should receive JWT token when autenticated with valid credentials', async () => {
    const userService = new UserService();
    const user = await userService.execute({name: "Ítalo", email: "italo@email.com", password: "123456"})

    const response = await request(app)
      .post('/session')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.status).toBe(200);
  })

  it('should not authenticated with invalid credentials', async () => {
      const userService = new UserService();
      const user = await userService.execute({name: "Ítalo", email: "italo@email.com", password: "123456"})

    const response = await request(app)
      .post('/session')
      .send({
        email: user.email,
        password: '1234567'
      })

    expect(response.status).toBe(401);
  })

  it('should return jwt token when authenticted', async () => {
    const userService = new UserService();
    const user = await userService.execute({name: "Ítalo", email: "italo@email.com", password: "123456"})

    const response = await request(app)
      .post('/session')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.body).toHaveProperty('token')
  })

  it('should not be able to create jwt token if user not exists', async () => {

    const response = await request(app)
      .post('/session')
      .send({
        email: 'italo@email.com',
        password: '123456'
      })

    expect(response.status).toBe(404)
  })

})
