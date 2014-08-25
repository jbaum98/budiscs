Orders = new Meteor.Collection("orders")
Orders.before.insert(function (userId, doc) {
    doc.name = doc.name.trimplus().capitalize();
    var bunk_reg = /^([a|b])-?(\d+)/i,
        match_data = doc.bunk.match(bunk_reg);
    if (match_data) {
        doc.bunk = match_data[1].toUpperCase() + '-' + match_data[2]
    } else {
        doc.bunk = doc.bunk.trimplus().toLowerCase();
    }
    doc.dateCreated = new Date();
})

Orders.allow({
    insert: function (userId, doc) {
        return doc.name && (doc.picking_up || doc.recipient) && doc.bunk
    }
})

Orders.deny({
    insert: function (userId, doc) {
        var disc_total = doc.discs.reduce(function (a, b) {
            return a + b
        })
        if (disc_total < 1) {
            return true
        }
        if (doc.email && !doc.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i)) {
            return true
        }
        if (Orders.find({
            $and: [{
                    name: doc.name
            },
                {
                    bunk: doc.bunk

            }
                  ]
        }).count()) {
            return true
        }
    }
})

//Orders.after.insert()