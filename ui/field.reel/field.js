/**
 * @module ui/field.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Field
 * @extends Component
 */
exports.Field = Component.specialize(/** @lends Field# */ {

    handleFieldInfoButtonAction: {
        value: function () {
            console.log(this.title + " reference to " + this.documentationReference);
        }
    }
});
