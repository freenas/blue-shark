/**
 * @module ui/select-options.reel
 */
var Overlay = require("montage/ui/overlay.reel").Overlay,
    Composer = require("montage/composer/composer").Composer;

/**
 * @class SelectOptions
 * @extends Overlay
 * @fixme: need to update the presscompoer in order to overpass the surrender rules.
 */
var SelectOptions = exports.SelectOptions = Overlay.specialize(/** @lends SelectOptions# */ {

    optionsRepetition: {
        value: null
    },

    _optionsHeight: {
        value: null
    },

    _optionsMaxHeight: {
        value: 144
    },

    optionsMaxHeight: {
        get: function () {
            return this._optionsMaxHeight;
        },
        set: function (value) {
            if (this._optionsMaxHeight !== value) {
                this._optionsMaxHeight = value;
                this.needsDraw = true;
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._mutationObserver = new MutationObserver(this.handleMutations.bind(this));
                this.addPathChangeListener("selectedValue", this, "handleSelectedValueChange");
            }

            this._mutationObserver.observe(this.element, {
                subtree: true,
                childList: true
            });

            //Need to be called after creating the _mutationObserver.
            Overlay.prototype.enterDocument.call(this, isFirstTime);
        }
    },

    exitDocument: {
        value: function () {
            Overlay.prototype.exitDocument.call(this);

            this._mutationObserver.disconnect();
        }
    },

    show: {
        value: function () {
            if (!this.isShown) {
                this.element.ownerDocument.defaultView.addEventListener("wheel", this, true);
                this._saveInitialCenterPosition();
            }

            Overlay.prototype.show.call(this);
        }
    },

    hide: {
        value: function () {
            if (this.isShown) {
                this.element.ownerDocument.defaultView.removeEventListener("wheel", this, true);
            }

            Overlay.prototype.hide.call(this);
        }
    },

    handleSelectedValueChange: {
        value: function () {
            this.hide();
        }
    },

    captureWheel: {
        value: function (event) {
            if (!this.element.contains(event.target) && this._isPositionChanged(event)) {
                this.hide();
            }
        }
    },

    handleMutations: {
        value: function () {
            if (this.isShown) {
                this.needsDraw = true;
            }
        }
    },

    handleResize: {
        value: function () {
            if (this.isShown) {
                this.hide();
            }
        }
    },

    _saveInitialCenterPosition: {
        value: function () {
            if (this.anchor instanceof HTMLElement) {
                var boundingClientRect = this.anchor.getBoundingClientRect();

                this._initialCenterPositionX = boundingClientRect.left + (boundingClientRect.width / 2);
                this._initialCenterPositionY = boundingClientRect.top + (boundingClientRect.height / 2);
            }
        }
    },

    _isPositionChanged: {
        value: function (event) {
            if (this.anchor instanceof HTMLElement) {
                var boundingClientRect = this.anchor.getBoundingClientRect(),
                    newCenterPositionX = boundingClientRect.left + (boundingClientRect.width / 2),
                    newCenterPositionY = boundingClientRect.top + (boundingClientRect.height / 2);

                if (this._initialCenterPositionX !== newCenterPositionX || this._initialCenterPositionY !== newCenterPositionY) {
                    var type = event.type,
                        deltaX = Math.abs(this._initialCenterPositionX - newCenterPositionX),
                        deltaY = Math.abs(this._initialCenterPositionY - newCenterPositionY),
                        radius = 1; // todo implement touchmove + pointermove

                    return Composer.isCoordinateOutsideRadius(deltaX, deltaY, radius);
                }
            }

            return false;
        }
    },

    //@todo fixme: in montage
    _getElementPosition: {
        value: function (element) {
            return element.getBoundingClientRect();
        }
    },

    willDraw: {
        value: function () {
            Overlay.prototype.willDraw.call(this);

            this._anchorWidth = this.anchor.getBoundingClientRect().width;
            this._optionsHeight = this.optionsRepetition.element.getBoundingClientRect().height;

            // Wait for the scrollview's placeholder to load the options' repetition.
            if (this.options && this.options.length > 0 && this._optionsHeight === 0) {
                this.needsDraw = true;
            }
        }
    },

    draw: {
        value: function () {
            Overlay.prototype.draw.call(this);

            // set options Height
            if (this._optionsHeight < this._optionsMaxHeight) {
                this.element.style.height = this._optionsHeight + "px";
            } else {
                this.element.style.height = this._optionsMaxHeight + "px";
            }

            // set options width
            this.element.style.width = this._anchorWidth + "px";
        }
    }

});
