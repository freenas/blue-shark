var Component = require("montage/ui/component").Component;

exports.Draggable = Component.specialize({

    _type: {
        value: "both"
    },

    type: {
        get: function () {
            return this._type;
        },
        set: function (value) {
            switch (value) {
                case "horizontal":
                case "vertical":
                    break;
                default:
                    value = "both";
            }
            if (this._type !== value) {
                this._type = value;
            }
        }
    },

    hasTemplate: {
        value: false,
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this._element.addEventListener("mousedown", this, false);
            }
        }
    },

    _needsToDrag: {
        value: false
    },

    _isOwnUpdate: {
        value: false
    },

    _drag: {
        value: 0
    },

    drag: {
        get: function () {
            return this._drag;
        },
        set: function (value) {
            switch (this._type) {
                case "horizontal":
                    if (this._dragX !== value) {
                        this.dragX = value;
                    }
                    this._drag = this._dragX;
                    break;
                case "vertical":
                    if (this._dragY !== value) {
                        this.dragY = value;
                    }
                    this._drag = this._dragY;
                    break;
            }
        }
    },

    _dragX: {
        value: 0
    },

    dragX: {
        get: function () {
            return this._dragX;
        },
        set: function (value) {
            if (this._isOwnUpdate) {
                if (value < this._minDragX) {
                    value = this._minDragX;
                } else {
                    if (value > this._maxDragX) {
                        value = this._maxDragX;
                    }
                }
                this._isOwnUpdate = false;
            }
            if (this.isRounding) {
                value = Math.round(value);
            }
            if (this._dragX !== value) {
                this._dragX = value;
                this.drag = this._dragX;
                this._needsToDrag = true;
                this.needsDraw = true;
            }
        }
    },

    _dragXMultiplier: {
        value: 1
    },

    dragXMultiplier: {
        get: function () {
            return this._dragXMultiplier;
        },
        set: function (value) {
            if (this._dragXMultiplier !== value) {
                this._dragXMultiplier = value;
                this._needsToDrag = true;
                this.needsDraw = true;
            }
        }
    },

    _minDragX: {
        value: 0
    },

    minDragX: {
        get: function () {
            return this._minDragX;
        },
        set: function (value) {
            if (this._minDragX !== value) {
                this._minDragX = value;
            }
        }
    },

    _maxDragX: {
        value: 0
    },

    maxDragX: {
        get: function () {
            return this._maxDragX;
        },
        set: function (value) {
            if (this._maxDragX !== value) {
                this._maxDragX = value;
            }
        }
    },

    _dragY: {
        value: 0
    },

    dragY: {
        get: function () {
            return this._dragY;
        },
        set: function (value) {
            if (this._isOwnUpdate) {
                if (value < this._minDragY) {
                    value = this._minDragY;
                } else {
                    if (value > this._maxDragY) {
                        value = this._maxDragY;
                    }
                }
            } else {
                this._isOwnUpdate = false;
            }
            if (this.isRounding) {
                value = Math.round(value);
            }
            if (this._dragY !== value) {
                this._dragY = value;
                this.drag = this._dragY;
                this._needsToDrag = true;
                this.needsDraw = true;
            }
        }
    },

    _dragYMultiplier: {
        value: 1
    },

    dragYMultiplier: {
        get: function () {
            return this._dragYMultiplier;
        },
        set: function (value) {
            if (this._dragYMultiplier !== value) {
                this._dragYMultiplier = value;
                this._needsToDrag = true;
                this.needsDraw = true;
            }
        }
    },

    _minDragY: {
        value: 0
    },

    minDragY: {
        get: function () {
            return this._minDragY;
        },
        set: function (value) {
            if (this._minDragY !== value) {
                this._minDragY = value;
            }
        }
    },

    _maxDragY: {
        value: 0
    },

    maxDragY: {
        get: function () {
            return this._maxDragY;
        },
        set: function (value) {
            if (this._maxDragY !== value) {
                this._maxDragY = value;
            }
        }
    },

    isRounding: {
        value: true
    },

    handleMousedown: {
        value: function (event) {
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
            this._targetX = this._dragX;
            this._targetY = this._dragY;
            document.addEventListener("mousemove", this, false);
            document.addEventListener("mouseup", this, false);
            event.preventDefault();
            //event.stopPropagation();
        }
    },

    handleMousemove: {
        value: function (event) {
            this._targetX += (event.pageX - this._pointerX) * this.dragXMultiplier;
            this._targetY += (event.pageY - this._pointerY) * this.dragYMultiplier;
            this._isOwnUpdate = true;
            this.dragX = this._targetX;
            this._isOwnUpdate = true;
            this.dragY = this._targetY;
            this._pointerX = event.pageX;
            this._pointerY = event.pageY;
            event.preventDefault();
        }
    },

    handleMouseup: {
        value: function (event) {
            document.removeEventListener("mousemove", this, false);
            document.removeEventListener("mouseup", this, false);
            event.preventDefault();
        }
    },

    draw: {
        value: function () {
            if (this._needsToDrag) {
                this._element.style.webkitTransform = "translate3d(" + (this._dragX / this.dragXMultiplier) + "px," + (this._dragY / this.dragYMultiplier) + "px,0)";
                this._needsToDrag = false;
            }
        }
    }

});