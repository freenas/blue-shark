var Component = require("montage/ui/component").Component,
    Overlay = require("montage/ui/overlay.reel").Overlay,
    Checkbox = require("montage/ui/checkbox.reel").Checkbox,
    Composer = require("montage/composer/composer").Composer,
    _ = require('lodash');


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
                this._rows = [];
            }

            return this._rows;
        }
    },

    templateDidLoad: {
        value: function () {
            this.rowControlsOverlay.shouldComposerSurrenderPointerToComponent = _shouldComposerSurrenderPointerToComponent;
            this.rowControlsOverlay.anchor = this._tableBodyTopElement;
            this.addRangeAtPathChangeListener("rows", this, "handleRowsChange");
            this._needsLoadComponent = true;
        }
    },

    enterDocument: {
        value: function () {
            if (!!this.contentMaxHeight) {
                this.scrollview.style.maxHeight = this.contentMaxHeight + "em";
            }
            new MutationObserver(this._handleRowsChange.bind(this)).observe(this._rowRepetitionComponent.element, {
                childList: true
            });
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
                document.removeEventListener("wheel", this, true);
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
            var index;

            while (this.selectedRows.length) {
                if ((index = this.rows.indexOf(this.selectedRows[0])) > -1) {
                    this.rows.splice(index, 1);
                }
            }
        }
    },

    captureWheel: {
        value: function () {
            this.rowControlsOverlay.needsDraw = true;
        }
    },

    findRowIterationContainingElement: {
        value: function (element) {
            return this._rowRepetitionComponent._findIterationContainingElement(element);
        }
    },


    //END Public API

    willPositionOverlay: {
        value: function (overlay, calculatedPosition) {
            var anchor = overlay.anchor,
                width = overlay.element.offsetWidth,
                anchorPosition = anchor.getBoundingClientRect(),
                position = {
                    top: anchorPosition.top + anchorPosition.height,
                    left: anchorPosition.left + (anchorPosition.width - width)
                };

            if (position.left < 0) {
                position.left = 0;
            }

            return position;
        }
    },

    shouldDismissOverlay: {
        value: function (overlay, target, eventType) {
            if (overlay === this.rowControlsOverlay) {
                if (!this._tableBodyTopElement.contains(target)) {
                    if (this.isAddingNewEntry) {
                        this._cancelAddingNewEntry();
                    }
                } else {
                    return false;
                }
            }

            return true;
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
        value: function (event) {
            var self = this;

            this.rows.forEach(function (row) {
                row._selected = !!self._toggleAllComponent.checked;
            });
            this.needsDraw = true;
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
            var self = this;

            return this._getNewEntry().then(function (newEntry) {
                self._currentNewEntry = newEntry;

                self.callDelegateMethod(
                    "tableWillStartEditingNewEntry",
                    self,
                    self.currentNewEntry.object,
                    self.contentController
                );

                self.rowControlsOverlay.show();
                self.dispatchOwnPropertyChange("isAddingNewEntry", self.isAddingNewEntry);
                self.dispatchOwnPropertyChange("currentNewEntry", self.currentNewEntry);
            });
        }
    },

    _ensureToggleAllIsInHeader: {
        value: function () {
            var selectAll = this._toggleAllComponent.element,
                header = this.element.querySelector('.TableHeaderLayout-row');
            if (selectAll.parentElement !== header) {
                header.insertBefore(selectAll, header.firstChild);
            }
        }
    },

    _synchronizeRowsSelection: {
        value: function () {
            _.forEach([].slice.call(this.element.querySelectorAll('.Table-cells')), function (row) {
                var input = row.firstElementChild.querySelector('input');
                if (input) {
                    if (row.component.object && row.component.object._selected) {
                        input.setAttribute('checked', '');
                    } else {
                        input.removeAttribute('checked');
                    }
                }
            });
        }
    },

    draw: {
        value: function () {
            if (this._shouldShowNewEntryRow) {
                this.__shouldShowNewEntryRow = false;
                this._startAddingNewEntry();

            } else if (this._shouldHideNewEntryRow) {
                this._shouldHideNewEntryRow = false;
                this.dispatchOwnPropertyChange("isAddingNewEntry", this.isAddingNewEntry);
                this.dispatchOwnPropertyChange("currentNewEntry", this.currentNewEntry);
                this.rowControlsOverlay.hide();
            }
            this._ensureToggleAllIsInHeader();
            this._synchronizeRowsSelection();
            var newLine = this.element.querySelector('.Table-newLine').firstElementChild,
                header = this.element.querySelector('.TableHeaderLayout-row');
            while (newLine.childElementCount < header.childElementCount) {
                newLine.insertBefore(document.createElement('div'), newLine.firstChild);
            }

        }
    },

    _addRowSelector: {
        value: function (addedElement) {
            var self = this,
                cell = document.createElement('div'),
                control = document.createElement('div'),
                input = document.createElement('input'),
                label = document.createElement('label'),
                id = Date.now() + '-' + _.round(Math.random() * 1000);
            cell.setAttribute('class', 'TableCells-selectRow');
            control.setAttribute('class', 'Checkbox');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('role', 'checkbox');
            input.setAttribute('id', id);
            label.setAttribute('for', id);
            label.setAttribute('class', 'Checkbox-label');
            control.appendChild(input);
            control.appendChild(label);
            cell.appendChild(control);
            control.onclick = function (event) {
                var rowObject = cell.parentElement.component.object;
                rowObject._selected = !rowObject._selected;
                self.needsDraw = true;
                event.preventDefault();
            };
            addedElement.insertBefore(cell, addedElement.firstChild);
        }
    },

    _handleRowsChange: {
        value: function (mutationRecords) {
            var self = this;
            _.forEach(
                _.filter(mutationRecords, function (x) {
                    return x.addedNodes.length > 0
                }),
                function (mutationRecord) {
                    var addedNodes = [].slice.call(mutationRecord.addedNodes),
                        addedElements = _.filter(addedNodes, { nodeType: Node.ELEMENT_NODE }),
                        addedElement;
                    if (addedElements.length === 1) {
                        addedElement = addedElements[0];
                        if (addedElement.classList.contains('Table-cells') &&
                            !addedElement.firstElementChild.classList.contains('TableCells-selectRow')) {
                            self._addRowSelector(addedElement);
                        }
                    }
                }
            );
        }
    }
});
