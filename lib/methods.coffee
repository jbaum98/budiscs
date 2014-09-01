Meteor.methods
    setActiveSale: (sale_id) ->
        Meteor.call "removeActiveSale"
        Sales.update sale_id, {$set: {active: true} }
        return

    removeActiveSale: ->
        Sales.update {active: true}, {$set: {active: false} }, {multi: true}
        return

    checkDuplicateOrder: (name, bunk, sale_id) ->
        Orders.find({ $and: [{name: name}, {bunk: bunk}, {sale_id: sale_id}] },
            fields:
                _id: 1
        ).count() < 1
