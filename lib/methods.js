Meteor.methods({
    setActiveSale: function (sale_id) {
        'use strict';
        Meteor.call('removeActiveSale');
        Sales.update(sale_id, {
            $set: {
                active: true
            }
        });
    },
    removeActiveSale: function () {
        'use strict';
        Sales.update({
            active: true
        }, {
            $set: {
                active: false
            }

        }, {
            multi: true
        });
    },
    checkDuplicateOrder: function (name, bunk, sale_id) {
        'use strict';
        return Orders.find({$and: [
            { name: name },
            { bunk: bunk },
            { sale_id: sale_id }
        ] }, {fields: {_id: 1}}).count() < 1;
    }
});