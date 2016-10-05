/**
 * @module ui/text-field.reel
 */
var TextField = require("montage/ui/text-field.reel").TextField;

/**
 * @class TextField
 * @extends Component
 */
exports.TextField = TextField.specialize({

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
    }

});
