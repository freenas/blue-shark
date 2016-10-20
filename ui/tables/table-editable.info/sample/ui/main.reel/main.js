/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    emptyObject: {
        value: {}
    },

    prepareForActivationEvents: {
        value: function () {
            this.addEventListener("action", this);
        }
    },

    handleAddButtonAction: {
        value: function () {
            this.editableTable.showNewEntryRow();
        }
    },

    tableWillDismissControlOverlay: {
        value: function () {
            this.emptyObject = {};
        }
    }

});
