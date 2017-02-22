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
            } else if (target === this._changeButton) {
                this.switchValue = 'write';

            } else if (target === this._cancelButton || target === this._validButton) {
                this._searchInput.value = this._results = null;
                this.isSearching = false;
                this.switchValue = 'read';

                if (target === this._validButton) {
                    this.selectedValue = this._selectComponent.selectedValues[0];
                }
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
                    this._searchPromise
                    var self = this;

                    response.then(function (results) {
                        if (self._inDocument) {
                            self._results = results;
                        }
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
