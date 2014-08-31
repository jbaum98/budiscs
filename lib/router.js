Router.map(function () {
	this.route('index', {
		path: '/',
		template: 'index',
		layoutTemplate: 'layout',
		fastRender: true,
		waitOn: function () {
			return Meteor.subscribe('activeSale');
		},
		onAfterAction: function () {
			Deps.autorun(function () { // keeps discs_cache same length as colors by appending zeroes
				var disc_count = Sales.findOne({
						active: true
					}).colors.length,
					cache;
				Session.setDefault('discs_cache', []);
				for (var i = 0; i < disc_count; i++) {
					var current_cache = Session.get('discs_cache')
					if (current_cache.length <= i) {
						Session.set('discs_cache', current_cache.concat([0]));
					}
				}
				cache = Session.get('discs_cache');
				if (cache.length > disc_count) {
					Session.set('discs_cache', cache.slice(0, disc_count));

				}
			});

			Deps.autorun(function () { //update discs_cache when order_id is updated
				var id = Session.get('order_id')
				if (id) {
					Session.set('discs_cache', Orders.findOne(id).discs)
				}
			});
			Meteor.startup(function () {
				Template.new_order.discs = function () {
					'use strict';
					var discs = [],
						colors = Sales.findOne({
							active: true
						}).colors,
						nums = Session.get('discs_cache');
					for (var i = 0; i < colors.length; i++) {
						discs.push({
							color: colors[i],
							num: nums[i],
							index: i
						});
					}
					return discs;
				};
			});
		}
	});
	this.route('about', {
		//layoutTemplate:'layout'
	});
});
