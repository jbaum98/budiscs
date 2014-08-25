UI.registerHelper('active_sale', function () {
    'use strict';
    return Sales.findOne({
        active: true
    });
});


UI.registerHelper('active_sales', function () {
    'use strict';
    return Sales.find({
            active: true
    }).count();
});