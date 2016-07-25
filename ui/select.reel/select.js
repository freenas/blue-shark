/**
 * @module ui/select.reel
 */
var Component = require("montage/ui/component").Component;


/**
 * @class Select
 * @extends Component
 */
exports.Select = Component.specialize({

    converter: {
        value: null
    },

    optionsOverlayComponent: {
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

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addRangeAtPathChangeListener("_originalContent", this, "_handleOriginalContentChange");
            }
        }
    },

    exitDocument: {
        value: function() {
            if (this.optionsOverlayComponent.isShown) {
                this.optionsOverlayComponent.hide();
            }
        }
    },

    handleSelectButtonAction: {
        value: function () {
            this.optionsOverlayComponent.isShown ? this.optionsOverlayComponent.hide() :
                this._showOptions();
        }
    },

    _handleOriginalContentChange: {
        value: function() {
            var options = null;

            if (this._originalContent) {
                if (this.converter) {
                    options = this.converter.convert(this._originalContent);
                } else {
                    var isConverterMissing = false;
                    options = this._originalContent.map(function(x) {
                        if (typeof x === 'string') {
                            isConverterMissing = true;
                            return {
                                label: x,
                                value: x
                            };
                        }
                        return x;
                    });
                    if (isConverterMissing) {
                        console.warn('Usage of strings array in select component is deprecated, please use a converter instead.');
                    }
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

    _updateOptionsIfNeeeded: {
        value: function () {
            if (this._options) {
                this.options = this._originalContent; // trigger setter.
            }
        }
    },

    _showOptions: {
        value: function() {
            if (defaultEventManager.activeTarget.templateModuleId == this.optionsOverlayComponent.templateModuleId) {
                defaultEventManager.activeTarget.hide();
            }
            this.optionsOverlayComponent.show()
        }
    }

});


var NONE_OPTION_LABEL = "none",
    NONE_OPTION_VALUE = "_none",
    NONE_SELECT_OPTION = {label: NONE_OPTION_LABEL, value: NONE_OPTION_VALUE};
