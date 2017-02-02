/**
 * @module ui/panel.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Panel
 * @extends Component
 */
exports.Panel = Component.specialize(/** @lends Panel# */ {
    constructor: {
        value: function Panel() {
            this.super();
        }
    }
});
