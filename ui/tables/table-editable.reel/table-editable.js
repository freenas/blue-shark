/**
 * @module ui/table-editable.reel
 */
var Component = require("montage/ui/component").Component,
    Checkbox = require("montage/ui/checkbox.reel").Checkbox,
    Composer = require("montage/composer/composer").Composer;

function RowEntry(object) {
    this.object = object;
    this.selected = false;
}


/**
 * @class TableEditable
 * @extends Component
 */
exports.TableEditable = Component.specialize({

    isMultiSelectionEnabled: {
        value: true
    },

    rows: {
        set: function (rows) {
            this._rows = rows;
        },
        get: function () {
            if (!this._rows) {
                this._rows = []
            }

            return this._rows;
        }
    },

    templateDidLoad: {
        value: function () {
            this.addRangeAtPathChangeListener("rows", this, "handleRowsChange");
        }
    },

    _shouldShowNewEntryRow: {
        set: function (shouldShowNewEntryRow) {
            shouldShowNewEntryRow = !!shouldShowNewEntryRow;

            if (this.__shouldShowNewEntryRow !== shouldShowNewEntryRow) {
                document.addEventListener("wheel", this, true);
                this.__shouldShowNewEntryRow = shouldShowNewEntryRow;
                this._canShowNewEntryRow = true;
                this.needsDraw = true;
            }
        },
        get: function () {
            return this.__shouldShowNewEntryRow;
        }
    },

    _shouldHideNewEntryRow: {
        set: function (shouldHideNewEntryRow) {
            shouldHideNewEntryRow = !!shouldHideNewEntryRow;

            if (this.__shouldHideNewEntryRow !== shouldHideNewEntryRow) {
                this.__shouldHideNewEntryRow = shouldHideNewEntryRow;
                this._canShowNewEntryRow = false;
                this.needsDraw = true;
            }
        },
        get: function () {
            return this.__shouldHideNewEntryRow;
        }
    },

    //Public API

    isAddingNewEntry: {
        get: function () {
            return !!this._canShowNewEntryRow;
        }
    },

    currentNewEntry: {
        get: function () {
            if (!this.isAddingNewEntry) {
                this._currentNewEntry = null;
            }

            return this._currentNewEntry;
        }
    },

    hideNewEntryRow: {
        value: function () {
            this._cancelAddingNewEntry();
        }
    },

    showNewEntryRow: {
        value: function () {
            this._shouldShowNewEntryRow = true;
        }
    },

    deleteSelectedRows: {
        value: function () {
            var rowEntry,
                index;

            while (this.selectedRows.length) {
                rowEntry = this.selectedRows[0];

                if ((index = this.rows.indexOf(rowEntry.object)) > -1) {
                    this.callDelegateMethod(
                        "tableWillDeleteEntry",
                        rowEntry.object
                    );
                    this.rows.splice(index, 1);
                }
            }
        }
    },

    findRowIterationContainingElement: {
        value: function (element) {
            return this._rowRepetitionComponent._findIterationContainingElement(element);
        }
    },

    //END Public API

    prepareForActivationEvents: {
        value: function () {
            this.addEventListener("action", this);
            this.element.addEventListener("click", this);
        }
    },

    _activeRow: {
        value: null
    },

    _activeRowEntry: {
        value: null
    },

    _showControls: {
        value: function() {
            if (this._activeRow) {
                this._activeRow.classList.add('is-active');
                this.rowControls.style.top = this._activeRow.offsetHeight + this._activeRow.offsetTop + "px";
            } else {
                this.rowControls.style.top = this._tableBodyTopElement.offsetHeight + this._tableBodyTopElement.offsetTop + "px";
            }
            this._rowRepetitionComponent.element.classList.add('is-active');
            this.rowControls.classList.add('is-active');
        }
    },

    _hideControls: {
        value: function() {
            if(this._activeRow) {
                this._activeRow.classList.remove('is-active');
                this._activeRow = this._activeRowEntry = null;
            }
            this.rowControls.classList.remove('is-active');
            this._rowRepetitionComponent.element.classList.remove('is-active');
        }
    },

    // probably should not be a click event?
    // idea here is to make the row active and show controls based on data being changed
    handleClick: {
        value: function(e) {
            console.log(e);
            // if a row contains the element and the row element doesn't equal the activeRow
            if (this.findRowIterationContainingElement(e.target) && this.findRowIterationContainingElement(e.target).firstElement !== this._activeRow && !e.target.parentNode.classList.contains('Checkbox')) {
                if (this._activeRow) {
                    this._activeRow.classList.remove('is-active');
                }
                this._activeRow = this.findRowIterationContainingElement(e.target).firstElement;
                this._activeRowEntry = this._activeRow.querySelector('[data-montage-id=rowEntry]').component;
                this._showControls();

            // if the event target is not in the row or the row controls
            } else if(this._activeRow && !this._activeRow.contains(e.target) && !this.rowControls.contains(e.target)) {
                this._hideControls();
            }
        }
    },

    handleRowsChange: {
        value: function () {
            if (this._inDocument) {
                this._toggleAllComponent.checked = this.rows.length > 0 && this.selectedRows &&
                    this.selectedRows.length === this.rows.length;
            }
        }
    },

    handleCancelAction: {
        value: function () {
            this._hideControls();
            this._cancelAddingNewEntry();
        }
    },

    handleDoneAction: {
        value: function () {
            this._hideControls();
            this._stopAddingNewEntry();
        }
    },

    handleAction: {
        value: function (event) {
            console.log(event);
            var target = event.target;

            if (this._toggleAllComponent.element.contains(target.element)) {
                this._handleToggleAllAction(event);
            } else if (target instanceof Checkbox && this._rowRepetitionComponent.element.contains(target.element)) {
                this._toggleAllComponent.checked = this.selectedRows && this.selectedRows.length === this.rows.length;
            }
        }
    },

    _getNewEntry: {
        value: function () {
            var defaultNewEntry = {};

            defaultNewEntry = this.callDelegateMethod(
                "tableWillUseNewEntry",
                this,
                defaultNewEntry
            ) || defaultNewEntry;

            if (Promise.is(defaultNewEntry)) {
                return defaultNewEntry.then(function (NewEntry) {
                    return new RowEntry(NewEntry);
                });
            }

            return Promise.resolve(new RowEntry(defaultNewEntry));
        }
    },

    _handleToggleAllAction: {
        value: function() {
            var self = this;

            this._rowEntries.forEach(function (rowEntry) {
                rowEntry.selected = !!self._toggleAllComponent.checked;
            });
        }
    },

    _cancelAddingNewEntry: {
        value: function () {
            if (this.isAddingNewEntry) {
                this.callDelegateMethod(
                    "tableDidCancelEditingNewEntry",
                    this,
                    this.currentNewEntry.object,
                    this.contentController
                );

                this._shouldHideNewEntryRow = true;
            }

        }
    },

    _stopAddingNewEntry: {
        value: function () {
            if (this.isAddingNewEntry) {
                var shouldAddNewEntry = this.callDelegateMethod(
                    "tableWillAddNewEntry",
                    this,
                    this.currentNewEntry.object,
                    this.contentController
                );

                if (shouldAddNewEntry !== void 0 ? !!shouldAddNewEntry : true) {
                    this.contentController.add(this.currentNewEntry.object);
                    this.callDelegateMethod(
                        "tableDidAddNewEntry",
                        this,
                        this.currentNewEntry.object,
                        this.contentController
                    );
                }

                this._shouldHideNewEntryRow = true;
            }
        }
    },

    _startAddingNewEntry: {
        value: function () {
            var self = this;

            return this._getNewEntry().then(function (newEntry) {
                self._currentNewEntry = newEntry;

                self.callDelegateMethod(
                    "tableWillStartEditingNewEntry",
                    self,
                    self.currentNewEntry.object,
                    self.contentController
                );

                self._showControls();
                self.dispatchOwnPropertyChange("isAddingNewEntry", self.isAddingNewEntry);
                self.dispatchOwnPropertyChange("currentNewEntry", self.currentNewEntry);
            });
        }
    },

    draw: {
        value: function () {
            if (this._shouldShowNewEntryRow) {
                this.__shouldShowNewEntryRow = false;
                this._startAddingNewEntry();
                this._showControls();

            } else if (this._shouldHideNewEntryRow) {
                this._shouldHideNewEntryRow = false;
                this.dispatchOwnPropertyChange("isAddingNewEntry", this.isAddingNewEntry);
                this.dispatchOwnPropertyChange("currentNewEntry", this.currentNewEntry);
                this._hideControls();
            }
        }
    }

});

