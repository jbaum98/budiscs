UI.registerHelper "active_sale", -> Sales.findOne active: true

UI.registerHelper "active_sales", -> Sales.find(active: true).count()

UI.registerHelper "current_order", -> Orders.findOne Session.get("order_id")

UI.registerHelper "site_url", -> Meteor.absoluteUrl()
