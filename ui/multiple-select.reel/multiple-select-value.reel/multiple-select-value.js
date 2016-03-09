/**
 * @module ui/multiple-select-value.reel
 */
var Component = require("montage/ui/component").Component,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class MultipleSelectValue
 * @extends Component
 */
exports.MultipleSelectValue = Component.specialize(/** @lends MultipleSelectValue# */ {
    converter: {
        value: null
    },

    _inputError: {
        value: null
    },

    prepareForActivationEvents: {
        value: function() {
            this.valueField.delegate = {
                shouldAcceptValue: function() {
                    return true;
                }
            };
            KeyComposer.createKey(this.valueField, "escape", "undo").addEventListener("keyPress", this);
            KeyComposer.createKey(this.valueField, "enter", "save").addEventListener("keyPress", this);
        }
    },

    handleDeleteButtonAction: {
        value: function () {
            this.contentController.delete(this.object);
        }
    },

    handleSaveKeyPress: {
        value: function() {
            var value = {
                    label: this.valueField.value
                },
                isValid = true;
            if (this.converter) {
                if (this.converter.validator && typeof this.converter.validator.validate === 'function') {
                    isValid = this.converter.validator.validate(value);
                }
                if (isValid) {
                    this._inputError = false;
                    if (typeof this.converter.revert === 'function') {
                        value = this.converter.revert(value);
                    }
                } else {
                    this._inputError = true;
                }
            }
            if (isValid) {
                this.valueField.element.blur();
                this.object = value;
            }
        }
    },

    handleUndoKeyPress: {
        value: function() {
            this.valueField.element.blur();
            this.valueField.value = this.object.label;
        }
    }
});
