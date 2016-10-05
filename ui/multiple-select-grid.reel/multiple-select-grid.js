/**
 * @module ui/multiple-select-grid.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class MultipleSelectGrid
 * @extends Component
 */
exports.MultipleSelectGrid = Component.specialize(/** @lends MultipleSelectGrid# */ {

    _sorter: {
        value: null
    },

    _sortedSelection: {
        get: function() {
            if (!this._sorter && this._selection && this._selection.length > 0) {
                this._sorter = typeof this._selection[0].index !== 'undefined' ? this.constructor._indexSorter : this.constructor._valueSorter;
            }
            return this._selection ? this._selection.slice().sort(this._sorter).map(function(x) { return x.value; }) : [];
        }
    },

    selectedValues: {
        get: function() {
            return this._sortedSelection;
        }, set: function(selectedValues) {
            if (this.options) {
                this._selection = this.options.filter(function(x) {
                    return selectedValues.indexOf(x.value) != -1;
                });
            }
        }
    },

    enterDocument: {
        value: function() {
            this.addPathChangeListener("frequency", this, "_handleFrequencyChange");
            this._cancelSelectionListener = this.addRangeAtPathChangeListener("_selection", this, "_handleSelectionChange");
        }
    },

    exitDocument: {
        value: function() {
            this.removePathChangeListener("frequency", this);
            if (typeof this._cancelSelectionListener === 'function') {
                this._cancelSelectionListener();
                this._cancelSelectionListener = null;
            }
        }
    },

    handleClearSelectionButtonAction: {
        value: function () {
            this.controller.clearSelection();
            this.frequency = null;
        }
    },

    _handleSelectionChange: {
        value: function() {
            this.frequency = this._getSelectionFrequency();
        }
    },

    _handleFrequencyChange: {
        value: function() {
            if (this.frequency > 0) {
                if (this._getSelectionFrequency() !== this.frequency) {
                    var options = this.controller.organizedContent,
                        selection = [];
                    for (var i = 0, length = options.length; i < length; i = i + this.frequency) {
                        selection.push(options[i]);
                    }
                    this._selection = selection;
                }
            } else if (typeof this.frequency === 'number') {
                this.frequency = null;
            }
        }
    },

    _getSelectionFrequency: {
        value: function() {
            if (this._selectedIndexes.length > 1) {
                var i, length,
                    referenceInterval = this._selectedIndexes[0] === 0 ? this._selectedIndexes[1] - this._selectedIndexes[0] : this._selectedIndexes[0] + 1;
                for (i = 0, length = this._selectedIndexes.length-1; i < length; i++) {
                    if (this._selectedIndexes[i+1] - this._selectedIndexes[i] !== referenceInterval) {
                        return null;
                    }
                }
                var intervalToEnd = this.options.length - this._selectedIndexes[length];
                if (intervalToEnd > 1 && intervalToEnd !== referenceInterval) {
                    return null;
                }
                return referenceInterval;
            } else if (this._selectedIndexes.length === 1) {
                return this.options.length;
            } else {
                return null;
            }
        }
    }
        

}, {
    _indexSorter: {
        value: function(a, b) {
            return a.index - b.index;
        }
    },
    _valueSorter: {
        value: function(a, b) {
            return a.value < b.value ? -1 :  a.value > b.value ? 1 : 0;
        }
    }
});
