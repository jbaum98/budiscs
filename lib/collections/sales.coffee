@Sales = new Meteor.Collection("sales")

Sales.allow
    insert: ->
        true

    update: ->
        true

@SalesSchema = new SimpleSchema
    title:
        type: String
        label: "Title"
    
    colors:
        type: [String]
        label: "Disc Colors"

    active:
        type: Boolean
        label: "Active"

    dateCreated:
        type: Date
        label: "Date Created"
        autoValue: ->
            switch
                when @isInsert then new Date
                when @isUpsert then { $setOnInsert: new Date }
                else @unset()

    dateModified:
        type: Date
        label: "Date Modified"
        autoValue: ->
            new Date() if @isUpdate
        denyInsert: true
        optional: true

Sales.attachSchema SalesSchema
