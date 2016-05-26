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
                console.log('revert');
                var result = {
                    name: value.toUpperCase()
                };
                return result;
            },
            validator: {
                validate: function(value) {
                    var isValid = true;
                    if (typeof value === 'string') {
                        isValid = value.indexOf("INVALID") == -1;
                    }
                    return isValid;
                }
            }
        }
    }
});
