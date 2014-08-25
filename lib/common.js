String.prototype.trimplus = function () {
    return this.replace(/^(\s|_|[^\w])+|(\s|_|[^\w])+$/g, '');
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}