String::trimplus = ->
    @replace /^(\s|_|[^\w])+|(\s|_|[^\w])+$/g, ""

String::capitalize = ->
    @charAt(0).toUpperCase() + @slice(1)

Array::total = ->
    (if @length > 0 then @reduce((a, b) ->
        a + b
    ) else 0)
