/**
 * @module ui/select-options.reel
 */
var Overlay = require("montage/ui/overlay.reel").Overlay,
    KeyComposer = require("montage/composer/key-composer").KeyComposer,
    Composer = require("montage/composer/composer").Composer;

/**
 * @class SelectOptions
 * @extends Overlay
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

    _needsComputeBoundaries: {
        value: false
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

                var keyIdentifiers = this.constructor.KEY_IDENTIFIERS;

                this._keyComposerMap = new Map();

                this._keyComposerMap.set(
                    keyIdentifiers.escape,
                    KeyComposer.createKey(this, keyIdentifiers.escape, keyIdentifiers.escape)
                );
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
                this._keyComposerMap.get(this.constructor.KEY_IDENTIFIERS.escape).addEventListener("keyPress", this);
                this.element.ownerDocument.defaultView.addEventListener("wheel", this, true);
                this._saveInitialCenterPosition();
                this._needsComputeBoundaries = true;
            }

            Overlay.prototype.show.call(this);
        }
    },

    hide: {
        value: function () {
            if (this.isShown) {
                this._keyComposerMap.get(this.constructor.KEY_IDENTIFIERS.escape).removeEventListener("keyPress", this);
                this.element.ownerDocument.defaultView.removeEventListener("wheel", this, true);
            }

            Overlay.prototype.hide.call(this);
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
                    var deltaX = Math.abs(this._initialCenterPositionX - newCenterPositionX),
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

            if (this.isShown) {
                var optionsRepetitionBoundingClientRect = this.optionsRepetition.element.getBoundingClientRect();

                this._optionsHeight = optionsRepetitionBoundingClientRect.height;
                this._anchorWidth = this.anchor.getBoundingClientRect().width;

                if (!this._needsComputeBoundaries) {
                    var documentHeight = this.element.ownerDocument.documentElement.clientHeight;

                    if (optionsRepetitionBoundingClientRect.top + this._optionsHeight > documentHeight) {
                        this.classList.add("is-outside-document");
                    } else {
                        this.classList.remove("is-outside-document");
                    }
                }
            }
        }
    },

    //@override super draw overlay method.
    draw: {
        value: function () {
            var overlayElementStyle = this.element.style;

            if (this.isShown) {
                var position = this._drawPosition;

                overlayElementStyle.top = position.top + "px";
                overlayElementStyle.left = position.left + "px";

                // set options Height
                if (this._optionsHeight < this._optionsMaxHeight) {
                    overlayElementStyle.height = this._optionsHeight + "px";
                } else {
                    overlayElementStyle.height = this._optionsMaxHeight + "px";
                }

                // set options width
                overlayElementStyle.width = this._anchorWidth + "px";

                if (this._needsComputeBoundaries) {
                    this.scrollView.element.style.visibility = overlayElementStyle.visibility =
                        this.constructor.STYLE_VISIBILITY.hidden;

                    this._needsComputeBoundaries = false;
                    this.needsDraw = true;

                } else {
                    this.scrollView.element.style.visibility = overlayElementStyle.visibility =
                        this.constructor.STYLE_VISIBILITY.visible;
                }
            } else {
                this.scrollView.element.style.visibility = overlayElementStyle.visibility =
                    this.constructor.STYLE_VISIBILITY.hidden;
            }
        }
    }

}, {

    STYLE_VISIBILITY: {
        value: {
            hidden: "hidden",
            visible: "visible"
        }
    },

    KEY_IDENTIFIERS: {
        value: {
            escape: "escape"
        }
    }

});


SelectOptions.prototype.handleEscapeKeyPress = SelectOptions.prototype.hide;
SelectOptions.prototype.handleSelectedValueChange = SelectOptions.prototype.hide;
SelectOptions.prototype.handleResize = SelectOptions.prototype.hide;
