/**
 * @module ui/text-field.reel
 */
var MontageTextField = require("montage/ui/text-field.reel/text-field.js").TextField;

/**
 * @class TextField
 * @extends Component
 */
exports.TextField = MontageTextField.specialize({

    hasTemplate: {
        value: true
    }

});
