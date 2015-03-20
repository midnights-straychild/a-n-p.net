String.prototype.capitalize = function () {
    'use strict';
    return this.charAt(0).toUpperCase() + this.slice(1);
};