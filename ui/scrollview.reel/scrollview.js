var Component = require("montage/ui/component").Component;

var Scrollview = exports.Scrollview = Component.specialize({

    selectedObject: {
        get: function() {
            return this.parentComponent.selectedObject;
        },
        set: function(selectedObject) {
            if (this.parentComponent.selectedObject != selectedObject) {
                this.parentComponent.selectedObject = selectedObject
            }
        }
    },

    _hasHorizontalScrollbar: {
        value: true
    },

    _hasVerticalScrollbar: {
        value: true
    },

    _overflow: {
        value: "scroll"
    },

    _needsUpdateScrollbars: {
        value: true
    },

    overflow: {
        get: function () {
            return this._overflow;
        },
        set: function (value) {
            if (this._overflow !== value) {
                 switch (value) {
                    case "scrollX":
                        this._overflow = "scrollX";
                        this._hasHorizontalScrollbar = true;
                        this._hasVerticalScrollbar = false;
                        this._needsUpdateScrollbars = true;
                        this.needsDraw = true;
                        break;
                    case "scrollY":
                        this._overflow = "scrollY";
                        this._hasHorizontalScrollbar = false;
                        this._hasVerticalScrollbar = true;
                        this._needsUpdateScrollbars = true;
                        this.needsDraw = true;
                        break;
                    case "hidden":
                        this._overflow = "hidden";
                        this._hasHorizontalScrollbar = false;
                        this._hasVerticalScrollbar = false;
                        this._needsUpdateScrollbars = true;
                        this.needsDraw = true;
                        break;
                    default:
                        if (this._overflow !== "scroll") {
                            this._overflow = "scroll";
                            this._hasHorizontalScrollbar = true;
                            this._hasVerticalScrollbar = true;
                            this._needsUpdateScrollbars = true;
                            this.needsDraw = true;
                        }
                        break;
                 }
            }
        }
    },

    _scrollbarsSize: {
        value: 8
    },

    scrollbarsSize: {
        get: function () {
            return this._scrollbarsSize;
        },
        set: function (value) {
            if (this._scrollbarsSize !== value) {
                this._scrollbarsSize = value;
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

            if (value > this._maxScrollTop) {
                value = this._maxScrollTop;
            }

            if (this._scrollTop !== value) {
                this._scrollTop = value;
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
            if (value > this._maxScrollLeft) {
                value = this._maxScrollLeft;
            }
            if (this._scrollLeft !== value) {
                this._scrollLeft = value;
                this._needsUpdateScroll = true;
                this.needsDraw = true;
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                if (!Scrollview.transform) {
                    if("webkitTransform" in this.element.style) {
                        Scrollview.transform = "webkitTransform";
                    } else if("MozTransform" in this.element.style) {
                        Scrollview.transform = "MozTransform";
                    } else if("msTransform" in this.element.style) {
                        Scrollview.transform = "msTransform";
                    } else if("OTransform" in this.element.style) {
                        Scrollview.transform = "OTransform";
                    } else {
                        Scrollview.transform = "transform";
                    }
                }

                this._mutationObserver = new MutationObserver(this.handleMutations.bind(this));
            }

            this._getFooter();
            window.addEventListener("resize", this, false);
            this._element.addEventListener("wheel", this, false);
            this._element.addEventListener("transitionend", this, false);

            if (typeof WebKitAnimationEvent !== "undefined") {
                this._element.addEventListener("webkitAnimationEnd", this, false);
            } else {
                this._element.addEventListener("animationend", this, false);
            }

            this._mutationObserver.observe(this.element, {
                subtree: true,
                childList: true
            });
        }
    },

    exitDocument: {
        value: function () {
            window.removeEventListener("resize", this, false);
            this._element.removeEventListener("wheel", this, false);
            this._element.removeEventListener("transitionend", this, false);

            if (typeof WebKitAnimationEvent !== "undefined") {
                this._element.removeEventListener("webkitAnimationEnd", this, false);
            } else {
                this._element.removeEventListener("animationend", this, false);
            }

            this._mutationObserver.disconnect();
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
        value: function (event) {
            this.needsDraw = true;
        }
    },

    handleResize: {
        value: function () {
            this.needsDraw = true;
        }
    },

    handleWheel: {
        value: function (event) {
            var previousScrollLeft = this.scrollLeft,
                previousScrollTop = this.scrollTop;

            this.scrollLeft += event.deltaX;
            this.scrollTop += event.deltaY;

            if (this.scrollLeft !== previousScrollLeft || this.scrollTop !== previousScrollTop) {
                this._setScrolling();
                event.stopImmediatePropagation();
                event.preventDefault();
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

    _maxScrollLeft: {
        value: 0
    },

    _maxScrollTop: {
        value: 0
    },

    _visibleWidth: {
        value: 0
    },

    _visibleHeight: {
        value: 0
    },

    _contentWidth: {
        value: 0
    },

    _contentHeight: {
        value: 0
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
            }
            if (this.contentElement.children.length > 1) {
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
                return footerElement;
            } else {
                return null;
            }
        }
    },

    willDraw: {
        value: function () {
            var content = this.contentElement,
                wrapper = this.contentWrapperElement;

            this._contentWidth = content.offsetWidth;
            this._contentHeight = content.offsetHeight;
            this._visibleWidth = wrapper.offsetWidth;
            this._visibleHeight = wrapper.offsetHeight;
        }
    },

    _drawAfterDelay: {
        value: function (miliseconds) {
            var self = this;

            if (!miliseconds) {
                miliseconds = 450;
            }

            if (this.__drawAfterDelayTiemout) {
                clearTimeout(this.__drawAfterDelayTiemout);
            }

            this.__drawAfterDelayTiemout = setTimeout(function () {
                self.needsDraw = true;
            }, miliseconds);
        }
    },

    handleLength: {
        get: function () {
            return this._handleLength;
        },
        set: function (value) {
            var self = this;

            if (this._handleLength !== value) {
                this._handleLength = value;
                this.classList.add("isAnimating");
                clearTimeout(this._animationTimeout);
                this._animationTimeout = setTimeout(function () {
                    self.classList.remove("isAnimating");
                }, 330);
                this.needsDraw = true;
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
                    }
                    this.spacerElement.style.bottom = footer.offsetHeight + "px";
                } else {
                    if (footer.parentNode === this.footerWrapperElement) {
                        this.contentElement.appendChild(footer);
                    }
                    this.spacerElement.style.bottom = "0";
                }
            }

            this._maxScrollLeft = Math.max(0, this._contentWidth - this._visibleWidth);
            this._maxScrollTop = Math.max(0, this._contentHeight - this._visibleHeight);

            if (this._needsAlignWithTop === true || this._needsAlignWithTop === false) {
                if (this.overflow === "scrollX") {
                    this.scrollLeft = this._needsAlignWithTop ? 0 : this._maxScrollLeft;

                } else if (this.overflow === "scrollY") {
                    this.scrollTop = this._needsAlignWithTop ? 0 : this._maxScrollTop;
                }

                this._needsAlignWithTop = null;
            }

            if (this.scrollLeft > this._maxScrollLeft) {
                this.scrollLeft = this._maxScrollLeft;
            }

            if (this.scrollTop > this._maxScrollTop) {
                this.scrollTop = this._maxScrollTop;
            }

            if (this._needsUpdateScrollbars) {
                if (this._hasVerticalScrollbar) {
                    // adds space for scrollbar
                    // this.contentWrapperElement.style.right = this._scrollbarsSize + this._scrollbarPadding + "px";
                    this.verticalScrollbar.element.style.width = this._scrollbarsSize + "px";
                    if (this._hasHorizontalScrollbar) {
                        this.verticalScrollbar.element.style.bottom = this._scrollbarsSize + this._scrollbarPadding + "px";
                    } else {
                        this.verticalScrollbar.element.style.bottom = this._scrollbarPadding + "px";
                    }
                    this.verticalScrollbar.element.style.display = "block";
                    this.verticalScrollbar.needsDraw = true;
                } else {
                    this.contentWrapperElement.style.right = "0";
                    this.verticalScrollbar.element.style.display = "none";
                }
                if (this._hasHorizontalScrollbar) {
                    // adds space for scrollbar
                    // this.contentWrapperElement.style.bottom = this._scrollbarsSize + this._scrollbarPadding + "px";
                    this.horizontalScrollbar.element.style.height = this._scrollbarsSize + "px";
                    if (this._hasVerticalScrollbar) {
                        this.horizontalScrollbar.element.style.right = this._scrollbarsSize + this._scrollbarPadding + "px";
                    } else {
                        this.horizontalScrollbar.element.style.right = this._scrollbarPadding + "px";
                    }
                    this.horizontalScrollbar.element.style.display = "block";
                    this.horizontalScrollbar.needsDraw = true;
                } else {
                    this.contentWrapperElement.style.bottom = "0";
                    this.horizontalScrollbar.element.style.display = "none";
                }
                this._needsUpdateScrollbars = false;
                this.needsDraw = true;
            } else {
                if (this._needsUpdateScroll) {
                    this.contentElement.style[Scrollview.transform] = "translate3d(" + (-this._scrollLeft) + "px," + (-this._scrollTop) + "px,0)";
                    this._needsUpdateScroll = false;
                }
            }
        }
    }

});

Scrollview.prototype.handleWebkitAnimationEnd = Scrollview.prototype.handleAnimationend;
