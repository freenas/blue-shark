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
    enabled: {
        value: true
    },


    _checked: {
        value: false
    },

    checked: {
        set: function (checked) {
            this._checked = !!checked;
        },
        get: function () {
            return this._checked;
        }
    },

    _uuid: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._uuid = Uuid.generate();
                this.checkboxComponent.element.setAttribute("id", this._uuid);
                this.labelComponent.element.setAttribute("for", this._uuid);
            }
        }
    }
});
