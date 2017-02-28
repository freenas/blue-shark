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
        value: {
            search: function () {
                return [{
                    label: 'foo',
                    value: 'foo'
                },
                {
                    label: 'bar',
                    value: 'bar'
                },
                {
                    label: 'qux',
                    value: 'qux'
                }]
            }
        }
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
                    var self = this,
                        selectedValues = this._selectComponent.selectedValues;

                    this.values = _.concat(this._values || [], _.difference(this._results,
                        _.differenceWith(this._results, selectedValues, function (option, value) {
                            return option.value === value;
                        })
                    ));
                }

                if (target === this._noneButton) {
                    this.value = null;
                }

                this._resetState();
            }
        }
    }

});
