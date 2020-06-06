require('dotenv').config()
require('express-async-errors');

const express = require('express')
const routes = require('../http/routes')
const {errors} = require('celebrate')

const database = require("../config/database")
const AppError = require('../errors/AppError')

const app = express()

app.use(express.json())
app.use(routes)
app.use(errors())

// tratativa de erros global (global exception handler)
app.use((err, req, res, _) => {

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: 'Error', message: err.message });
  }

  return res.status(500).json({
    status: '500',
    message: err,
  });
});

module.exports = app