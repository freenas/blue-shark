var Button = require("montage/ui/base/abstractButton.js").Button;

/**
 * @class Button
 * @extends Component
 */
exports.Button = Button.specialize({
    hasTemplate: {
        value: true
    }
});
