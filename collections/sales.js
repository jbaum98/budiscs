Sales = new Meteor.Collection("sales");
Sales.allow({
    insert: function() {
        'use strict';
        return true;
    }
})