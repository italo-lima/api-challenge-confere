const mongoose = require('mongoose')

const ReceivedSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  date_received: {
    type: Date,
    required: true
  }
},
{
  timestamps: true
}
)

module.exports = mongoose.model('Received', ReceivedSchema)