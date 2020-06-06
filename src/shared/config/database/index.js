const mongoose = require('mongoose');

mongoose.connect(process.env.url_database, {
  useNewUrlParser: true
})