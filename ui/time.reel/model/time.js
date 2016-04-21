var Montage = require("montage/core/core").Montage;

var Time = exports.Time = Montage.specialize({
    _days: {
        value: 0
    },

    _hours: {
        value: 0
    },

    hours: {
        get: function() {
            return this._hours;
        },
        set: function(hours) {
            if (hours) {
                this._hours += hours;
                this._bubbleHours();
            }
        }
    },

    _minutes: {
        value: 0
    },

    minutes: {
        get: function() {
            return this._minutes;
        },
        set: function(minutes) {
            if (minutes) {
                this._minutes += minutes;
                this._bubbleMinutes();
            }
        }
    },

    _seconds: {
        value: 0
    },

    seconds: {
        get: function() {
            return this._seconds;
        },
        set: function(seconds) {
            if (seconds) {
                this._seconds += seconds;
                this._bubbleSeconds();
            }
        }
    },

    isEqualTo: {
        value: function (time) {
            return this._days === time._days &&
                this._hours === time._hours &&
                this._minutes === time._minutes &&
                this._seconds === time._minutes;
        }
    },

    isGreaterThan: {
        value: function (time) {
            return this._days > time.days ||
                (this._days === time._days && this._hours > time._hours) ||
                (this._days === time._days && this._hours === time._hours && this._minutes > time._minutes) ||
                (this._days === time._days && this._hours === time._hours && this._minutes === time._minutes && this._seconds > time._seconds);
        }
    },

    isGreaterOrEqualThan: {
        value: function (time) {
            return this.isGreaterThan(time) || this.isEqualTo(time);
        }
    },

    isLowerThan: {
        value: function (time) {
            return this._days < time.days ||
                (this._days === time._days && this._hours < time._hours) ||
                (this._days === time._days && this._hours === time._hours && this._minutes < time._minutes) ||
                (this._days === time._days && this._hours === time._hours && this._minutes === time._minutes && this._seconds < time._seconds);
        }
    },

    isLowerOrEqualThan: {
        value: function (time) {
            return this.isLowerThan(time) || this.isEqualTo(time);
        }
    },

    _bubbleHours: {
        value: function () {
            if (this._hours > 23) {
                this._days = Math.round(this._hours / 24);
                this._hours = this._hours % 24;
            }
        }
    },

    _bubbleMinutes: {
        value: function () {
            if (this._minutes > 59) {
                this._hours = Math.round(this._minutes / 60);
                this._minutes = this._minutes % 60;
            }
        }
    },

    _bubbleSeconds: {
        value: function () {
            if (this._seconds > 59) {
                this._minutes = Math.round(this._seconds / 60);
                this._seconds = this._seconds % 60;
            }
        }
    }


}, {
    create: {
        value: function(hours, minutes, seconds) {
            var time = new Time();
            time.seconds = seconds;
            time.minutes = minutes;
            time.hours = hours;
            return time;
        }
    },

    createFromTimeAndDelta: {
        value: function(time, delta) {
            return Time.create( time.hours + delta.hours,
                time.minutes + delta.minutes,
                time.seconds + delta.seconds);
        }
    }
});
