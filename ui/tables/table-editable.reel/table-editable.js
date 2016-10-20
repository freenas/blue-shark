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

    prepareForActivationEvents: {
        value: function () {
            this._rowRepetitionComponent.element.addEventListener("mouseup", this, false);
        }
    },

    handleMouseup: {
        value: function (event) {
            var textRowCellRepetitionElement = this._rowRepetitionComponent.element,
                target = event.target,
                candidate;

            if (textRowCellRepetitionElement.contains(target)) {
                event.stopPropagation();
                
                while (textRowCellRepetitionElement !== target) {
                    candidate = target;
                    target = candidate.parentNode;
                }

                if (candidate) {
                    this._rowControlsOverlay.anchor = candidate;
                    this._rowControlsOverlay.show();
                } else {
                    //last one?
                }
            }            
        }
    }

});
