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

    invalidValue: {
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
            this.element.addEventListener("dragstart", this);
            this.element.addEventListener("dragend", this);
            this.element.addEventListener("dragenter", this);
            this.element.addEventListener("dragover", this);
            this.element.addEventListener("dragleave", this);
            this.element.addEventListener("drop", this);
        }
    },

    handleDeleteButtonAction: {
        value: function () {
            this.contentController.delete(this.object);
        }
    },

    handleSaveKeyPress: {
        value: function() {
            var value = this.valueField.value,
                isValid = true;
            if (this.converter) {
                if (this.converter.validator && typeof this.converter.validator.validate === 'function') {
                    isValid = this.converter.validator.validate(value);
                }
                if (isValid) {
                    this.invalidValue = null;
                    if (typeof this.converter.revert === 'function') {
                        value = this.converter.revert(value);
                    }
                } else {
                    this.invalidValue = value;
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
    },

    handleDragstart: {
        value: function(event) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', this.index);
            this.element.classList.add('dragged');
        }
    },

    handleDragend: {
        value: function(event) {
            this.element.classList.remove('dragged');
            this.element.classList.remove('dragOver');
        }
    },

    handleDragenter: {
        value: function(event) {
            this.element.classList.add('dragOver');
        }
    },

    handleDragover: {
        value: function(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
        }
    },

    handleDragleave: {
        value: function(event) {
            this.element.classList.remove('dragOver');
        }
    },

    handleDrop: {
        value: function(event) {
            this.element.classList.remove('dragged');
            this.element.classList.remove('dragOver');
            var draggedIndex = parseInt(event.dataTransfer.getData('text/plain'));
            var draggedObject = this.contentController.content[draggedIndex];
            this.contentController.swap(draggedIndex, 1);
            this.contentController.swap(this.index, 0, [draggedObject]);
        }
    }
});
