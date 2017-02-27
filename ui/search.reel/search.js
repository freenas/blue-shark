/**
 * @module ui/search.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Search
 * @extends Component
 */
exports.Search = Component.specialize(/** @lends Search# */ {

    enterDocument: {
        value: function (firstTime) {
            if (!this.controller || typeof this.controller.search !== 'function') {
                throw new Error('Search component needs a controller that implements an `search` method.');
            }

            if (!this.controller && typeof this.controller.listDefaultOptions !== 'function') {
                this._handleSearchAction(this.controller.listDefaultOptions(), true);
            }

            if (firstTime) {
                this.addPathChangeListener('_searchInput.value', this, 'handleSearchValueChange');
            }
        }
    },

    handleSearchValueChange: {
        value: function (value) {
            if (!value && this._inDocument && this._initialResults) {
                this._results = this._initialResults;
            }
        }
    },

    handleAction: {
        value: function (event) {
            var target = event.target;

            if (target === this._searchButton || target === this._searchInput) {
                this._search(this._searchInput.value);
            } else if (target === this._changeButton) {
                this.switchValue = 'write';
                this._searchInput.focus();

            } else if (target === this._cancelButton || target === this._validButton || target === this._noneButton) {
                if (target === this._validButton) {
                    this.value = this._selectComponent.selectedValues[0];
                }

                if (target === this._noneButton) {
                    this.value = null;
                }

                this._searchInput.value = this._results = null;
                this.isSearching = false;
                this.switchValue = 'read';
            }
        }
    },

    controller: {
        value: null
    },

    _search: {
        value: function (value) {
            if (typeof value === 'string' && value.length) {
                this._handleSearchAction(this.controller.search(value));
            }
        }
    },

    _handleSearchAction: {
        value: function (searchAction, initial) {
            this.isSearching = true;

            if (Promise.is(searchAction)) {
                var self = this;

                searchAction.then(function (results) {
                    if (self._inDocument) {
                        self._results = results;

                        if (initial) {
                            self._initialResults = results;
                        }
                    }
                }).finally(function () {
                    self.isSearching = false;
                });
            } else {
                this._results = searchAction;
                this.isSearching = false;
            }
        }
    }

});
