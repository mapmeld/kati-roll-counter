mongoose = require 'mongoose'

orderSchema = mongoose.Schema({
  orders: Array
})

module.exports = mongoose.model('Order', orderSchema)
