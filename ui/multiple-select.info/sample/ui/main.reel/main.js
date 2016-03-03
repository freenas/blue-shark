/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    constructor: {
        value: function Main() {
            this.super();
        }
    },

    fakeConverter: {
        value: {
            convert: function(value) {
                value.label = value.label.toUpperCase();
                return value;
            },
            validator: {
                validate: function(value) {
                    return value.label.indexOf("INVALID") == -1;
                }
            }
        }
    }
});
