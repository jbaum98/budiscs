Template.new_order.events
    "change #picking_up": ->
        $("#recipient").parent().toggle
            effect: "blind"
            duration: 200

        $("#bunk").attr "placeholder", (if $("#bunk").attr("placeholder") is "Your bunk" then "Recipient's bunk" else "Your bunk")

    "submit form": (event) ->
        event.preventDefault()
        form = $(event.currentTarget)
        name = form.find("input#name").val()
        picking_up = form.find("input#picking_up").prop("checked")
        recipient = (if picking_up then `undefined` else form.find("input#recipient").val())
        bunk = form.find("input#bunk").val()
        email = form.find("input#email").val()
        discs = (parseInt disc.getElementsByTagName("text")[0].innerHTML for disc in $('.discs') )
        obj =
            name: name
            picking_up: picking_up
            recipient: recipient
            bunk: bunk
            email: email
            discs: discs
        #console.log(obj);
        unless Session.get("order_id")
            #console.log('calling');
            Orders.insert obj, (error, result) ->
                if result
                    Meteor.subscribe "orderById", result,
                        onReady: ->
                            Session.set "order_id", result
                            console.log(result);
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

$(document).ready ->
    $("input").iCheck
        checkboxClass: "icheckbox_flat"
        increaseArea: "20%"

Meteor.startup ->

#  Deps.autorun -> #display invalidation messages
#    keys = OrdersSchema.namedContext().invalidKeys()
#    i = 0
#
#    while i < keys.length
#      key = keys[i].name
#      message = OrdersSchema.namedContext().keyErrorMessage(key)
#      el = $("input#" + key)
#
#      el.before "<div style=\"display:none\"><small>" + message + "</small></div>"
#      el.parent().find("div[style='display:none']").show
#        effect: "blind"
#        duration: 200
#      i++
#    return

    return

