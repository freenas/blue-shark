/**
 * @module ui/text-field.reel
 */
var AbstractTextField = require("montage/ui/base/abstract-text-field").AbstractTextField;

/**
 * @class TextField
 * @extends Component
 */
exports.TextField = AbstractTextField.specialize({

    hasTemplate: {
        value: true
    }

});
