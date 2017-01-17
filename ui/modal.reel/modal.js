/**
 * @module ui/modal.reel
 */
var AbstractControl = require("montage/ui/base/abstract-control").AbstractControl,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class Modal
 * @extends Component
 */
exports.Modal = AbstractControl.specialize(/** @lends Modal# */ {
    isShown: {
        value: false
    },

    toggle: {
        value: function() {
            this.isShown = !this.isShown;
        }
    },

    enterDocument: {
        value: function() {
            this.element.addEventListener('click', this);
        }
    },

    // FIXME: not working??
    prepareForActivationEvents: {
        value: function() {
            KeyComposer.createKey(this, "enter", "enter").addEventListener("keyPress", this);
            KeyComposer.createKey(this, "escape", "escape").addEventListener("keyPress", this);
        }
    },

    handleEnterKeyPress: {
        value: function() {
            this.handleTrueButtonAction();
        }
    },

    handleFalseKeyPress: {
        value: function() {
            this.handleFalseButtonAction();
        }
    },

    handleClick: {
        value: function (e) {
            if(e.target == this.element) {
                this.toggle();
            }
        }
    },

    handleCloseButtonAction: {
        value: function() {
            this.toggle();
        }
    },

    handleFalseButtonAction: {
        value: function() {
            this.toggle();
            this.detail.set('modalBoolean', 'false');
            this.dispatchActionEvent();
        }
    },

    handleTrueButtonAction: {
        value: function() {
            this.toggle();
            this.detail.set('modalBoolean', 'true');
            this.dispatchActionEvent();
        }
    }
});
