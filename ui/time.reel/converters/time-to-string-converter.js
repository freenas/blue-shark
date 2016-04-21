var Montage = require("montage/core/core").Montage,
    StringToTimeConverter = require('./string-to-time-converter').StringToTimeConverter;

exports.TimeToStringConverter = Montage.specialize({
    stringToTimeConverter: {
        value: new StringToTimeConverter()
    },

    convert: {
        value: function(time) {
            this.stringToTimeConverter.format = this.format;
            return this.stringToTimeConverter.revert(time);
        }
    },

    revert: {
        value: function(timeString) {
            this.stringToTimeConverter.format = this.format;
            return this.stringToTimeConverter.convert(timeString);
        }
    }
});
