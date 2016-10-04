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

    _iteratorValue: {
        value: null
    },

    iteratorValue: {
        get: function () {
            return this._iteratorValue;
        },
        set: function (value) {
            if(this._iteratorValue !== value) {
                // change to a loop
                if (value !== 0){
                    for(var i = 0; i < this.options.iterations.length; i++) {
                        this.options.iterations[i].selected = false;
                        if (i % value == 0) {
                            this.options.iterations[i].selected = true;
                        }
                    }
                }
                this._iteratorValue = value;
            }
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
            if (this._selectedValues !== selectedValues) {
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

    checkForConsistentIteration: {
        value: function () {

            // @FIXME - attempted to figure out iterationValue from sortedSelection

            // if (this.rangeController && this.sortedSelection.length > 1) {
            //     var iterationValue = this.sortedSelection[1].index - this.sortedSelection[0].index,
            //         counter = 0;
            //     console.log(iterationValue);

            //     for (var i = 0; i < this.sortedSelection.length; i++) {

            //         // take the two values and check that they equal the iterationValue

            //         // if they don't then exit the loop

            //         // check if there is an iteration at the current index plus the iterationValue
            //         // if not then set the iteration value


            //         if (this.sortedSelection[i+1]) {

            //             if (this.sortedSelection[i].index + iterationValue !== this.sortedSelection[i+1].index) {
            //                 console.log("exit");
            //                 this.iteratorValue = 0;
            //                 return false;
            //             }

            //         }
            //         // check the last one if there are values after
            //         if (this.options.iterations[this.sortedSelection[this.sortedSelection.length - 1].index + iterationValue]) {
            //             console.log("values at end")
            //             this.iteratorValue = 0;
            //             return false;
            //         } else {
            //             this.iteratorValue = iterationValue;
            //             console.log("past the end");
            //         }

            //     }
            // }

            if (this.rangeController && this.sortedSelection.length > 1 && this.sortedSelection[0].index == 0) {
                var iterationValue = this.sortedSelection[1].index,
                    counter = 0;

                for (var i = iterationValue; i < this.options.iterations.length; i++) {
                    if(this.options.iterations[i].selected && counter == 0) {
                        // reset counter
                        counter = iterationValue;

                    } else if (counter == 0 || this.options.iterations[i].selected) {
                        this.iteratorValue = 0;
                        return false;
                    }

                    if (i == this.options.iterations.length - 1) {
                        this.iteratorValue = iterationValue;
                    }

                    counter--;
                }
            }
        }
    },

    handleOptionSelectionChange: {
        value: function () {
            this.dispatchOwnPropertyChange("selection", this.selection);
            this.dispatchOwnPropertyChange("selectedValues", this.selectedValues);

            if(this.hasIterator) {
                this.checkForConsistentIteration();
            }
        }
    },

    enterDocument: {
        value: function() {
            this.selectedValues = this._selectedValues;
        }
    },

    _clearSelection: {
        value: function () {
            this.options.iterations.forEach(function(iteration){
                iteration.selected = false;
            });
        }
    },

    handleClearSelectionButtonAction: {
        value: function () {
            this._clearSelection();
            this.iteratorValue = 0;
        }
    }

});
