@Orders = new Meteor.Collection("orders")

Orders.allow
  insert: -> true
  update: (userId, doc, fieldNames, modifier) -> true
  remove: -> true

@OrdersSchema = new SimpleSchema
    name:
        type: String
        label: "Name"
        autoValue: ->
            @value.trimplus().capitalize() if @isSet
        custom: ->
            if Meteor.isClient and @isSet
                Meteor.call "isDuplicate", @field("name").value, @field("bunk").value, @field("sale_id").value, (error, result) ->
                    if result
                        OrdersSchema.namedContext().addInvalidKeys [
                            {
                                name: "name"
                                type: "duplicate"
                            }, {
                                name: "bunk"
                                type: "duplicate"
                            }
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
            "required" if not @field('picking_up') and not @isSet and (not @operator or (@value is null or @value is ""))
        autoValue: ->
            @unset if @field('picking_up')
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

    discs:
        type: [Number]
        label: "Disc Quantities"
        min: 0
        custom: ->
            if @value.total() < 1
                "minTotal"
            else
                # console.log @value
                # console.log @field "sale_id"
                # console.log Sales.findOne(@field("sale_id"))
                "notCorrectLength" if @value.length isnt Sales.findOne(@field("sale_id").value,
                    fields:
                        colors: 1
                ).colors.length

    sale_id:
        type: String
        label: "Sale ID"
        regEx: SimpleSchema.RegEx.Id

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
