Template.new_order.events
    "change #picking_up": ->
        $("#recipient").parent().toggle
            effect: "blind"
            duration: 200

        $("#bunk").attr "placeholder", (if $("#bunk").attr("placeholder") is "Your bunk" then "Recipient's bunk" else "Your bunk")

    "submit form": (event) ->
        event.preventDefault()
        form = $(event.currentTarget)
        obj =
            name: form.find("input#name").val()
            picking_up: form.find("input#picking_up").prop("checked")
            recipient: form.find("input#recipient").val()
            bunk: form.find("input#bunk").val()
            discs: (parseInt $(disc).find('text').text() for disc in $(".disc")) 
            sale_id: Sales.findOne({active:true},{_id:1})._id
        console.log(obj);
        unless Session.get("order_id")
            #console.log('calling');
            Orders.insert obj, (error, result) ->
                if result
                    Meteor.subscribe "orderById", result,
                        onReady: ->
                            Session.set "order_id", result
                            # console.log(result);
                            return
        else
            Orders.update Session.get("order_id"), { $set: obj }, (error, affected) ->
                if error
                    console.log error
                else
                    console.log affected
                return

        return

    "click .plus, click .minus": (event) ->
        #console.log(event.currentTarget);
        class_name = $(event.currentTarget).attr("class")
        container = $(event.currentTarget).parent().parent()
        index = parseInt(container.attr("data-index"))
        current_cache = Session.get("discs_cache")
        console.log container 
        if class_name is "plus"
            current_cache[index]++ 
        else if class_name is "minus" and current_cache[index] > 0
            current_cache[index]-- 
        Session.set "discs_cache", current_cache
        return

    "click button[type='submit']": ->
        #console.log "click"
        $("#new_order_form").submit()
        return

Template.errors.helpers
    message: (key) ->
        OrdersSchema.namedContext().keyErrorMessage key

Template.new_order.rendered = ->
    $(".errors").hide()
    $("input").iCheck
        checkboxClass: "icheckbox_flat"
        increaseArea: "20%"

Deps.autorun -> #display invalidation messages
    keys = OrdersSchema.namedContext()._schemaKeys
    for key in keys
        el = $(".errors[for='#{key}']")
        hidden = el.css("display") == 'none'
        invalid = OrdersSchema.namedContext().keyIsInvalid(key)
        # console.log key
        # console.log "invalid: #{invalid}"
        # console.log "hidden: #{hidden}"
        if invalid and hidden 
            $(".errors[for='#{key}'] small").text(OrdersSchema.namedContext().keyErrorMessage(key))
            el.show
                effect: "blind"
                duration: 400
        else if not invalid and not hidden
            el.hide
                effect: "blind"
                duration: 200
            $(".errors[for='#{key}'] small").text('')
