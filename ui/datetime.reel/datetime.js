/**
 * @module ui/date.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Datetime
 * @extends Component
 */
exports.Datetime = Component.specialize(/** @lends Datetime# */ {
    _value: {
        value: null
    },

    value: {
        get: function() {
            if (this._date && this._time) {
                return new Date(this._date + 'T' + this._time);
            }
        },
        set: function(value) {
            if (this._value != value) {
                this._value = value;
                if (typeof value === 'object' && typeof value.toISOString === 'function') {
                    var parts = value.toISOString().split('T');
                    this._date = parts[0];
                    this._time = parts[1].substr(0,5);
                }
            }
        }
    }
});
