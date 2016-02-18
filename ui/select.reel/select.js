/**
 * @module ui/select.reel
 */
var Component = require("montage/ui/component").Component,
    Montage = require("montage/core/core").Montage;

/**
 * @class Select
 * @extends Component
 */
exports.Select = Component.specialize({

    _options: {
        value: null
    },

    options: {
        set: function (content) {
            var options = null;

            if (content) {
                options = this._getSelectOptionsFromArray(content);

                var indexNoneOption = options.indexOf(NONE_SELECT_OPTION);

                if (this._hasOptionalValue && indexNoneOption === -1) { // missing
                    options.unshift(NONE_SELECT_OPTION)

                } else if (!this._hasOptionalValue && indexNoneOption > -1) { //
                    options.splice(indexNoneOption, 1)
                }
            }

            this._options = options;
            this._originalContent = content;
        },
        get: function () {
            return this._options;
        }
    },

    _originalContent: {
        value: null
    },

    __selectedValue: {
        value: null
    },

    _selectedValue: {
        set: function (_selectedValue) {
            this.__selectedValue = _selectedValue;
            this.dispatchOwnPropertyChange("selectedValue", this.selectedValue, false);
        },
        get: function () {
            return this.__selectedValue;
        }
    },

    selectedValue: {
        set: function (selectedValue) {
            this.__selectedValue = this._hasOptionalValue && selectedValue === null ? NONE_OPTION_VALUE : selectedValue;
            this.dispatchOwnPropertyChange("_selectedValue", selectedValue, false);
        },
        get: function () {
            return this._hasOptionalValue && this.__selectedValue === NONE_OPTION_VALUE ? null : this._selectedValue;
        }
    },

    _hasOptionalValue: {
        value: false
    },

    hasOptionalValue: {
        set: function (hasOptionalValue) {
            hasOptionalValue = !!hasOptionalValue;

            if (hasOptionalValue !== this._hasOptionalValue) {
                this._hasOptionalValue = hasOptionalValue;

                this._updateOptionsIfNeeeded();
            }
        },
        get: function () {
            return this._hasOptionalValue;
        }
    },

     _labelPropertyName: {
        value: "label"
    },

    labelPropertyName: {
        get: function () {
            return this._labelPropertyName;
        },
        set: function (value) {
            if (this._labelPropertyName !== value) {
                if (value) {
                    this._labelPropertyName = value + "";
                } else {
                    this._labelPropertyName = "label";
                }

                this._updateOptionsIfNeeeded();
            }
        }
    },

    _valuePropertyName: {
        value: "value"
    },

    valuePropertyName: {
        get: function () {
            return this._valuePropertyName;
        },
        set: function (value) {
            if (this._valuePropertyName !== value) {
                if (value) {
                    this._valuePropertyName = value + "";
                } else {
                    this._valuePropertyName = "value";
                }

                this._updateOptionsIfNeeeded();
            }
        }
    },

    _getSelectOptionsFromArray: {
        value: function (content) {
            if (!Array.isArray(content)) {
                throw new TypeError("Select.getOptionsFromArray: array expected got '" + typeof content + "' instead");
            }

            var options = [],
                valuePropertyName = this._valuePropertyName,
                labelPropertyName = this._labelPropertyName,
                option,
                item;

            //TODO: implement pool of SelectOption
            for (var i = 0, length = content.length; i < length; i++) {
                item = content[i];

                if (typeof item !== "object") {
                    option = new SelectOption().initWithLabel(item);

                } else {
                    option = new SelectOption().initWithLabel(item[labelPropertyName], item[valuePropertyName]);
                }

                options.push(option);
            }

            return options;
        }
    },

    _updateOptionsIfNeeeded: {
        value: function () {
            if (this._options) {
                this.options = this._originalContent; // trigger setter.
            }
        }
    }

});

var SelectOption = exports.SelectOption = Montage.specialize({

    initWithLabel: {
        value: function (label) {
            this.label = this.value = label + "";

            return this;
        }
    },

    initWithLabelAndValue: {
        value: function (label, value) {
            this.label = label + "";
            this.value = value + "";

            return this;
        }
    },

    label: {
        value: null
    },

    value: {
        value: null
    }

});

var NONE_OPTION_LABEL = "none",
    NONE_OPTION_VALUE = "_none",
    NONE_SELECT_OPTION = new SelectOption().initWithLabelAndValue(NONE_OPTION_LABEL, NONE_OPTION_VALUE);
