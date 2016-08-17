var Component = require("montage/ui/component").Component,
    TranslateComposer = require("montage/composer/translate-composer").TranslateComposer;


var Scrollview = exports.Scrollview = Component.specialize({

    templateDidLoad: {
        value: function () {
            if (this._scrollbarsSize === null) {
                this._scrollbarsSize = 8;
            }
        }
    },

    _hasHorizontalScrollbar: {
        value: false
    },

    _hasVerticalScrollbar: {
        value: false
    },

    _overflow: {
        value: "scroll"
    },

    _needsUpdateScrollbars: {
        value: false
    },

    overflow: {
        get: function () {
            return this._overflow;
        },
        set: function (value) {
            if (this._overflow !== value) {
                this._overflow = value;

                switch (value) {
                    case "scrollX":
                        this._hasHorizontalScrollbar = true;
                        this._hasVerticalScrollbar = false;
                        this._translateComposer.axis = "horizontal";
                        break;
                    case "scrollY":
                        this._translateComposer.axis = "vertical";
                        this._hasHorizontalScrollbar = false;
                        this._hasVerticalScrollbar = true;
                        break;
                    case "hidden":
                        this._hasHorizontalScrollbar = false;
                        this._hasVerticalScrollbar = false;
                        break;
                    default:
                        if (this._overflow !== "scroll") {
                            this._overflow = "scroll";
                        }

                        this._translateComposer.axis = "both";
                        this._hasHorizontalScrollbar = true;
                        this._hasVerticalScrollbar = true;
                        break;
                 }

                this._needsUpdateScrollbars = true;
                this.needsDraw = true;
            }
        }
    },

    _scrollbarsSize: {
        value: null
    },

    scrollbarsSize: {
        get: function () {
            return this._scrollbarsSize;
        },
        set: function (value) {
            if (this._scrollbarsSize !== value) {
                this.horizontalScrollbar.minHandlePixelSize = this.verticalScrollbar.minHandlePixelSize = this._scrollbarsSize = value;

                this._needsUpdateScrollbars = true;
                this.needsDraw = true;
            }
        }
    },

    _needsUpdateScroll: {
        value: true
    },

    _scrollTop: {
        value: 0
    },

    scrollTop: {
        get: function () {
            return this._scrollTop;
        },
        set: function (value) {
            value = Math.max(0, value | 0);

            if (value > this._maxTranslateY) {
                value = this._maxTranslateY;
            }

            if (this._scrollTop !== value) {
                this._translateComposer.translateY = this._scrollTop = value;
                this._needsUpdateScroll = true;
                this.needsDraw = true;
            }
        }
    },

    _scrollLeft: {
        value: 0
    },

    scrollLeft: {
        get: function () {
            return this._scrollLeft;
        },
        set: function (value) {
            value = Math.max(0, value | 0);
            if (value > this._maxTranslateX) {
                value = this._maxTranslateX;
            }
            if (this._scrollLeft !== value) {
                this._translateComposer.translateX = this._scrollLeft = value;
                this._needsUpdateScroll = true;
                this.needsDraw = true;
            }
        }
    },


    __translateComposer: {
        value: null
    },


    _translateComposer: {
        get: function () {
            if (!this.__translateComposer) {
                this.__translateComposer = new TranslateComposer();
                this.__translateComposer.listenToWheelEvent = true;
                this.__translateComposer.minTranslateX = 0;
                this.__translateComposer.minTranslateY = 0;
                this.__translateComposer.invertAxis = true;
            }

            return this.__translateComposer;
        }
    },


    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                if (!this.constructor.transform) {
                    if("webkitTransform" in this.element.style) {
                        this.constructor.transform = "webkitTransform";
                    } else if("MozTransform" in this.element.style) {
                        this.constructor.transform = "MozTransform";
                    } else if("msTransform" in this.element.style) {
                        this.constructor.transform = "msTransform";
                    } else if("OTransform" in this.element.style) {
                        this.constructor.transform = "OTransform";
                    } else {
                        this.constructor.transform = "transform";
                    }
                }

                this._mutationObserver = new MutationObserver(this.handleMutations.bind(this));
            }

            this._addEventListenerIfNeeded();
            window.addEventListener("resize", this, false);

            this._mutationObserver.observe(this.contentElement, {
                subtree: true,
                childList: true,
                attributes: true
            });
        }
    },


    prepareForActivationEvents: {
        value: function () {
            this.addComposerForElement(this.__translateComposer, this.element);
            this._addEventListenerIfNeeded(true);
        }
    },


    exitDocument: {
        value: function () {
            window.removeEventListener("resize", this, false);
            this._removeEventListenersIfNeeded();
            this._mutationObserver.disconnect();
        }
    },


    _addEventListenerIfNeeded: {
        value: function (force) {
            if (this.preparedForActivationEvents || force) {
                this._translateComposer.addEventListener("translate", this, false);
                this.contentElement.addEventListener("transitionend", this, false);
                this.contentElement.addEventListener(
                    typeof WebKitAnimationEvent !== "undefined" ? "webkitAnimationEnd" : "animationend", this, false
                );
            }
        }
    },


    _removeEventListenersIfNeeded: {
        value: function () {
            if (this.preparedForActivationEvents) {
                this._translateComposer.removeEventListener("translate", this, false);
                this.contentElement.removeEventListener("transitionend", this, false);
                this.contentElement.removeEventListener(
                    typeof WebKitAnimationEvent !== "undefined" ? "webkitAnimationEnd" : "animationend", this, false
                );
            }
        }
    },


    scrollIntoView: {
        value: function (alignWithTop) {
            alignWithTop = typeof alignWithTop !== "undefined" ? !!alignWithTop : true;

            if (this.overflow === "scrollX" || this.overflow === "scrollY") {
                this._needsAlignWithTop = alignWithTop;
                this._setScrolling();
            }
        }
    },


    handleTransitionend: {
        value: function (event) {
            var target = event.target;

            if (event.target !== this.element || target !== this.contentWrapperElement) {
                this.needsDraw = true;
            }
        }
    },


    handleMutations: {
        value: function (mutations) {
            if (!this.scrollTimeout) {
                var needsDraw = this.callDelegateMethod("shouldScrollViewComputeBoundaries", this, true, mutations);

                if (needsDraw === void 0 || needsDraw) {
                    this.needsDraw = true;
                }
            }
        }
    },


    handleResize: {
        value: function () {
            this.needsDraw = true;
        }
    },

    handleTranslate: {
        value: function (event) {
            if (event.pointer !== null && event.pointer !== this._translateComposer._MOUSE_POINTER) {
                var previousScrollLeft = this.scrollLeft,
                    previousScrollTop = this.scrollTop;

                if (this.overflow !== "scrollX") {
                    this.scrollTop = event.translateY;
                }

                if (this.overflow !== "scrollY") {
                    this.scrollLeft = event.translateX;
                }

                if (this.scrollLeft !== previousScrollLeft || this.scrollTop !== previousScrollTop) {
                    this._setScrolling();
                    event.stopImmediatePropagation();
                }
            }
        }
    },

    _setScrolling: {
        value: function () {
            var self = this;
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
                delete this.scrollTimeout;
            }
            self.classList.add('is-scrolling');
            this.scrollTimeout = setTimeout(function () {
                self.classList.remove('is-scrolling');
            }, 250);
        }
    },


    __maxTranslateX: {
        value: 0
    },


    _maxTranslateX: {
        set: function (value) {
            this._translateComposer._maxTranslateX = this.__maxTranslateX = value;
        },
        get: function () {
            return this.__maxTranslateX;
        }
    },


    __maxTranslateY: {
        value: 0
    },


    _maxTranslateY: {
        set: function (value) {
            this._translateComposer._maxTranslateY = this.__maxTranslateY = value;
        },
        get: function () {
            return this.__maxTranslateY;
        }
    },

    __visibleWidth: {
        value: 0
    },

    _visibleWidth: {
        set: function (visibleWidth) {
            if (this.horizontalScrollbar && this.__visibleWidth !== visibleWidth) {
                this.horizontalScrollbar.handleLength = this.__visibleWidth = visibleWidth;
            }
        },
        get: function () {
            return this.__visibleWidth;
        }
    },

    __visibleHeight: {
        value: 0
    },

    _visibleHeight: {
        set: function (visibleHeight) {
            if (this.verticalScrollbar && this.__visibleHeight !== visibleHeight) {
                this.verticalScrollbar.handleLength = this.__visibleHeight = visibleHeight;
            }
        },
        get: function () {
            return this.__visibleHeight;
        }
    },

    __contentWidth: {
        value: 0
    },

    _contentWidth: {
        set: function (contentWidth) {
            if (this.horizontalScrollbar && this.__contentWidth !== contentWidth) {
                this.horizontalScrollbar.length = this.__contentWidth = contentWidth;
            }
        },
        get: function () {
            return this.__contentWidth;
        }
    },

    __contentHeight: {
        value: 0
    },

    _contentHeight: {
        set: function (contentHeight) {
            if (this.verticalScrollbar && this.__contentHeight !== contentHeight) {
                this.verticalScrollbar.length = this.__contentHeight = contentHeight;
            }
        },
        get: function () {
            return this.__contentHeight;
        }
    },

    _scrollbarPadding: {
        value: 2
    },

    _footerComponent: {
        value: null
    },

    _getFooter: {
        value: function () {
            var self = this,
                footerElement;

            if (this.footerWrapperElement.children.length) {
                footerElement = this.footerWrapperElement.children[0];

            } else if (this.contentElement.children.length > 1) {
                footerElement = this.contentElement.children[this.contentElement.children.length - 1];
            }

            if (footerElement) {
                if (!this._footerComponent) {
                    this._footerComponent = footerElement.component;
                    if (this._footerComponent && !this._footerComponent.__oldWillDraw) {
                        this._footerComponent.__oldWillDraw = this._footerComponent.willDraw;
                        this._footerComponent.willDraw = function () {
                            if (this.__oldWillDraw) this.__oldWillDraw();
                            self._needsUpdateScrollbars = true;
                            self.needsDraw = true;
                        }
                    }
                }
            }

            return footerElement;
        }
    },

    willDraw: {
        value: function () {
            var content = this.contentElement,
                wrapper = this.contentWrapperElement;

            if (this._hasVerticalScrollbar) {
                this._visibleHeight = wrapper.offsetHeight;
                this._contentHeight = content.offsetHeight;
            }

            if (this._hasHorizontalScrollbar) {
                this._visibleWidth = wrapper.offsetWidth;
                this._contentWidth = content.offsetWidth;
            }
        }
    },


    draw: {
        value: function () {
            var footer = this._getFooter();

            if (footer) {
                if (this._contentHeight > this._visibleHeight) {
                    if (footer.parentNode !== this.footerWrapperElement) {
                        this.footerWrapperElement.appendChild(footer);
                        this.spacerElement.style.bottom = footer.offsetHeight + "px";
                    }
                } else if (footer.parentNode === this.footerWrapperElement) {
                    this.contentElement.appendChild(footer);
                    this.spacerElement.style.bottom = "0";
                }
            }

            this._maxTranslateX = Math.max(0, this._contentWidth - this._visibleWidth);
            this._maxTranslateY = Math.max(0, this._contentHeight - this._visibleHeight);

            if (this._needsAlignWithTop === true || this._needsAlignWithTop === false) {
                if (this.overflow === "scrollX") {
                    this.scrollLeft = this._needsAlignWithTop ? 0 : this._maxTranslateX;

                } else if (this.overflow === "scrollY") {
                    this.scrollTop = this._needsAlignWithTop ? 0 : this._maxTranslateY;
                }

                this._needsAlignWithTop = null;
            }

            if (this.scrollLeft > this._maxTranslateX) {
                this.scrollLeft = this._maxTranslateX;
            }

            if (this.scrollTop > this._maxTranslateY) {
                this.scrollTop = this._maxTranslateY;
            }

            if (this._needsUpdateScrollbars) {
                var verticalScrollBarElementStyle = this.verticalScrollbar.element.style,
                    horizontalScrollBarElementStyle = this.horizontalScrollbar.element.style;

                if (this._hasVerticalScrollbar) {
                    verticalScrollBarElementStyle.width = this._scrollbarsSize + "px";
                    verticalScrollBarElementStyle.bottom = (this._hasHorizontalScrollbar ?
                        this._scrollbarsSize + this._scrollbarPadding : this._scrollbarPadding) + "px";

                    verticalScrollBarElementStyle.display = "block";
                    this.verticalScrollbar.needsDraw = true;
                } else {
                    verticalScrollBarElementStyle.display = "none";
                }

                if (this._hasHorizontalScrollbar) {
                    horizontalScrollBarElementStyle.height = this._scrollbarsSize + "px";
                    horizontalScrollBarElementStyle.right = (this._hasVerticalScrollbar ?
                        this._scrollbarsSize + this._scrollbarPadding : this._scrollbarPadding) + "px";

                    horizontalScrollBarElementStyle.display = "block";
                    this.horizontalScrollbar.needsDraw = true;
                } else {
                    horizontalScrollBarElementStyle.display = "none";
                }

                this._needsUpdateScrollbars = false;
                this.needsDraw = true;
            } else {
                if (this._needsUpdateScroll) {
                    this.contentElement.style[Scrollview.transform] = "translate3d(" + (-this._scrollLeft) + "px," +
                        (-this._scrollTop) + "px,0)";

                    this._needsUpdateScroll = false;
                }
            }
        }
    }

});

Scrollview.prototype.handleWebkitAnimationEnd = Scrollview.prototype.handleAnimationend;
