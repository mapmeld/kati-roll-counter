express = require 'express'
bodyParser = require 'body-parser'
compression = require 'compression'
mongoose = require 'mongoose'

Order = require './models/order'
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost')

app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express['static'](__dirname + '/static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())

server = require('http').Server(app)
io = require('socket.io')(server)
io.on('connection', (socket) ->
  socket.on('newPerson', (data) ->
    socket.emit('newPerson', data)
    Order.findOne({ _id: data.order }, (err, order) ->
      if order
        if !order.orders
          order.orders = {}
        order.orders[data.name] = []
        order.save()
    )
  )
  socket.on('setOrder', (data) ->
    socket.emit('setOrder', data)
    Order.findOne({ _id: data.order }, (err, order) ->
      if order
        order.orders[data.name] = order.food
        order.save()
    )
  )
)

app.get('/', (req, res) ->
  res.render 'index'
)

app.get('/neworder', (req, res) ->
  x = new Order()
  x.orders = {}
  x.firstPerson = true
  x.save( ->
    res.redirect '/order/' + x._id
  )
)

app.get('/order/:order_id', (req, res) ->
  Order.findOne({ _id: req.params.order_id }, (err, order) ->
    res.render('order', {
      order: order
    })
    if order.firstPerson
      order.firstPerson = false
      order.save
  )
)

server.listen(process.env.PORT || 3000, ->
  console.log 'started server'
)

module.exports = app
