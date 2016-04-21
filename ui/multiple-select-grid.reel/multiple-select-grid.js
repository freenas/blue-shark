/**
 * @module ui/multiple-select-grid.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class MultipleSelectGrid
 * @extends Component
 */
exports.MultipleSelectGrid = Component.specialize(/** @lends MultipleSelectGrid# */ {
    templateDidLoad: {
        value: function () {
            this.controller.multiSelect = true;
            this.controller.addRangeAtPathChangeListener(
                "selection", this, "handleSelectionChange");
        }
    },

    handleOptionsControllerAction: {
        value: function () {
            console.log("action");
        }
    },

    handleSelectionChange: {
        value: function (object) {
            console.log("fired")
            // if(this.controller.content.indexOf(object) === -1) {
            //     console.log(true);
            // } else {
            //     console.log(false);
            // }
        }
    }
});
