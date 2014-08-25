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
    }
});