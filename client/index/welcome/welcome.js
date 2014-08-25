Template.welcome.helpers({
    active_sales: function () {
        return Sales.find({
            active: true
        }).count()
    }
});

Template.welcome.events({
    'click button#place_order': function (event) {
        event.preventDefault();
        $('html,body').animate({
            scrollTop: $(window).height()
        }, 800)
    }
})