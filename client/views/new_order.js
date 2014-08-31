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
			discs = $(".disc").map(function () {
				return parseInt(this.getElementsByTagName('text')[0].innerHTML);
			}).toArray(),
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
						onReady: function () {
							Session.set('order_id', result);
						}
					});
					//console.log(result);
				} else {

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
		if (class_name === 'plus') {
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

Meteor.startup(function () {

	$('input').iCheck({
		checkboxClass: 'icheckbox_flat',
		increaseArea: '20%'
	});

	Deps.autorun(function () { //display invalidation messages
		var keys = OrdersSchema.namedContext().invalidKeys();
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i].name;
			message = OrdersSchema.namedContext().keyErrorMessage(key),
			el = $("input#" + key);
			el.before('<div style="display:none"><small>' + message + '</small></div>');
			el.parent().find("div[style='display:none']").show({
				effect: "blind",
				duration: 200
			})
		}
	})
})
