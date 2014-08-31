Orders = new Meteor.Collection("orders");

OrdersSchema = new SimpleSchema({
	name: {
		type: String,
		label: "Name",
		autoValue: function () {
			'use strict';
			if (this.isSet) {
				return this.value.trimplus().capitalize();
			}
		},
		custom: function () {
			'use strict';
			Meteor.call('checkDuplicateOrder', this.value, this.field('bunk'), this.field('sale_id'), function (error, result) {
				if (!result) {
					Orders.SimpleSchema().addInvalidKeys([{
						name: 'duplicate'
					}, {
						bunk: 'duplicate'
					}])
				}
			});
		}
	},
	picking_up: {
		type: Boolean,
		label: "Picking Up"
	},
	recipient: {
		type: String,
		label: "Recipient",
		optional: true,
		custom: function () {
			'use strict';
			if (!this.field(picking_up) && !this.isSet && (!this.operator || (this.value === null || this.value === ""))) {
				return 'required';
			}
		},
		autoValue: function () {
			'use strict';
			if (this.isSet) {
				return this.value.trimplus().capitalize();
			}
		}
	},
	bunk: {
		type: String,
		label: "Bunk",
		autoValue: function () {
			'use strict';
			if (this.isSet) {
				var bunk_reg = /^([a|b])-?(\d+)/i,
					match_data = this.value.match(bunk_reg);
				if (match_data) {
					return match_data[1].toUpperCase() + '-' + match_data[2];
				} else {
					return this.value.trimplus().toLowerCase();
				}
			}
		},
		custom: function () {
			'use strict';
			Meteor.call('checkDuplicateOrder', this.field('name'), this.value, this.field('sale_id'), function (error, result) {
				if (!result) {
					Orders.SimpleSchema().addInvalidKeys([{
						name: 'duplicate'
					}, {
						bunk: 'duplicate'
					}])
				}
			});
		}
	},
	discs: {
		type: [Number],
		label: "Disc Quantities",
		min: 0,
		custom: function () {
			'use strict';
			if (this.value.total() < 1) {
				return "minTotal";
			} else if (this.value.length !== Sales.findOne(this.field('sale_id'), {
				fields: {
					colors: 1
				}
			}).colors.length) {
				return 'notCorrectLength';
			}
		}
	},
	sale_id: {
		type: Meteor.Collection.ObjectID,
		label: "Sale ID"
	},
	dateCreated: {
		type: Date,
		label: "Date Created",
		autoValue: function () {
			'use strict';
			if (this.isInsert) {
				return new Date;
			} else if (this.isUpsert) {
				return {
					$setOnInsert: new Date
				};
			} else {
				this.unset();
			}
		}
	},
	dateModified: {
		type: Date,
		label: "Date Modified",
		autoValue: function () {
			'use strict';
			if (this.isUpdate) {
				return new Date();
			}
		},
		denyInsert: true,
		optional: true
	}
});

Orders.attachSchema(OrdersSchema);

OrdersSchema.messages({
	notCorrectLength: "[label] must include the correct number of disc quantities to correspond the colors in the Sale.",
	duplicate: "There is already another order for this sale with the same name and bunk.",
	minTotal: "You must order at least one disc."
});

Orders.allow({
	insert: function () {
		'use strict';
		return true;
	},
	update: function (userId, doc, fieldNames, modifier) {
		'use strict';
		return true;
	}
});
