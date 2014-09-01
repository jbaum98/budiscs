@Orders = new Meteor.Collection("orders")

Orders.allow
  insert: ->
    true

  update: (userId, doc, fieldNames, modifier) ->
    true

@OrdersSchema = new SimpleSchema
    name:
        type: String
        label: "Name"
        autoValue: ->
            @value.trimplus().capitalize() if @isSet
        custom: ->
            Meteor.call "checkDuplicateOrder", @value, @field("bunk"), @field("sale_id"), (error, result) ->
                unless result
                    Orders.SimpleSchema().addInvalidKeys [
                        {name: "duplicate"},
                        {bunk: "duplicate"}
                    ]
                return
            return

    picking_up:
        type: Boolean
        label: "Picking Up"

    recipient:
        type: String
        label: "Recipient"
        optional: true
        custom: ->
            "required" if not @field(picking_up) and not @isSet and (not @operator or (@value is null or @value is ""))
        autoValue: ->
            @value.trimplus().capitalize() if @isSet

    bunk:
        type: String
        label: "Bunk"
        autoValue: ->
            if @isSet
                bunk_reg = /^([a|b])-?(\d+)/i
                match_data = @value.match(bunk_reg)
                if match_data
                    match_data[1].toUpperCase() + "-" + match_data[2]
                else
                    @value.trimplus().toLowerCase()
        custom: ->
            Meteor.call "checkDuplicateOrder", @value, @field("bunk"), @field("sale_id"), (error, result) ->
                unless result
                    Orders.SimpleSchema().addInvalidKeys [
                        {name: "duplicate"},
                        {bunk: "duplicate"}
                    ]
                return
            return

    discs:
        type: [Number]
        label: "Disc Quantities"
        min: 0
        custom: ->
            if @value.total() < 1
                "minTotal"
            else "notCorrectLength" if @value.length isnt Sales.findOne(@field("sale_id"),
                fields:
                    colors: 1
            ).colors.length

    sale_id:
        type: Meteor.Collection.ObjectID
        label: "Sale ID"

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
            new Date()  if @isUpdate
        denyInsert: true
        optional: true

Orders.attachSchema OrdersSchema

OrdersSchema.messages
    notCorrectLength: "[label] must include the correct number of disc quantities to correspond the colors in the Sale."
    duplicate: "There is already another order for this sale with the same name and bunk."
    minTotal: "You must order at least one disc."

