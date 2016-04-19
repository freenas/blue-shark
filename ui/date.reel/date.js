/**
 * @module ui/date.reel
 */
var Component = require("montage/ui/component").Component;

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

/**
 * @class Date
 * @extends Component
 */
exports.Date = Component.specialize(/** @lends Date# */ {


    enterDocument: {
        value: function (isFirstTime) {
            this._element.value = this._date ? this._date : new Date().toDateInputValue();
        }
    },

    _date: {
        value: null
    },

    value: {
        set: function (value) {
            this._date = value;
            this._element.value = this._date;
        },
        get: function () {
            return this._date;
        }
    }
});
