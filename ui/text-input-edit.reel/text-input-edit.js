/**
 * @module ui/text-input-edit.reel
 */
var AbstractControl = require("montage/ui/base/abstract-control").AbstractControl,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class TextInputEdit
 * @extends Component
 */
var TextInputEdit = exports.TextInputEdit = AbstractControl.specialize(/** @lends TextInputEdit# */ {

    prepareForActivationEvents: {
        value: function () {
            var keyboardIdentifiers = this.constructor.KEY_IDENTIFIERS,
                keyboardIdentifier;

            this._keyComposerMap = new Map();

            for (var i = 0, length = keyboardIdentifiers.length; i < length; i++) {
                keyboardIdentifier = keyboardIdentifiers[i];

                this._keyComposerMap.set(
                    keyboardIdentifier,
                    KeyComposer.createKey(this, keyboardIdentifier, keyboardIdentifier)
                );

                this._keyComposerMap.get(keyboardIdentifier).addEventListener("keyPress", this);
            }
        }
    },

    _originalValue: {
        value: null
    },

    isEditEnabled: {
        value: false
    },

    _deselectText: {
        value: function () {
            this.inputComponent.input.element.selectionEnd = this.inputComponent.input.element.selectionStart;
        }
    },

    handleEditButtonAction: {
        value: function () {
            this.isEditEnabled = true;
            this._originalValue = this.inputComponent.value;
            this.inputComponent.input.focus();
            this.inputComponent.input.select();
        }
    },

    handleSubmitButtonAction: {
        value: function () {
            this.isEditEnabled = false;
            this._deselectText();
            if(this._originalValue != this.inputComponent.value) {
                this.detail.set('eventName', 'textValueChanged');
                this.dispatchActionEvent();
            }
        }
    },

    handleCancelButtonAction: {
        value: function () {
            this.inputComponent.value = this._originalValue;
            this.isEditEnabled = false;
            this._deselectText();
            this.inputComponent.input.blur();

        }
    }
},
{

    KEY_IDENTIFIERS: {
        value: [
            "enter",
            "escape"
        ]
    }
});

TextInputEdit.prototype.handleEnterKeyPress = TextInputEdit.prototype.handleSubmitButtonAction;
TextInputEdit.prototype.handleEscapeKeyPress = TextInputEdit.prototype.handleCancelButtonAction;

