Sales = new Meteor.Collection("sales");
Sales.allow({
    insert: function () {
        'use strict';
        return true;
    },
    update: function () {
        'use strict';
        return true;
    }
})