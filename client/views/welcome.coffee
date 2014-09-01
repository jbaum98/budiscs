Template.welcome.events "click button#place_order": (event) ->
  event.preventDefault()
  $("html,body").animate
    scrollTop: $(window).height()
    800
