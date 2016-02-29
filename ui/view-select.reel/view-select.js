/**
 * @module ui/view-select.reel
 */
var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer;

/**
 * @class ViewSelect
 * @extends Component
 */
exports.ViewSelect = Component.specialize(/** @lends ViewSelect# */ {
    isExpanded:  {
        value: null
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._pressComposer = new PressComposer();
                this.addComposer(this._pressComposer);
            }
        }
    },

    handlePress: {
        value: function (event) {
            if (this.isExpanded) {
                var iteration = this.repetition._findIterationContainingElement(event.targetElement);
                if (iteration) {
                    // console.log(iteration.object);
                    this.isExpanded = false;
                }
            }
            else {
                this.isExpanded = true;
            }
        }
    },

    prepareForActivationEvents: {
        value: function () {
            this._pressComposer.addEventListener("pressStart", this, false);
            this._pressComposer.addEventListener("press", this, false);
            this._pressComposer.addEventListener("pressCancel", this, false);
        }
    }
});
