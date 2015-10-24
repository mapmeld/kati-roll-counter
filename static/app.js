$(function () {
  var myOrders = [];
  var localName;
  var socket = io.connect('http://localhost:3000/');
  
  socket.on('newPerson', function (msg) {
    if (msg.order === order_id && msg.name !== localName) {
      allOrders[msg.name] = [];
    }
  });
  socket.on('setOrder', function (msg) {
    if (msg.order === order_id) {
      allOrders[msg.name] = msg.food;
      recalculateAllOrders();
    }
  });

  // start buttons off as disabled to make sure person enters a name
  $(".single, .double").attr("disabled", true);
  $(".wantorder").click(function () {
    if ($(".name").val().length) {
      localName = $(".name").val().trim();
      $(".single, .double").attr("disabled", false);
      $(".wantorder").text("Included");
      socket.emit('newPerson',
        {
          order: order_id,
          name: localName
        });
    }
  });

  // add an order
  $(".single, .double").click(function(e) {
    var button = $(e.currentTarget);
    var roll = button.parents("li").find("strong").text();
    var single = true;
    if (button.hasClass("double")) {
      single = false;
    }
    var adding = true;
    for (var i = 0; i < myOrders.length; i++) {
      if (myOrders[i] !== null && myOrders[i].roll === roll) {
        button.parents("li").find("button").css({ background: "#afa" });
        if (myOrders[i].single === single) {
          myOrders[i] = null;
          adding = false;
          break;
        }
        myOrders[i] = null;
      }
    }
    if (adding) {
      var price = button.text() * 1;
      button.css({ background: "#aaf" });
      myOrders.push({
        roll: roll,
        single: single,
        price: price
      });
    }
    recalculateMyOrder();
  });

  function recalculateMyOrder() {
    var price = 0;
    var orderTexts = [];
    for (var i = 0; i < myOrders.length; i++) {
      if (myOrders[i] !== null) {
        orderText = myOrders[i].roll;
        if (!myOrders[i].single) {
          orderText += "(x2)";
        }
        orderTexts.push(orderText);
        price += myOrders[i].price;
      }
    }
    $(".order").text(orderTexts.join(", "));
    $(".price").text("$" + price.toFixed(2));
    socket.emit('setOrder',
      {
        order: order_id,
        name: localName,
        food: orderTexts.join(", ")
      });
  }
  
  function recalculateAllOrders() {
    var price = 0;
    var ordersByRoll = {};
    for (var person in allOrders) {
      for (var i = 0; i < allOrders[person].length; i++) {
        var thisItem = allOrders[person][i];
        if (thisItem !== null) {
          if (!ordersByRoll[thisItem.roll]) {
            ordersByRoll[thisItem.roll] = 0;
          }
          if (myOrders[i].single) {
            ordersByRoll[thisItem.roll]++;
          } else {
            ordersByRoll[thisItem.roll]+=2;
          }
        }
      }
    }
    var orderTexts = [];
    for (var roll in ordersByRoll) {
      orderTexts.push(ordersByRoll[roll] + " of " + roll);
    }
    $(".allOrders").text(orderTexts.join(", "));
  }
});