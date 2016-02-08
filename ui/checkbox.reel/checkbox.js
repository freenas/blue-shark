/**
 * @module ui/checkbox.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Checkbox
 * @extends Component
 */
exports.Checkbox = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.checkboxComponent.element.setAttribute("id", this.uuid);
                this.labelComponent.element.setAttribute("for", this.uuid);
            }
        }
    }
});
