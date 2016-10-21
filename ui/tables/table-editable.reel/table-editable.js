/**
 * @module ui/table-editable.reel
 */
var Component = require("montage/ui/component").Component,
    Overlay = require("montage/ui/overlay.reel").Overlay,
    Composer = require("montage/composer/composer").Composer;

/**
 * @class TableEditable
 * @extends Component
 */
exports.TableEditable = Component.specialize({

    templateDidLoad: {
        value: function () {
            this.rowControlsOverlay.shouldComposerSurrenderPointerToComponent = function (composer, pointer, component) {                
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
        }
    },

    _shouldStopEditingRow: {
        set: function (shouldStopEditingRow) {
            shouldStopEditingRow = !!shouldStopEditingRow;

            if (this.__shouldStopEditingRow !== shouldStopEditingRow) {
                this.__shouldStopEditingRow = shouldStopEditingRow;
                this.needsDraw = true;
            }
        },
        get: function () {
            return this.__shouldStopEditingRow;
        }
    },

    _shouldStartEditingRow: {
        set: function (shouldStartEditingRow) {
            shouldStartEditingRow = !!shouldStartEditingRow;

            if (this.__shouldStartEditingRow !== shouldStartEditingRow) {
                this.__shouldStartEditingRow = shouldStartEditingRow;
                this.needsDraw = true;
            }
        },
        get: function () {
            return this.__shouldStartEditingRow;
        }
    },

    _candidateRow: {
        set: function (candidateRow) {
            if (this.__candidateRow !== candidateRow) {
                var previousCandidate = this.__candidateRow;

                if (previousCandidate) {
                    this._cancelEditing();
                }

                this.__candidateRow = candidateRow;
                this.isNewEntryRowShown = candidateRow === this._tableBodyTopElement;

                if (candidateRow) {
                    this._shouldStartEditingRow = true;
                } else if (!candidateRow && !previousCandidate) {
                    this._shouldStopEditingRow = true;
                }
            }
        },
        get: function () {
            return this.__candidateRow;
        }
    },

    //Public API

    isEditingRow: {
        get: function () {
            return !!this.currentEditingRow;
        }
    },

    currentEditingObject: {
        get: function () {
            if (this._currentEditingRow) {
                if (!this._currentEditingObject) {
                    if (this._rowRepetitionComponent.element.contains(this._currentEditingRow)) {
                        var iteration = this._rowRepetitionComponent._findIterationContainingElement(this._currentEditingRow);
                        this._currentEditingObject = iteration ? iteration.object : null;
                    } else if (this._currentEditingRow === this._tableBodyTopElement) {
                        this._currentEditingObject = {};
                    } else {
                        this._currentEditingObject = null;
                    }
                }
            } else {
                this._currentEditingObject = null;
            }

            return this._currentEditingObject;
        }
    },

    currentEditingRow: {
        set: function (currentEditingRow) {
            if (this._currentEditingRow !== currentEditingRow) {
                this._currentEditingRow = currentEditingRow;
                this.dispatchOwnPropertyChange("isEditingRow", this.isEditingRow);
                this.dispatchOwnPropertyChange("currentEditingObject", this.currentEditingObject);
            }
        },
        get: function () {
            return this._currentEditingRow;
        }
    },

    hideNewEntryRow: {
        value: function () {
            this._candidateRow = null;
        }
    },

    showNewEntryRow: {
        value: function () {
            this._candidateRow = this._tableBodyTopElement;
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
            var shouldDismissOverlay = !this._tableBodyTopElement.contains(target) && 
                !this._rowRepetitionComponent.element.contains(target) && eventType !== "keyPress";

            if (shouldDismissOverlay) {
                this.currentEditingRow = null;
            }

            return shouldDismissOverlay;
        }
    },

    prepareForActivationEvents: {
        value: function () {
            //FIXME: Can use AddEventListener bug in montage??
            this.element.nativeAddEventListener("mouseup", this, false);
            this.rowControlsOverlay.addEventListener("action", this);
        }
    },

    handleCancelAction: {
        value: function () {
            this._candidateRow = null;
        }
    },

    handleDoneAction: {
        value: function () {
            this._stopEditing();
        }
    },

    handleEvent: {
        value: function (event) {
            if (event.type = "mouseup") {
                var textRowCellRepetitionElement = this._rowRepetitionComponent.element,
                    target = event.target.element || event.target,
                    candidate;

                if (textRowCellRepetitionElement.contains(target)) {
                    while (textRowCellRepetitionElement !== target) {
                        candidate = target;
                        target = candidate.parentNode;
                    }

                    if (candidate) {
                        this._candidateRow = candidate;
                    }
                } else if (this._tableBodyTopElement.contains(target)) {
                    this._candidateRow = this._tableBodyTopElement;
                } 
            }             
        }
    },

    _cancelEditing: {
        value: function () {
            this.callDelegateMethod("tableWillCancelEditingRow", this, this.currentEditingObject, this.contentController, this.currentEditingRow);
            this.rowControlsOverlay.hide();
        }
    },

    _stopEditing: {
        value: function () {
            this.callDelegateMethod("tableWillEndEditingRow", this, this.currentEditingObject, this.contentController, this.currentEditingRow);
            this.rowControlsOverlay.hide();
            this.__candidateRow = null;
            this._currentEditingObject = null;
            this.isNewEntryRowShown = false;
        }
    },

    _startEditing: {
        value: function () {
            this.callDelegateMethod("tableWillStartEditingRow", this, this.currentEditingObject, this.contentController, this.currentEditingRow);
            this.rowControlsOverlay.show();
        }
    },

    draw: {
        value: function () {
            if (this._shouldStopEditingRow) {
                this.__shouldStopEditingRow = false;
                this._stopEditing();
                this.currentEditingRow = null;

                if (this._shouldStartEditingRow) {
                    this.needsDraw = true;
                }

            } else if (this._shouldStartEditingRow) {
                this.__shouldStartEditingRow = false;
                this.currentEditingRow = this.rowControlsOverlay.anchor = this._candidateRow;
                this._startEditing();
            }
        }
    }

});
