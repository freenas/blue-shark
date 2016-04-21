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
            {"value": "Sun"},
            {"value": "Mon"},
            {"value": "Tues"},
            {"value": "Wed"},
            {"value": "Thurs"},
            {"value": "Fri"},
            {"value": "Sat"}
        ]
    }
});
