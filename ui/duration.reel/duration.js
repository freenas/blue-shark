/**
 * @module ui/duration.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Duration
 * @extends Component
 */
exports.Duration = Component.specialize(/** @lends Duration# */ {
    _unit: {
        value: null
    },

    unit: {
        get: function() {
            return this._unit;
        },
        set: function(unit) {
            if (this._unit !== unit) {
                this._unit = unit;
                this.value = this._getSeconds();
            }
        }
    },

    _count: {
        value: null
    },

    count: {
        get: function() {
            return this._count;
        },
        set: function(count) {
            if (this._count !== count) {
                this._count = count;
                this.value = this._getSeconds();
            }
        }
    },

    _value: {
        value: null
    },

    value: {
        get: function() {
            return this._value;
        },
        set: function(value) {
            if (this._value !== value) {
                this._value = value;
                if (value && this.units && !this._unit && !this._count) {
                    this._splitValue();
                }
            }
        }
    },

    enterDocument: {
        value: function() {
            if (this._value) {
                this._splitValue();
            }
        }
    },

    _getSeconds: {
        value: function() {
            if (!this._unit || !this._count) {
                return this._value;
            }
            return this._unit * this._count;
        }
    },

    _splitValue: {
        value: function() {
            for (var i = 1, length = this.units.length; i < length; i++) {
                var count = this._value / this.units[i].value;
                if (count < 1) {
                    this.unit = this.units[i-1].value;
                    this.count = this._value / this._unit;
                    break;
                }
            }
        }
    }
});
