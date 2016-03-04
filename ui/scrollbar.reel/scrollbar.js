var Component = require("montage/ui/component").Component;

exports.Scrollbar = Component.specialize({

    _type: {
        value: "vertical"
    },

    type: {
        get: function () {
            return this._type;
        },
        set: function (value) {
            value = value === "horizontal" ? "horizontal" : "vertical";

            if (this._type !== value) {
                if (value === "horizontal") {
                    this.classList.add("ScrollbarHorizontal");
                } else {
                    this.classList.remove("ScrollbarHorizontal");
                }
                this._type = value;
                this.needsDraw = true;
            }
        }
    },

    _animationTimeout: {
        value: null
    },

    _length: {
        value: 1
    },

    length: {
        get: function () {
            return this._length;
        },
        set: function (value) {
            if (this._length !== value) {
                this._length = value;
                this.needsDraw = true;
            }
        }
    },

    offset: {
        value: 0
    },

    _handleLength: {
        value: 1
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

    handleResize: {
        value: function () {
            this.needsDraw = true;
        }
    },

    minHandlePixelSize: {
        value: 16
    },

    enterDocument: {
        value: function () {
            window.addEventListener("resize", this, false);
        }
    },

    exitDocument: {
        value: function () {
            window.removeEventListener("resize", this, false);
        }
    },

    willDraw: {
        value: function () {
            this._width = this._element.offsetWidth;
            this._height = this._element.offsetHeight;
            if (this.type === "horizontal") {
                this.handle.type = "horizontal";
                this.handle.maxDragX = this._length - this._handleLength;
                this.handle.dragXMultiplier = this._length / (this._width - this.minHandlePixelSize);
            } else {
                this.handle.type = "vertical";
                this.handle.maxDragY = this._length - this._handleLength;
                this.handle.dragYMultiplier = this._length / (this._height - this.minHandlePixelSize);
            }
        }
    },

    draw: {
        value: function () {
            if (this._length <= this._handleLength) {
                this.handle._element.style.opacity = 0;
            } else {
                this.handle._element.style.opacity = 1;
                if (this._type === "horizontal") {
                    var handlePixelWidth = this.minHandlePixelSize + Math.floor((this._width - this.minHandlePixelSize) * this._handleLength / this._length);

                    if (handlePixelWidth > this._width) {
                        handlePixelWidth = this._width;
                    }
                    this.handle._element.style.width = handlePixelWidth + "px";
                } else {
                    var handlePixelHeight = this.minHandlePixelSize + Math.floor((this._height - this.minHandlePixelSize) * this._handleLength / this._length);

                    if (handlePixelHeight > this._height) {
                        handlePixelHeight = this._height;
                    }
                    this.handle._element.style.height = handlePixelHeight + "px";
                }
            }
        }
    }

});
