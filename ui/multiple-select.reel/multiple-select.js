/**
 * @module ui/multiple-select.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class MultipleSelect
 * @extends Component
 */
exports.MultipleSelect = Component.specialize(/** @lends MultipleSelect# */ {
    handleClearButtonAction: {
        value: function () {
            this.input.value = null;
        }
    }
});
