/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    converter: {
        value: {
            convert: function(value) {
                return value;
            },
            revert: function(value) {
                throw new Error('this is the error')
            }
        }
    }
});
