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

    _isFirstTime: {
        value: true
    },

    _maxHeight: {
        value: 144
    },

    _optionsHeight: {
        value: null
    },

    _setOptionsHeight: {
        value: function () {
            if (this._optionsHeight < this._maxHeight) {
                this.scrollView.element.style.height = this._optionsHeight + "px";
            } else {
                this.scrollView.element.style.height = this._maxHeight + "px";
            }
        }
    },

    draw: {
        value: function () {
            if (this._isFirstTime) {
                this._optionsHeight = this.optionsElement.element.offsetHeight;
                this._setOptionsHeight();
                this._isFirstTime = false;
            }
        }
    },

    converter: {
        value: null
    },

    _options: {
        value: null
    },

    options: {
        set: function (content) {
            var options = null;

            if (content) {
                if (this.converter) {
                    options = this.converter.convert(content);
                } else {
                    options = content;
                }

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

    _updateOptionsIfNeeeded: {
        value: function () {
            if (this._options) {
                this.options = this._originalContent; // trigger setter.
            }
        }
    }

});


var NONE_OPTION_LABEL = "none",
    NONE_OPTION_VALUE = "_none",
    NONE_SELECT_OPTION = {label: NONE_OPTION_LABEL, value: NONE_OPTION_VALUE};
