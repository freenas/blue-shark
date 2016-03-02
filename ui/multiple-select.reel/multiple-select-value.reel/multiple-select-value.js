/**
 * @module ui/multiple-select-value.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class MultipleSelectValue
 * @extends Component
 */
exports.MultipleSelectValue = Component.specialize(/** @lends MultipleSelectValue# */ {
    handleDeleteButtonAction: {
        value: function () {
            console.log('delete fired');
        }
    }
});
