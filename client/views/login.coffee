Template.login.events
    "click #login-submit": ->
        $("form#login").submit()
        return

    "submit form#login": login = (event) ->
        event.preventDefault()
        form = $(event.currentTarget)
        username = form.find("input#username")[0].value
        password = form.find("input#password")[0].value
    
    #console.log(username);
        Meteor.loginWithPassword username, password, (Error) ->
            if Error
                console.log "login error"
            else
                console.log "login success"
            return
        return
