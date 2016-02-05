var AbstractButton = require("montage/ui/base/abstract-button.js").AbstractButton;

/**
 * @class Button
 * @extends Component
 */
exports.Button = AbstractButton.specialize({
    hasTemplate: {
        value: true
    }
});
