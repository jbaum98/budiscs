Template.new_order.events({
    'change #picking_up': function () {
        'use strict';
        $("#recipient").parent().toggle({
            effect: "blind",
            duration: 200
        });
        $("#bunk").attr("placeholder", $("#bunk").attr("placeholder") === "Your bunk" ? "Recipient's bunk" : "Your bunk");
    },
    'submit form': function (event) {
        'use strict';
        console.log('submit');
        event.preventDefault();
        var form = $(event.currentTarget),
            name = form.find("input#name").val(),
            picking_up = form.find("input#picking_up").prop('checked'),
            recipient = picking_up ? undefined : form.find("input#recipient").val(),
            bunk = form.find("input#bunk").val(),
            email = form.find("input#email").val(),
            discs = $(".disc").map(function(){return parseInt(this.getElementsByTagName('text')[0].innerHTML); }).toArray(),
            obj = {
                name: name,
                picking_up: picking_up,
                recipient: recipient,
                bunk: bunk,
                email: email,
                discs: discs
            };
        //console.log(obj);
        if (!Session.get("order_id")) {
            //console.log('calling');
            Orders.insert(obj, function (error, result) {
                if (result) {
                    Meteor.subscribe('orderById', result, {
                        onReady: function() {
                            Session.set('order_id', result);
                        }
                    });
                    //console.log(result);
                } else {
                    console.log(error);
                }
            });
        } else {
            Orders.update(Session.get('order_id'), {
                $set: obj
            }, function (error, affected) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(affected);
                }
            });
        }
    },
    'click .plus, click .minus': function (event) {
        'use strict';
        //console.log(event.currentTarget);
        var class_name = $(event.currentTarget).attr("class"),
            container = $(event.currentTarget).parent(),
            index = parseInt(container.attr('data-index')),
            current_cache = Session.get('discs_cache');
        if ( class_name === 'plus') {
            current_cache[index]++;
        } else if (class_name === 'minus' && current_cache[index] > 0) {
            current_cache[index]--;
        }
        Session.set('discs_cache', current_cache)
    },
    "click button[type='submit']": function () {
        'use strict';
        console.log('click');
        $('#new_order_form').submit();
    }
});
setUp = function () { // so can be called once activeSale is subscribed
    Deps.autorun(function () { // keeps discs_cache same length as colors by appending zeroes
            var disc_count = Sales.findOne({active: true}).colors.length, cache;
            Session.setDefault('discs_cache', []);
            for (var i = 0; i < disc_count; i++) {
                var current_cache = Session.get('discs_cache')
                if (current_cache.length <= i) {
                    Session.set('discs_cache', current_cache.concat([0]));
                }
            }
            cache = Session.get('discs_cache');
            if (cache.length > disc_count) {
                Session.set('discs_cache', cache.slice(0,disc_count));
                
            }
    });
    
    Deps.autorun(function() { //update discs_cache when order_id is updated
        var id = Session.get('order_id')
        if (id) {
            Session.set('discs_cache',Orders.findOne(id).discs)
        }
    });
    
    Template.new_order.discs = function () {
        'use strict';
        var discs = [],
            colors = Sales.findOne({active: true}).colors,
            nums = Session.get('discs_cache');
        for (var i = 0; i < colors.length; i++) {
            discs.push({
                color: colors[i],
                num: nums[i],
                index: i
            });
        }
        return discs;
    };
}