UI.registerHelper('active_sale', function () {
    return Sales.find({
        active: true
    }).collection.findOne()
})