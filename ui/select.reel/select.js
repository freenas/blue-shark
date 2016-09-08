/**
 * @module ui/select.reel
 */
var Component = require("montage/ui/component").Component,
    KeyComposer = require("montage/composer/key-composer").KeyComposer,
    SelectOptions = require("ui/select.reel/select-options.reel").SelectOptions;


/**
 * @class Select
 * @extends Component
 */
var Select = exports.Select = Component.specialize({

    converter: {
        value: null
    },

    optionsOverlayComponent: {
        value: null
    },

    _options: {
        value: null
    },

    __highlightedOption: {
        value: null
    },

    _highlightedOption: {
        get: function () {
            return this.__highlightedOption;
        },
        set: function (option) {
            var self = this;
            this.optionsOverlayComponent.templateObjects.options.iterations.forEach(function(iteration){
                iteration._childComponents[0].classList.remove("highlighted");
                if(iteration == option) {
                    iteration._childComponents[0].classList.add("highlighted");
                    self.__highlightedOption = option;
                }
            });
        }
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
                this._updateOptionsIfNeeded();
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

    prepareForActivationEvents: {
        value: function () {
            var keyIdentifiers = this.constructor.KEY_IDENTIFIERS;

            this._keyComposerMap = new Map();

            this._keyComposerMap.set(
                keyIdentifiers.space,
                KeyComposer.createKey(this, keyIdentifiers.space, keyIdentifiers.space)
            );
            this._keyComposerMap.set(
                keyIdentifiers.enter,
                KeyComposer.createKey(this, keyIdentifiers.enter, keyIdentifiers.enter)
            );
            this._keyComposerMap.set(
                keyIdentifiers.up,
                KeyComposer.createKey(this, keyIdentifiers.up, keyIdentifiers.up)
            );
            this._keyComposerMap.set(
                keyIdentifiers.down,
                KeyComposer.createKey(this, keyIdentifiers.down, keyIdentifiers.down)
            );

            this._keyComposerMap.get(keyIdentifiers.space).addEventListener("keyPress", this);
            this._keyComposerMap.get(keyIdentifiers.enter).addEventListener("keyPress", this);
            this._keyComposerMap.get(keyIdentifiers.up).addEventListener("keyPress", this);
            this._keyComposerMap.get(keyIdentifiers.down).addEventListener("keyPress", this);

            // FIXME: not possible to manage the tab key with a key composer,
            // prevent default is automatically called.
            this.element.addEventListener("keydown", this);
        }
    },

    handleKeydown: {
        value: function (event) {
            // 9 -> tab keyCode,
            // FIXME: keyCode is deprecated
            if ((event.key === "Tab" || event.keyCode === 9) && this.optionsOverlayComponent.isShown) {
                event.preventDefault();
            }
        }
    },

    _toggleOptionsOverlay: {
        value: function () {
            this.element.focus();
            this.optionsOverlayComponent.isShown ? this._hideOptionsOverlay() : this._showOptionsOverlay();
        }
    },

    _showOptionsOverlay: {
        value: function () {
            if (!this.disabled) {
                this.optionsOverlayComponent.element.focus();
                if (!this.optionsOverlayComponent.isShown) {
                    this.optionsOverlayComponent.show();
                    this._highlightedOption = this.optionsOverlayComponent.templateObjects.options.selectedIterations[0];
                }
                this.optionsOverlayComponent.element.addEventListener("mouseover", this);
                this.optionsOverlayComponent.element.addEventListener("mousedown", this);
            }
        }
    },

    handleMousedown: {
        value: function(e) {
            if (e.target.component.iteration == this.optionsOverlayComponent.templateObjects.options.selectedIterations[0]) {
                this._toggleOptionsOverlay();
            }
        }
    },

    _hideOptionsOverlay: {
        value: function () {
            if (this.optionsOverlayComponent.isShown) {
                this.optionsOverlayComponent.hide();
            }
            this.optionsOverlayComponent.element.removeEventListener("mouseover", this);
            this.optionsOverlayComponent.element.removeEventListener("mousedown", this);
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

    _updateOptionsIfNeeded: {
        value: function () {
            if (this._options) {
                this.options = this._originalContent; // trigger setter.
            }
        }
    },

    _nextOption: {
        value: function (event) {
            if (this._options && this._options.length > 0) {
                this._navigateInOptions(1);
            }
        }
    },

    _previousOption: {
        value: function () {
            if (this._options && this._options.length > 0) {
                this._navigateInOptions(-1);
            }
        }
    },

    _selectOption: {
        value: function (e) {
            if(this.optionsOverlayComponent.isShown) {
                this.optionsOverlayComponent.templateObjects.options.selection = [this._highlightedOption.object];
            }
        }
    },

    _navigateInOptions: {
        value: function(distance) {
            var currentIndex = this.optionsOverlayComponent.templateObjects.options.iterations.indexOf(this._highlightedOption),
                newIndex = currentIndex + distance,
                contentLength = this.optionsOverlayComponent.templateObjects.options.iterations.length;

            if (newIndex < -1) {
                newIndex = contentLength -1;
            }
            if (newIndex != -1 && newIndex != contentLength) {
                this._highlightedOption = this.optionsOverlayComponent.templateObjects.options.iterations[newIndex % contentLength];
            }
        }
    },

    _handledUpKeyPress: {
        value: function () {
            if (!this.optionsOverlayComponent.isShown) {
                this._toggleOptionsOverlay();
            } else {
                this._previousOption();
            }
        }
    },

    _handleDownKeyPress: {
        value: function () {
            if (!this.optionsOverlayComponent.isShown) {
                this._toggleOptionsOverlay();
            } else {
                this._nextOption();
            }
        }
    },

    _handleSpaceKeyPress: {
        value: function () {
            if (!this.optionsOverlayComponent.isShown || this._highlightedOption == this.optionsOverlayComponent.templateObjects.options.selectedIterations[0]) {
                this._toggleOptionsOverlay();
            } else {
                this._selectOption();
            }
        }
    },

    handleMouseover: {
        value: function(event) {
            if (event.target.component) {
                var target = event.target.component.iteration;

                if (target !== this._highlightedOption) {
                    this._highlightedOption = target;
                }
            }
        }
    },

    _handleEnterKeyPress: {
        value: function () {
            if (this.optionsOverlayComponent.isShown && this._highlightedOption == this.optionsOverlayComponent.templateObjects.options.selectedIterations[0]) {
                this._toggleOptionsOverlay();
            } else {
                this._selectOption();
            }
        }
    }

}, {

    KEY_IDENTIFIERS: {
        value: {
            space: "space",
            enter: "enter",
            up: "up",
            down: "down"
        }
    }
});


Select.prototype.handleSpaceKeyPress = Select.prototype._handleSpaceKeyPress;
Select.prototype.handleUpKeyPress = Select.prototype._handledUpKeyPress;
Select.prototype.handleDownKeyPress = Select.prototype._handleDownKeyPress;
Select.prototype.handleSelectButtonAction = Select.prototype._toggleOptionsOverlay;
Select.prototype.handleEnterKeyPress = Select.prototype._handleEnterKeyPress;
Select.prototype.exitDocument = Select.prototype._hideOptionsOverlay;


var NONE_OPTION_LABEL = "none",
    NONE_OPTION_VALUE = "_none",
    NONE_SELECT_OPTION = {label: NONE_OPTION_LABEL, value: NONE_OPTION_VALUE};
