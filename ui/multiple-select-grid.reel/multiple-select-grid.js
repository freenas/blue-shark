/**
 * @module ui/multiple-select-grid.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class MultipleSelectGrid
 * @extends Component
 * @todo: need review with benoit
 */
exports.MultipleSelectGrid = Component.specialize(/** @lends MultipleSelectGrid# */ {

    constructor: {
        value: function () {
            //Fixme: can't bound selection because already bounded.
            this.addRangeAtPathChangeListener("options.selection", this, "handleOptionSelectionChange");
        }
    },

    _cancelSelectionRangeChangeListener: {
        value: null
    },

    _selectedValues: {
        value: null
    },

    selectedValues: {
        get: function() {
            return this.selection ? this.selection.map(function(x) { return x.value; }) : [];
        },
        set: function(selectedValues) {
            if (this._selectedValue !== selectedValues) {
                this._selectedValues = selectedValues;
                var selection = [];
                if (this.options && selectedValues) {
                    var options = this.options.content,
                        optionsLength = options.length,
                        j, entry, value;
                    for (var i = 0, length = selectedValues.length; i < length; i++) {
                        value = selectedValues[i];
                        for (j = 0; j < optionsLength; j++) {
                            entry = options[j];
                            if (entry.value === value) {
                                selection.push(entry);
                                break;
                            }
                        }
                    }
                }
                this.selection = selection;
            }
        }
    },

    _selection: {
        value: null
    },

    selection: {
        set: function (selection) {
            if (this.options) {
                var optionSelection = this.options.selection;

                if (optionSelection) {
                    optionSelection.clear();
                }

                if (this._selection) {
                    this._cancelSelectionRangeChangeListener();
                    this._selection = null;
                }

                this._selection = selection;

                if (selection) {
                    //Fixme: @see multiple-select-grid.info
                    // issue with a 2-way bindings not the same array. (this.options.selection = selection won't work)
                    this._cancelSelectionRangeChangeListener = (
                        this.addRangeAtPathChangeListener("_selection", this, "handleSelectionChange")
                    );
                } else {
                    this._cancelSelectionRangeChangeListener = null;
                }
            }
        },
        get: function () {
            return this.options ? this.options.selection : null;
        }
    },

    handleSelectionChange: {
        value: function (plus, minus) {
            if (plus.length) {
                this.options.selection.addEach(plus);
            }

            if (minus) {
                this.options.selection.deleteEach(minus);
            }
        }
    },

    handleOptionSelectionChange: {
        value: function () {
            this.dispatchOwnPropertyChange("selection", this.selection);
            this.dispatchOwnPropertyChange("selectedValues", this.selectedValues);
        }
    },

    enterDocument: {
        value: function() {
            this.selectedValues = this._selectedValues;
        }
    }

});
