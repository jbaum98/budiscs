Meteor.publish "activeSale", ->
    Sales.find
        active: true

Meteor.publish "orderById", (id) ->
    Orders.find id

Meteor.publish 'allOrders', ->
    Orders.find {} 
