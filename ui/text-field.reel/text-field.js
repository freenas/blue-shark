/**
 * @module ui/control-error.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class ControlError
 * @extends Component
 */

exports.TextField = Component.specialize({

    hasTemplate: {
        value: true
    },

    //FIXME: in montage
    value: {
        get: function () {
            return this._value;
        },
        set: function (value, fromInput) {
            if (value !== this._value) {
                var shouldAcceptValue
                if (!this.delegate ||  (shouldAcceptValue = this.callDelegateMethod("shouldAcceptValue", this, value) ) === undefined ? true : shouldAcceptValue ){
                    if (this.converter) {
                        var convertedValue;
                        try {
                            //Where is the matching convert?
                            convertedValue = this.converter.revert(value);
                            this.error = null;
                            this._value = convertedValue;
                        } catch (e) {
                            // unable to convert - maybe error
                            this._value = value;
                            //FIXME: we don't handle required field.
                            this.error = value !== "" && value !== void 0 && value !== null ? e : null;
                        }
                    } else {
                        this._value = value;
                        this.error = null;
                    }

                    this.callDelegateMethod("didChange", this);
                    this._elementAttributeValues["value"] = value;
                    this.needsDraw = true;
                }
            }
        }
    },

    //FIXME: in montage
    handleChange: {
        enumerable: false,
        value: function(event) {
            this.takeValueFromElement();
            // this.dispatchActionEvent();
            this._hasFocus = false;
        }
    },

    //FIXME: in montage
    handleBlur: {
        enumerable: false,
        value: function (event) {
            this.hasFocus = false;
            this.callDelegateMethod("didEndEditing", this);
            //This create an issue in textfield, to investigate
            // this.dispatchActionEvent();
        }
    }

});
