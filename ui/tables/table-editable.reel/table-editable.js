/**
 * @module ui/table-editable.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableEditable
 * @extends Component
 */
exports.TableEditable = Component.specialize({

    willPositionOverlay: {
        value: function (overlay, calculatedPosition) {
            var anchor = overlay.anchor,
                width = overlay.element.offsetWidth,
                anchorPosition = anchor.getBoundingClientRect(),
                anchorHeight = anchor.offsetHeight || 0,
                anchorWidth = anchor.offsetWidth || 0,
                position;

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
        value: function (overlay, target) {
            return !this._tableBodyTopElement.contains(target) && !this._rowRepetitionComponent.element.contains(target);
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
            this.hideNewEntryRow();
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
                        this._rowCandidate = candidate;

                        if (this.rowControlsOverlay.anchor === this._tableBodyTopElement) {
                            this.callDelegateMethod("tableWillDismissControlOverlay", this, this.currentRow, this.currentObject);

                            this.isNewEntryRowShown = false;
                        }

                        this._shouldDisplayControlsOverlay = true;
                        this.needsDraw = true;
                    }
                } else if (this._tableBodyTopElement.contains(target)) {
                    this.showNewEntryRow();
                } 
            }             
        }
    },

    hideNewEntryRow: {
        value: function () {
            this.callDelegateMethod("tableWillDismissControlOverlay", this, this.currentRow, this.currentObject);
            this._shouldHideNewEntry = true;
            this.isNewEntryRowShown = false;
            this.needsDraw = true;
        }
    },

    showNewEntryRow: {
        value: function () {
            this.callDelegateMethod("tableWillShowControlOverlay", this, this.currentRow, this.currentObject);

            this.isNewEntryRowShown = true;
            this._shouldShowNewEntry = true;
            this.needsDraw = true;
        }
    },

    draw: {
        value: function () {
            if (this._shouldShowNewEntry) {
                this.rowControlsOverlay.anchor = this._tableBodyTopElement;
                this.currentRow = this._tableBodyTopElement;
                this.rowControlsOverlay.show();
                this._shouldShowNewEntry = false;

            } else if (this._shouldHideNewEntry) {
                this.rowControlsOverlay.hide();
                this._shouldHideNewEntry = false;

            } else if (this._shouldDisplayControlsOverlay && this._rowCandidate) {
                this._shouldDisplayControlsOverlay = false;
                this.rowControlsOverlay.anchor = this._rowCandidate;
                this.currentRow = this._rowCandidate;
                this.rowControlsOverlay.show();
            }
        }
    }

});
