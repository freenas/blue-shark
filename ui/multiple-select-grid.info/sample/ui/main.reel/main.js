/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    numberContent: {
        get: function () {
            var result = [];
            for (var i = 0; i < 60; i++) {
                result.push({"value": Number(i, 10)});
            }
            return result;
        }
    },
    daysContent: {
        value: [
            {"index": 1, "label": "M", "value": "monday"},
            {"index": 0, "label": "S", "value": "sunday"},
            {"index": 2, "label": "T", "value": "tuesday"},
            {"index": 3, "label": "W", "value": "wednesday"},
            {"index": 4, "label": "Th", "value": "thursday"},
            {"index": 5, "label": "F", "value": "friday"},
            {"index": 6, "label": "S", "value": "saturday"}
        ]
    },

    selection: {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.selectedValues = [this.daysContent[2], this.daysContent[4]];
            }
        }
    }
});
