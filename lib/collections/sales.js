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
var SalesSchema = new SimpleSchema({
    title: {
        type: String,
        label: "Title"
    },
    colors: {
        type: [String],
        label: "Disc Colors"
    },
    active: {
        type: Boolean,
        label: "Active"
    },
    dateCreated: {
        type: Date,
        label: "Date Created",
        autoValue: function() {
            'use strict';
            if (this.isInsert) {
              return new Date;
            } else if (this.isUpsert) {
              return {$setOnInsert: new Date};
            } else {
              this.unset();
            }
        }
    },
    dateModified: {
        type: Date,
        label: "Date Modified",
        autoValue: function() {
            'use strict';
            if (this.isUpdate) {
                return new Date();
             }
        },
        denyInsert: true,
        optional: true
    }
});
Sales.attachSchema(SalesSchema);