/**
 * @module ui/field.reel
 */
var Component = require("montage/ui/component").Component,
    bindPropertyToClassName = require("core/core").bindPropertyToClassName;

/**
 * @class Field
 * @extends Component
 */
var Field = exports.Field = Component.specialize(/** @lends Field# */ {

    handleFieldInfoButtonAction: {
        value: function () {
            console.log(this.title + " reference to " + this.documentationReference);
        }
    }
});

bindPropertyToClassName(Field, "hasError", "has-error");
bindPropertyToClassName(Field, "isValidated", "is-validated");
bindPropertyToClassName(Field, "disabled", "is-disabled");
