mongoose = require 'mongoose'

orderSchema = mongoose.Schema({
  orders: Object,
  firstPerson: Boolean
})

module.exports = mongoose.model('Order', orderSchema)
