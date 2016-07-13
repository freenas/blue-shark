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

    isExpanded: {
        value: false
    },

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

    _findAncestor: {
        value: function (el, cls) {
            while ((el = el.parentElement) && !el.classList.contains(cls));
            return el;
        }
    },

    _setOptionsPosition: {
        value: function () {
            var elementBounds = this.element.getBoundingClientRect();
            if (elementBounds.top + this._optionsHeight > document.documentElement.clientHeight ||
                !this._findAncestor(this.element,'ScrollviewSpacer').contains(document.elementFromPoint(elementBounds.left, elementBounds.top + this._optionsHeight))) {
                this.scrollView.element.style.bottom = '0px';
                this.scrollView.element.style.top = 'auto';
            } else {
                this.scrollView.element.style.bottom = 'auto';
                this.scrollView.element.style.top = '0px';
            }
        }
    },

    _checkClickTarget: {
        value: function (event) {
            if (event.target != this.element && event.target.parentNode != this.element){
                this.isExpanded = false;
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
            window.addEventListener('click', this._checkClickTarget.bind(this), false);
            window.addEventListener("resize", this, false);
        }
    },

    _toggleOptions: {
        value: function () {
            this.isExpanded = !this.isExpanded;
        }
    },

    handleSelectButtonAction: {
        value: function () {
            this._toggleOptions();
        }
    },

    handleResize: {
        value: function () {
            this.needsDraw = true;
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

    exitDocument: {
        value: function () {
            this._mutationObserver.disconnect();
            window.removeEventListener('click', this._checkClickTarget.bind(this), false);
            window.removeEventListener("resize", this, false);
        }
    },

    draw: {
        value: function () {
            if (this.optionsElement.element.offsetHeight) {
                this._optionsHeight = this.optionsElement.element.offsetHeight;
                this._setOptionsPosition();
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
            this.isExpanded = false;
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
