String.prototype.trimplus = function () {
	'use strict';
	return this.replace(/^(\s|_|[^\w])+|(\s|_|[^\w])+$/g, '');
};

String.prototype.capitalize = function () {
	'use strict';
	return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.total = function () {
	'user strict';
	return this.length > 0 ? this.reduce(function (a, b) {
		return a + b;
	}) : 0;
};
