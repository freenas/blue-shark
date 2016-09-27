/**
 * @module ui/select-filter.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class SelectFilter
 * @extends Component
 */
exports.SelectFilter = Component.specialize(/** @lends SelectFilter# */ {

    areFiltersVisible: {
        value: false
    },

    handleDisplayAllButtonAction: {
        value: function () {
            this.items.iterations.forEach(function(filter){
                filter.object.checked = true;
            });
        }
    },

    handleFilterButtonAction: {
        value: function () {
            this.areFiltersVisible = !this.areFiltersVisible;
        }
    }
});
