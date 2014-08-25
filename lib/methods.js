Meteor.methods({
    setActiveSale: function (sale_id) {
        Meteor.call('removeActiveSale')
        Sales.update(sale_id, {
            $set: {
                active: true
            }
        })
    },
    removeActiveSale: function () {
        Sales.update({
            active: true
        }, {
            $set: {
                active: false
            }

        }, {
            multi: true
        })
    }
})