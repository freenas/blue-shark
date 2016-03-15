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
            revert: function(value) {
                value.name = value.name.toUpperCase();
                return value;
            },
            validator: {
                validate: function(value) {
                    return value.name.indexOf("INVALID") == -1;
                }
            }
        }
    }
});
