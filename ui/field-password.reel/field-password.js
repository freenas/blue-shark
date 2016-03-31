/**
 * @module ui/field-password.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FieldPassword
 * @extends Component
 */
exports.FieldPassword = Component.specialize(/** @lends FieldPassword# */ {

    enabled: {
        value: true
    },


    password: {
        get: function () {
            return this._passwordMatch ? this.__password1 : null;
        }
    },

    _passwordMatch: {
        value: false
    },

    passwordMatch: {
        set: function (passwordMatch) {
            passwordMatch = !!passwordMatch;

            if (passwordMatch !== this._passwordMatch) {
                this._passwordMatch = passwordMatch;
                this.dispatchOwnPropertyChange("password", this.password, false);
            }
        },
        get: function () {
            return this._passwordMatch;
        }
    },

    __password1: {
        value: null
    },

    _password1: {
        set: function (password) {
            if (password !== this.__password1) {
                this.__password1 = password;
                this._checkPasswords();
            }
        },
        get: function () {
            return this.__password1;
        }
    },

    __password2: {
        value: null
    },

    _password2: {
        set: function (password) {
            if (password !== this.__password2) {
                this.__password2 = password;
                this._checkPasswords();
            }
        },
        get: function () {
            return this.__password2;
        }
    },

    enterDocument: {
        value: function () {
            this.reset();
        }
    },

    reset: {
        value: function () {
            this.__password2 = this.__password1 = null;
            this._passwordMatch = true;

            this.dispatchOwnPropertyChange("_password1", null, false);
            this.dispatchOwnPropertyChange("_password2", null, false);
            this.dispatchOwnPropertyChange("passwordMatch", true, false);
        }
    },

    _checkPasswords: {
        value: function () {
            var passwordMatch = true;

            if (this.__password1 !== null && this.__password2 !== null) {
                passwordMatch = this.__password1 === this.__password2;
            }

            this.passwordMatch = passwordMatch;
        }
    }

});
