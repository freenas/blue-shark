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
    }

});
