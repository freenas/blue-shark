var Component = require("montage/ui/component").Component,
    Translator = require("core/translator").Translator;

exports.FieldTextInput = Component.specialize({
    hasTemplate: {
        value: true
    },

    disabled: {
        value: false
    },

    hasError: {
        value: false
    },

    _placeholder: {
        value: void 0
    },

    placeholder: {
        get: function() {
            return this._placeholder;
        },
        set: function(placeholder) {
            if (this._placeholder !== placeholder) {
                var self = this;
                this._placeholder = placeholder;
                Translator.translate(placeholder).then(function(translated) {
                    this.translatedPlaceholder = translated;
                });
            }
        }
    },

    prepareForActivationEvents: {
        value: function () {
            if (this.validator) {
                this.control.element.addEventListener('blur', this, true);
            }
        }
    },

    captureBlur: {
        value: function(event) {
            this.hasError = !this.validator.validate(this.value);
        }
    }
});
