/**
 * @module ui/search-multiple.reel
 */
var Search = require("../search.reel").Search;

/**
 * @class SearchMultiple
 * @extends Component
 */
exports.SearchMultiple = Search.specialize(/** @lends SearchMultiple# */ {
    controller: {
        value: null
    },

    handleAction: {
        value: function (event) {
            var target = event.target;

            if (target === this._searchButton || target === this._searchInput) {
                this._search(this._searchInput.value);
            } else if (target === this._addButton) {
                this.switchValue = 'write';
                this._searchInput.focus();

            } else if (target === this._cancelButton || target === this._validButton || target === this._noneButton) {
                if (target === this._validButton) {
                    this.values = _.concat(this.values || [], this._selectComponent.selectedValues);
                }

                if (target === this._noneButton) {
                    this.value = null;
                }

                this._resetState();
            }
        }
    }

});
