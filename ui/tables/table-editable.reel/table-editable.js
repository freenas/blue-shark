/**
 * @module ui/table-editable.reel
 */
var Component = require("montage/ui/component").Component,
    Overlay = require("montage/ui/overlay.reel").Overlay,
    Checkbox = require("montage/ui/checkbox.reel").Checkbox,
    Composer = require("montage/composer/composer").Composer;


function _shouldComposerSurrenderPointerToComponent(composer, pointer, component) {
    if (component && component.element) {
        var targetElement = component.element,
            overlayCandidate;

        if (component instanceof Composer) {
            component = component.component;
        }

        if (component) {
            while (component && !overlayCandidate) {
                if (component instanceof Overlay) {
                    overlayCandidate = component;
                } else {
                    component = component.parentComponent;
                }
            }

            if (component && component.anchor) {
                targetElement = component.anchor;
            }
        }

        if (!this.element.contains(targetElement)) {
            this.dismissOverlay({
                targetElement: targetElement,
                type: pointer
            });
        }
    }

    return true;
}


function RowEntry(object) {
    this.object = object;
    this.selected = false
}


/**
 * @class TableEditable
 * @extends Component
 */
exports.TableEditable = Component.specialize({

    templateDidLoad: {
        value: function () {
            this.rowControlsOverlay.shouldComposerSurrenderPointerToComponent = _shouldComposerSurrenderPointerToComponent;
            this.rowControlsOverlay.anchor = this._tableBodyTopElement;
            this.addRangeAtPathChangeListener("rows", this, "handleRowsChange");
            this.rows = [];
        }
    },

    _shouldShowNewEntryRow: {
        set: function (shouldShowNewEntryRow) {
            shouldShowNewEntryRow = !!shouldShowNewEntryRow;

            if (this.__shouldShowNewEntryRow !== shouldShowNewEntryRow) {
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
            if (this.isAddingNewEntry) {
                if (!this._currentNewEntry) {
                    var defaultNewEntry = {};
                    defaultNewEntry = this.callDelegateMethod(
                        "tableWillUseNewEntry",
                        this,
                        defaultNewEntry
                    ) || defaultNewEntry;

                    this._currentNewEntry = new RowEntry(defaultNewEntry);
                }
            } else {
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
                    this.rows.splice(index, 1);
                }
            }
        }
    },

    //END Public API

    willPositionOverlay: {
        value: function (overlay, calculatedPosition) {
            var anchor = overlay.anchor,
                width = overlay.element.offsetWidth,
                anchorPosition = anchor.getBoundingClientRect(),
                anchorHeight = anchor.offsetHeight || 0,
                anchorWidth = anchor.offsetWidth || 0,
                position = {
                    top: anchorPosition.top + anchorHeight,
                    left: anchorPosition.left + (anchorWidth - width)
                };

            if (position.left < 0) {
                position.left = 0;
            }

            return position;
        }
    },

    shouldDismissOverlay: {
        value: function (overlay, target, eventType) {
            return overlay === this.rowControlsOverlay && !this.isAddingNewEntry;
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this.rowControlsOverlay.addEventListener("action", this);
            this.addEventListener("action", this);
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
            this._cancelAddingNewEntry();
        }
    },

    handleDoneAction: {
        value: function () {
            this._stopAddingNewEntry();
        }
    },

    handleAction: {
        value: function (event) {
            var target = event.target;

            if (this._toggleAllComponent.element.contains(target.element)) {
                this._handleToggleAllAction(event);
            } else if (target instanceof Checkbox && this._rowRepetitionComponent.element.contains(target.element)) {
                this._toggleAllComponent.checked = this.selectedRows &&
                    this.selectedRows.length === this.rows.length;
            }
        }
    },

    _handleToggleAllAction: {
        value: function (event) {
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

                var shoulAddNewEntry = this.callDelegateMethod(
                    "tableWillAddNewEntry",
                    this,
                    this.currentNewEntry.object,
                    this.contentController
                );

                if (shoulAddNewEntry !== void 0 ? !!shoulAddNewEntry : true) {
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
            this.callDelegateMethod(
                "tableWillStartEditingNewEntry",
                this,
                this.currentNewEntry.object,
                this.contentController
            );
            
        }
    },

    draw: {
        value: function () {
            if (this._shouldShowNewEntryRow) {
                this.__shouldShowNewEntryRow = false;
                this._startAddingNewEntry();
                this.rowControlsOverlay.show();
                this.dispatchOwnPropertyChange("isAddingNewEntry", this.isAddingNewEntry);
                this.dispatchOwnPropertyChange("currentNewEntry", this.currentNewEntry);

            } else if (this._shouldHideNewEntryRow) {
                this._shouldHideNewEntryRow = false;
                this.dispatchOwnPropertyChange("isAddingNewEntry", this.isAddingNewEntry);
                this.dispatchOwnPropertyChange("currentNewEntry", this.currentNewEntry);
                this.rowControlsOverlay.hide();
            }
        }
    }

});
