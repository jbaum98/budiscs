Meteor.publish('activeSale', function () {
    return Sales.find({active: true}); 
});

Meteor.publish('orderById', function (id) {
    return Orders.find(id);
});

/*Meteor.publish('allOrders',function() {
    return Orders.find();
});*/