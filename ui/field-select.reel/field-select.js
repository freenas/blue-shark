/**
 * @module ui/field-select.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FieldSelect
 * @extends Component
 */
exports.FieldSelect = Component.specialize(/** @lends FieldSelect# */ {
    _options: {
        value: null
    },

    options: {
        get: function() {
            return this._options;
        },
        set: function(options) {
            this._options = options.map(function(x) {
                if (typeof x === "string") {
                    return {
                        label: x,
                        value: x
                    };
                }
                return x;
            })
        }
    }
});
