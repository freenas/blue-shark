/**
 * @module ui/field-text-input.reel
 */
var Field = require("../field.reel/field").Field;

/**
 * @class FieldTextInput
 * @extends Component
 */
exports.FieldTextInput = Field.specialize({
    hasTemplate: {
        value: true
    }
});
