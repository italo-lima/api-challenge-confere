const mongoose = require('mongoose')

const Received = require('./Received')

const TransactionSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  card: {
    number: {
      type: String,
      required: true
    },
    expiry: {
      type: String,
      required: true
    },
    cvv: {
      type: String,
      required: true
    },
    holder: {
      type: String,
      required: true
    }
  },
  received: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Received'
  }],
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true
}
)

TransactionSchema.pre('remove', async function (next) {
  await Received.deleteMany({ _id : {
    "$in" : this.received
    }
  })

  next()
})

module.exports = mongoose.model('Transactions', TransactionSchema)
