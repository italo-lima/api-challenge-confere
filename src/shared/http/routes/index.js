const { Router } = require('express');

const transactionRoutes = require('../../../modules/transaction/routes');
const sessionRoutes = require('../../../modules/user/routes/session.routes');
const userRoutes = require('../../../modules/user/routes/user.routes');

const routes = Router();

routes.use('/transaction', transactionRoutes);
routes.use('/session', sessionRoutes);
routes.use('/user', userRoutes);

module.exports = routes;