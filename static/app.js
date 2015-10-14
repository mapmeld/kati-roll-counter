$(function () {
  var myOrders = [];

  // start buttons off as disabled to make sure person enters a name
  $(".single, .double").attr("disabled", true);
  $(".wantorder").click(function () {
    if ($(".name").val().length) {
      $(".single, .double").attr("disabled", false);
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
        $("li button").css({ background: "#afa" });
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
    $(".price").text("$" + price);
  }
});
