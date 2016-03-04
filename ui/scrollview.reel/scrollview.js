var Component = require("montage/ui/component").Component;

var Scrollview = exports.Scrollview = Component.specialize({

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
                if (this.application && this.application.contextualMenu) {
                    this.application.contextualMenu.hide();
                }
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
                if (this.application && this.application.contextualMenu) {
                    this.application.contextualMenu.hide();
                }
            }
        }
    },

    enterDocument: {
        value: function () {
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

            window.addEventListener("resize", this, false);
            this._element.addEventListener("wheel", this, false);
        }
    },

    exitDocument: {
        value: function () {
            window.removeEventListener("resize", this, false);
            this._element.removeEventListener("wheel", this, false);
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
            event.preventDefault();
            if (this.scrollLeft !== previousScrollLeft || this.scrollTop !== previousScrollTop) {
                event.stopPropagation();
            }
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
        value: 4
    },

    willDraw: {
        value: function () {
            if (!this._needsUpdateScrollbars) {
                var content = this.contentElement,
                    wrapper = this.contentWrapperElement;

                this._contentWidth = content.offsetWidth;
                this._contentHeight = content.offsetHeight;
                this._visibleWidth = wrapper.offsetWidth;
                this._visibleHeight = wrapper.offsetHeight;
            }
        }
    },

    _needsDeferredDraw: {
        value: 0
    },

    needsDeferredDraw: {
        set: function (value) {
            if (value) {
                // FIXME: 5 is a magical number of redraws,
                // we should listen to content changes in a better way
                this._needsDeferredDraw = 5;
                this.needsDraw = true;
            }
        }
    },

    drawAfterDelay: {
        value: function (miliseconds) {
            var self = this;

            if (!miliseconds) {
                miliseconds = 450;
            }
            setTimeout(function () {
                self.needsDraw = true;
            }, miliseconds);
        }
    },

    draw: {
        value: function () {
            if (this._needsDeferredDraw) {
                this.needsDraw = true;
                this._needsDeferredDraw--;
            } else {
                this._maxScrollLeft = Math.max(0, this._contentWidth - this._visibleWidth);
                this._maxScrollTop = Math.max(0, this._contentHeight - this._visibleHeight);
                if (this.scrollLeft > this._maxScrollLeft) {
                    this.scrollLeft = this._maxScrollLeft;
                }
                if (this.scrollTop > this._maxScrollTop) {
                    this.scrollTop = this._maxScrollTop;
                }
                if (this._needsUpdateScrollbars) {
                    if (this._hasVerticalScrollbar) {
                        this.contentWrapperElement.style.right = this._scrollbarsSize + this._scrollbarPadding + "px";
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
                        this.contentWrapperElement.style.bottom = this._scrollbarsSize + this._scrollbarPadding + "px";
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
    }

});
