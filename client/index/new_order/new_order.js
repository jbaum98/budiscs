Template.new_order.events({
    'change #picking_up': function () {
        'use strict';
        $("#recipient").parent().toggle({
            effect: "blind",
            duration: 200
        });
        $("#bunk").attr("placeholder", $("#bunk").attr("placeholder") === "Your bunk" ? "Recipient's bunk" : "Your bunk");
    },
    'mouseenter .explain.hidden-sm.hidden-xs': function () {
        'use strict';
        $("input#email").popover('show');
    },
    'mouseleave .explain.hidden-sm.hidden-xs': function () {
        'use strict';
        $("input#email").popover('hide');
    },
    'click .explain.visible-sm-inline.visible-xs-inline': function () {
        'use strict';
        $(".help-block").toggle({
            effect: "blind",
            duration: 200
        });
    },
    'submit form': function (event) {
        'use strict';
        console.log('submit');
        event.preventDefault();
        var form = $(event.currentTarget),
            name = form.find("input#name").val(),
            picking_up = form.find("input#picking_up").is(':checked'),
            recipient = picking_up ? undefined : form.find("input#recipient").val(),
            bunk = form.find("input#bunk").val(),
            email = form.find("input#email").val(),
            obj = {
                name: name,
                picking_up: picking_up,
                recipient: recipient,
                bunk: bunk,
                email: email,
                discs: Session.get('discs')
            };
        console.log(obj);
        if (!Session.get("order_id")) {
            console.log('calling');
            Orders.insert(obj, function (error, result) {
                if (result) {
                    Session.set('order_id', result);
                    console.log(result);
                } else {
                    console.log(error);
                }
            });
        } else {
            Orders.update(Session.get('order_id'), {$set: obj}, function (error, affected) {
                if (error) { console.log(error); }
                else {console.log(affected);}
            });
        }
    },
    'click .plus': function (event) {
        'use strict';
        //console.log(event.currentTarget);
        var old = Session.get('discs');
        old[parseInt(event.currentTarget.parentElement.getAttribute("data-num"), 10) - 1] += 1;
        Session.set('discs', old);
    },
    'click .minus': function (event) {
        'use strict';
        //console.log(event.currentTarget);
        var old = Session.get('discs');
        if (old[parseInt(event.currentTarget.parentElement.getAttribute("data-num"), 10) - 1] > 0) {
            old[parseInt(event.currentTarget.parentElement.getAttribute("data-num"), 10) - 1] -= 1;
        }
        Session.set('discs', old);
    },
    "click button[type='submit']": function () {
        'use strict';
        console.log('click');
        $('#new_order_form').submit();
    }
});

$(document).ready(function () {
    'use strict';
    $("input#email").popover({
        content: 'If you provide an email address, we will send you a confirmation email containing the details of your order, as well as a unique link which will allow you to edit your order up until we close this disc sale. Otherwise, you will not be able to edit your order without contacting us.',
        title: 'Why do we ask for email?',
        trigger: 'manual',
        selector: true,
        container: '#new_order',
        viewport: '#new_order',
        placement: 'auto left'
    });
});

Session.set('discs', []);
for (var i = 1; i <= 3; i++) {
    Session.set('discs', Session.get('discs').concat([0]));
    Template.new_order['disc' + i] = {
        count: new Function("return Session.get('discs')[" + (i - 1) + "];"),
        num: new Function("return " + i)
    };
}

Template.new_order.disc1.color = 'white';
Template.new_order.disc2.color = 'orange';
Template.new_order.disc3.color = 'blue';