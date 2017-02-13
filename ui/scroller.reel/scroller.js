/**
 * @module ui/scroller.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Scroller
 * @extends Component
 */
exports.Scroller = Component.specialize(/** @lends Scroller# */ {

    // scrollElement: {
    //     value: null
    // },
    _itemOffsetLeft: {
        value: null
    },

    __contentWidth: {
        value: 0
    },

    _contentWidth: {
        set: function (contentWidth) {
            if (this.__contentWidth !== contentWidth) {
                this.__contentWidth = contentWidth;
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
            if (this.__contentHeight !== contentHeight) {
                this.__contentHeight = contentHeight;
            }
        },
        get: function () {
            return this.__contentHeight;
        }
    },

    scrollIntoView: {
        value: function (element) {

            this._itemOffsetLeft = element.offsetLeft;

            // console.log(this.content);
            // console.log(this.element);

            this.needsDraw = true;
        }
    },

    willDraw: {
        value: function () {
            var content = this.content,
                wrapper = this.element;

                // console.log(content, wrapper);

                this._visibleHeight = wrapper.offsetHeight;
                this._contentHeight = content.offsetHeight;
                this._visibleWidth  = wrapper.offsetWidth;
                this._contentWidth  = content.offsetWidth;
        }
    },

    draw: {
        value: function () {
            this._maxTranslateX = Math.max(0, this._contentWidth - this._visibleWidth);
            this._maxTranslateY = Math.max(0, this._contentHeight - this._visibleHeight);

            // console.log("maxX", this._maxTranslateX);
            // console.log("maxY", this._maxTranslateY);


            if (this._maxTranslateX) {
                this.element.scrollLeft = this._itemOffsetLeft;
            }

            if (this._maxTranslateY) {
                this.element.scrollTop = this._maxTranslateY;
            }
        }
    }
});
