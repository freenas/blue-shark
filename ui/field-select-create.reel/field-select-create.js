/**
 * @module ui/field-select-create.reel
 */
var AbstractControl = require("montage/ui/base/abstract-control").AbstractControl;

/**
 * @class FieldSelectCreate
 * @extends Component
 */
exports.FieldSelectCreate = AbstractControl.specialize(/** @lends FieldSelectCreate# */ {
    handleCreateButtonAction: {
        value: function (event) {
            this.dispatchActionEvent();
        }
    },
    handleAction: {
        value: function(event) {
            event.stopPropagation();
        }
    }
});
