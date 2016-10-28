/**
 * @module ui/text-input-edit.reel
 */
var Component = require("montage/ui/component").Component,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class TextInputEdit
 * @extends Component
 */
var TextInputEdit = exports.TextInputEdit = Component.specialize(/** @lends TextInputEdit# */ {

    prepareForActivationEvents: {
        value: function () {
            var keyboardIdentifiers = this.constructor.KEY_IDENTIFIERS,
                keyboardIdentifiersKeys = Object.keys(keyboardIdentifiers),
                keyboardIdentifier;

            this._keyComposerMap = new Map();

            for (var i = 0, length = keyboardIdentifiersKeys.length; i < length; i++) {
                keyboardIdentifier = keyboardIdentifiers[keyboardIdentifiersKeys[i]];

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
            this.input.element.selectionEnd = this.input.element.selectionStart;
        }
    },

    handleEditButtonAction: {
        value: function () {
            this.isEditEnabled = true;
            this._originalValue = this.input.value;
            this.input.focus();
            this.input.select();
        }
    },

    handleSubmitButtonAction: {
        value: function () {
            if (this.input.value != this._originalValue) {
                // do some action
            }
            this.isEditEnabled = false;
            this._deselectText();
        }
    },

    handleCancelButtonAction: {
        value: function () {
            this.input.value = this._originalValue;
            this.isEditEnabled = false;
            this._deselectText();
        }
    }
},
{

    KEY_IDENTIFIERS: {
        value: {
            enter: "enter",
            escape: "escape"
        }
    }
});

TextInputEdit.prototype.handleEnterKeyPress = TextInputEdit.prototype.handleSubmitButtonAction;
TextInputEdit.prototype.handleEscapeKeyPress = TextInputEdit.prototype.handleCancelButtonAction;

