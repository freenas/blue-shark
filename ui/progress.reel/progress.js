/**
 * @module ui/progress.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Progress
 * @extends Component
 */
exports.Progress = Component.specialize(/** @lends Progress# */ {

    _percentageComplete: {
        value: null
    },

    percentageComplete: {
        set: function (value) {
            this._percentageComplete = value;
            this.needsDraw = true;
        },
        get: function () {
            return this._percentageComplete;
        }
    },

    draw: {
        value: function () {
            this.bar.style.width = this._percentageComplete + "%";
        }
    }
});
