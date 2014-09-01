Router.map ->
    @route "index",
        path: "/"
        template: "index"
        layoutTemplate: "layout"
        fastRender: true
        waitOn: ->
            Meteor.subscribe "activeSale"

        onAfterAction: ->
            Deps.autorun -> # keeps discs_cache same length as colors by appending zeroes
                colors = Sales.findOne(active: true).colors
                current_cache = if Session.get("discs_cache")? then Session.get("discs_cache") else []
                new_cache = (current_cache[i] or 0 for color, i in colors)
                Session.set "discs_cache", new_cache
                return

            Deps.autorun -> #update discs_cache when order_id is updated
                id = Session.get("order_id")
                Session.set "discs_cache", Orders.findOne(id).discs if id
                return

            Meteor.startup ->
                Template.new_order.discs = ->
                    colors = Sales.findOne(active: true).colors
                    nums = Session.get("discs_cache")
                    discs = ( {color: color, num: nums[i],index: i} for color, i in colors)
            return

    @route "about"
    return


#layoutTemplate:'layout'
