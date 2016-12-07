/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {

    handleDisableButtonAction: {
        value: function () {
            this._childComponents.forEach(function(component){
                if(component.identifier !== "disableButton") {
                    component.disabled = !component.disabled;
                }
            })
        }
    },

    handleToggleErrorsButtonAction: {
        value: function () {
            this._childComponents.forEach(function(component){
                if(component.identifier !== "toggleErrorsButton") {
                    if (component.identifier == "multiSelect") {
                        component.inputHasError = !!component.inputHasError ? false : true;
                    } else if (component.identifier == "duration") {
                        component.inputHasError = !!component.inputHasError ? false : true;
                        component.unitHasError = !!component.unitHasError ? false : true;
                    } else {
                        component.hasError = !!component.hasError ? false : true;
                    }
                }
            })
        }
    }
});
