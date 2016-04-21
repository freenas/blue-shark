var Montage = require("montage/core/core").Montage,
    Time = require('../model/time').Time;

exports.StringToTimeConverter = Montage.specialize({
    _TOKENS: {
        value: {
            'H': {
                property: 'hours',
                length: 2,
                type: 'number',
                min: 00,
                max: 23
            },
            'I': {
                property: 'hours',
                length: 2,
                type: 'number',
                min: 01,
                max: 12
            },
            'M': {
                property: 'minutes',
                length: 2,
                type: 'number',
                min: 00,
                max: 59
            },
            'S': {
                property: 'seconds',
                length: 2,
                type: 'number',
                min: 00,
                max: 59
            },
/*
            'p': {
                modifier: function(value, time) {
                    if (value === 'PM') {
                        time.hours += 12;
                    }
                },
                display: function(time) {
                    return time.hours < 12 ? 'AM' : 'PM';
                },
                length: 2,
                type: 'string'
            },
*/
            '%': {
                value: '%'
            }
        }
    },

    _DEFAULT_FORMAT: {
        value: "%H:%M"
    },

    format: {
        value: null
    },

    convert: {
        value: function(timeString) {
            this._ensureFormatIsSet();
            var i, length, j, character, value, token,
                result = Time.create();
            for (i = 0, j = 0, length = this.format.length; i < length; i++) {
                character = this.format[i];
                if (character === '%') {
                    i++;
                    token = this._TOKENS[this.format[i]];
                    if (token) {
                        if (token.property) {
                            value = timeString.slice(j, j + token.length);
                            j += token.length;
                            if (token.type == 'number') {
                                result[token.property] = +value;
                            } else {
                                result[token.property] = value;
                            }
                        } else if (typeof token.modifier === 'function') {
                            value = timeString.slice(j, j + token.length);
                            j += token.length;
                            token.modifier(value, result);
                        } else {
                            j++
                        }
                    }
                } else {
                    j++;
                }
            }
            return result;
        }
    },

    revert: {
        value: function(time) {
            var result = '';
            if (typeof time.hours === 'undefined') {
                result = 'now';
            } else {
                this._ensureFormatIsSet();
                var i, length, j, character, value, token;
                for (i = 0, length = this.format.length; i < length; i++) {
                    character = this.format[i];
                    if (character === '%') {
                        i++;
                        token = this._TOKENS[this.format[i]];
                        if (token) {
                            if (token.property) {
                                value = time[token.property] || 0;
                                if (value < 10) {
                                    result += '0';
                                }
                                result += value;
                            } else if (token.value) {
                                result += token.value;
                            } else if (typeof token.display === 'function') {
                                result += token.display(time);
                            }
                        } else {
                            result += this.format[i];
                        }
                    } else {
                        result += character;
                    }
                }
            }
            return result;
        }
    },

    _ensureFormatIsSet: {
        value: function() {
            if (!this.format) {
                this.format = this._DEFAULT_FORMAT;
            }
        }
    }
});
