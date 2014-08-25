Template.login.events({
    'click #login-submit': function (event) {
        $("form#login").submit()
    },
    'submit form#login': function login(event) {
        event.preventDefault();
        var form = $(event.currentTarget),
            username = form.find("input#username")[0].value,
            password = form.find("input#password")[0].value;
        console.log(username)
        Meteor.loginWithPassword(username, password, function (Error) {
            if (Error) {
                //console.log("login error")
            } else {
                // console.log("login success")
            }
        })
    }
})