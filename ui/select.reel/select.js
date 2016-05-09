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

    _optionsMaxHeight: {
        value: 144
    },

    optionsMaxHeight: {
        get: function () {
            return this._optionsMaxHeight;
        },
        set: function (value) {
            if(value) {
                this._optionsMaxHeight = value;
            }
        }
    },

    _optionsHeight: {
        value: null
    },

    _setOptionsHeight: {
        value: function () {
            if (this._optionsHeight < this._optionsMaxHeight) {
                this.scrollView.element.style.height = this._optionsHeight + "px";
            } else {
                this.scrollView.element.style.height = this._optionsMaxHeight + "px";
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._mutationObserver = new MutationObserver(this.handleMutations.bind(this));
                this.addRangeAtPathChangeListener("_originalContent", this, "handleOriginalContentChange");
            }

            this._mutationObserver.observe(this.element, {
                subtree: true,
                childList: true
            });
        }
    },

    handleMutations: {
        value: function (event) {
            this.needsDraw =  true;
        }
    },

    handleOriginalContentChange: {
        value: function() {
            var options = null;

            if (this._originalContent) {
                if (this.converter) {
                    options = this.converter.convert(this._originalContent);
                } else {
                    options = this._originalContent;
                }

                var indexNoneOption = options.indexOf(NONE_SELECT_OPTION);

                if (this._hasOptionalValue && indexNoneOption === -1) { // missing
                    options.unshift(NONE_SELECT_OPTION)

                } else if (!this._hasOptionalValue && indexNoneOption > -1) { //
                    options.splice(indexNoneOption, 1)
                }
            }

            this._options = options;
        }
    },

    exitDocument: {
        value: function () {
            this._mutationObserver.disconnect();
        }
    },

    draw: {
        value: function () {
            if (this.optionsElement.element.offsetHeight) {
                this._optionsHeight = this.optionsElement.element.offsetHeight;
            }
            this._setOptionsHeight();
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
