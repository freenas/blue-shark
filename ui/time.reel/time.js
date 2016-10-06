/**
 * @module ui/time.reel
 */
var Component = require("montage/ui/component").Component,
    KeyComposer = require("montage/composer/key-composer").KeyComposer;

/**
 * @class Time
 * @extends Component
 */
exports.Time = Component.specialize(/** @lends Time# */ {
    enterDocument: {
        value: function() {
            if (!this.options) {
                this.options = [];
                if (this.intervalInSeconds) {
                    var maxValue = new Date(0, 0, 0, 23, 59, 59),
                        seconds = 0,
                        nextOption = new Date(0, 0, 0, 0, 0, seconds);
                    while (nextOption <= maxValue) {
                        this.options.push(nextOption);
                        seconds += this.intervalInSeconds;
                        nextOption = new Date(0, 0, 0, 0, 0, seconds);
                    }
                }
            }
            if (this.isDefaultNow) {
                this.options.unshift(new Date());
            }
            if (!this.allowEmpty && !this.value) {
                this._selectedOption = this.options[0];
            }
            if (this.value) {
                this._selectedOption = this._findMatchingOption();
            }
        }
    },

    prepareForActivationEvents: {
        value: function() {
            this._inputField.delegate = {
                shouldAcceptValue: function() {
                    return true;
                }
            };
            KeyComposer.createKey(this._inputField, "down", "down").addEventListener("keyPress", this);
            KeyComposer.createKey(this._inputField, "up", "up").addEventListener("keyPress", this);
        }
    },

    enabled: {
        value: true
    },

    options: {
        value: null
    },

    _blurInputField: {
        value: function () {
            this._inputField.element.blur();
        }
    },

    handleInputAction: {
        value: function() {
            if (this._inputField.value) {
                this.value = this._inputField.value;
                this._selectedOption = this._findMatchingOption();
                this._blurInputField();
            }
        }
    },

    handleDownKeyPress: {
        value: function(event) {
            switch (event.target.component) {
                case this._inputField:
                    if (this.options && this.options.length > 0) {
                        this._navigateInOptions(1)
                    }
                    break;
            }
        }
    },

    handleUpKeyPress: {
        value: function(event) {
            switch (event.target.component) {
                case this._inputField:
                    if (this.options && this.options.length > 0) {
                        this._navigateInOptions(-1);
                    }
                    break;
            }
        }
    },

    _findMatchingOption: {
        value: function() {
            var i, length, option;
            for (i = 0, length = this.options.length; i < length; i++) {
                option = this.options[i];
                if (option === this.value) {
                    return option;
                }
            }
        }
    },

    _stopScrollingOptions: {
        value: function () {
            this._optionsController.clearSelection();
            this._selectedOption = null;
            this._inputField.value = this._typedValue;
            this._typedValue = null;
        }
    },

    _navigateInOptions: {
        value: function(distance) {
            if (this.value === this._optionsController.selection[0]) {
                var currentIndex = this._optionsController.organizedContent.indexOf(this._optionsController.selection[0]),
                    newIndex = currentIndex + distance,
                    contentLength = this._optionsController.organizedContent.length;
                if (newIndex < 0) {
                    newIndex = contentLength -1;
                }
                this._selectedOption = this._optionsController.organizedContent[newIndex % contentLength];
            } else {
                if (distance > 0) {
                    this._selectedOption = this._findNextOption();
                } else {
                    this._selectedOption = this._findPreviousOption();
                }
            }
        }
    },

    _findPreviousOption: {
        value: function() {
            var option;
            for (var i = 0, length = this.options.length; i < length; i++) {
                option = this.options[i];
                if (this.value.getHours() === option.getHours() && this.value.getMinutes() === option.getMinutes()) {
                    return option;
                } else if (option.getHours() > this.value.getHours() || (option.getHours() === this.value.getHours() && option.getMinutes() > this.value.getMinutes())) {
                    break;
                }
            }
            return this.options[i-1];
        }
    },

    _findNextOption: {
        value: function() {
            var option;
            for (var i = this.options.length-1; i >= 0; i--) {
                option = this.options[i];
                if (this.value.getHours() === option.getHours() && this.value.getMinutes() === option.getMinutes()) {
                    return option;
                } else if (option.getHours() < this.value.getHours() || (option.getHours() === this.value.getHours() && option.getMinutes() < this.value.getMinutes())) {
                    break;
                }
            }
            return this.options[i+1];
        }
    },

    __selectedOption: {
        value: null
    },

    _selectedOption: {
        get: function() {
            return this.__selectedOption;
        },
        set: function(option) {
            if (option && this.__selectedOption != option) {
                this.__selectedOption = option;
                this._optionsController.select(option);
                this.value = option;
            }
        }
    },

    handleIncrementAction: {
        value: function (e) {
            this._navigateInOptions(1);
        }
    },

    handleDecrementAction: {
        value: function (e) {
            this._navigateInOptions(-1);
        }
    }
});

