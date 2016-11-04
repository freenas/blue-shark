var Component = require("montage/ui/component").Component;

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize({
    handleAction: {
        value: function(event) {
            console.log(event);
            this.eventTarget = event.target.identifier;
        }
    }
});
