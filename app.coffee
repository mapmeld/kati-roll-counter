express = require 'express'
bodyParser = require 'body-parser'
compression = require 'compression'
mongoose = require 'mongoose'
socket = require 'socket.io'

Order = require './models/order'
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost')

app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express['static'](__dirname + '/static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())

app.get('/', (req, res) ->
  res.render 'index'
)

app.get('/neworder', (req, res) ->
  x = new Order()
  x.save( ->
    res.redirect '/order/' + x._id
  )
)

app.get('/order/:order_id', (req, res) ->
  Order.findOne({ _id: req.params.order_id }, (err, order) ->
    res.render('order', {
      order: order
    })
  )
)

app.listen(process.env.PORT || 3000, ->
  console.log 'started server'
)

module.exports = app
