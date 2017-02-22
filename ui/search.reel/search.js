/**
 * @module ui/search.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Search
 * @extends Component
 */
exports.Search = Component.specialize(/** @lends Search# */ {

    handleAction: {
        value: function (event) {
            var target = event.target;

            if (target === this._searchButton || target === this._searchInput) {
                this._search(this._searchInput.value);
            }
        }
    },

    controller: {
        value: null
    },

    _search: {
        value: function (value) {
            if (!this.controller || typeof this.controller.search !== 'function') {
                throw new Error('Search component needs a controller that implements an `search` method.');
            }

            if (typeof value === 'string' && value.length > 2) {
                var response = this.controller.search(value);
                this.isSearching = true;

                if (Promise.is(response)) {
                    var self = this;

                    response.then(function (results) {
                        self._results = results
                    }).finally(function () {
                        self.isSearching = false;
                    });
                } else {
                    this._results = response;
                    this.isSearching = false;
                }
            }
        }
    }

});
