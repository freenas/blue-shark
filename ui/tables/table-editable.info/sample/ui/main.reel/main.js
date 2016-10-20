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

    tableWillCancelEditingRow: {
        value: function (table, editingObject, row) {
            console.log("table cancel editing: ", editingObject)
        }
    },

    tableWillEndEditingRow: {
        value: function (table, editingObject, row) {
            console.log("table end editing: ", editingObject)
        }
    },

    tableWillStartEditingRow: {
        value: function (table, editingObject, row) {
            console.log("table start editing: ", editingObject)
        }
    }

});
