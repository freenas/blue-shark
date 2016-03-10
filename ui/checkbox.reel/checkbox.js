/**
 * @module ui/checkbox.reel
 */
var Component = require("montage/ui/component").Component,
    Uuid = require("montage/core/uuid");

/**
 * @class Checkbox
 * @extends Component
 */
exports.Checkbox = Component.specialize({
    _uuid: {
        value: null
    },

    constructor: {
        value: function() {
            this._uuid = Uuid.generate();
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.checkboxComponent.element.setAttribute("id", this._uuid);
                this.labelComponent.element.setAttribute("for", this._uuid);
            }
        }
    }
});
