Template.welcome.events({
    'click button#place_order': function (event) {
        'use strict';
        event.preventDefault();
        $('html,body').animate({
            scrollTop: $(window).height()
        }, 800);
    }
});