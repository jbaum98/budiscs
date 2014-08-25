UI.registerHelper('active_sale', function () {
    'use strict';
    return Sales.find({
        active: true
    }).collection.findOne();
});