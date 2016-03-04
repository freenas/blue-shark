/**
 * @module ui/sticky-footer.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class StickyFooter
 * @extends Component
 */
exports.StickyFooter = Component.specialize(/** @lends StickyFooter# */ {
    _scroller: {
        value: null
    },

    _footer: {
        value: null
    },

    _container: {
        value: null,
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                window.addEventListener("resize", this, false);
            }
        }
    },

    handleResize: {
        value: function () {
            this.setFooterPosition();
        }
    },

    setFooterPosition: {
        value: function () {
            // check if scroller total height is less than scroller visible height minus any padding
            if (this._scroller.clientHeight < this._scroller.scrollHeight - parseInt(this._scrollerPaddingBottom, 10)) {
                this._container.classList.add('has-stickyFooter');
                // add padding offset to replace size of footer now positioned absolute
                this._container.style.paddingBottom = this._footer.clientHeight + "px";
            } else {
                this._container.classList.remove('has-stickyFooter');
                this._container.style.paddingBottom = "0";
            }
        }
    },

    draw: {
        value: function () {
            // set up variables ? probably bad to rely on parent elements?
            this._scroller = this.element.parentElement;
            this._footer = this.element;
            this._container = this.element.parentElement.parentElement;

            // get value of scroller padding bottom
            this._scrollerPaddingBottom = window.getComputedStyle(this._scroller,null).getPropertyValue("padding-bottom");
            this._scrollerPaddingBottom = this._scrollerPaddingBottom.substr(0, this._scrollerPaddingBottom.length - 2);

            this.setFooterPosition();
        }
    }
});
