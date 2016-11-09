/**
 * @module ui/file-upload.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class FileUpload
 * @extends Component
 */
exports.FileUpload = Component.specialize(/** @lends FileUpload# */ {

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._fileInput.addEventListener('change', this);
            }

            this._reset();
        }
    },

    resultType: {
        value: null
    },

    supportedExtensions: {
        value: void 0
    },

    supportedFileTypes: {
        value: void 0
    },

    maxFileSize: {
        value: void 0
    },

    data: {
        value: null
    },

    error: {
        value: null
    },

    progress: {
        value: 0
    },

    handleChange: {
        value: function () {
            var file = this._fileInput.files[0],
                fileSize = file.size,
                fileType = file.size,
                shouldAcceptFile = true,
                supportedExtensions = this.supportedExtensions,
                supportedFileTypes = this.supportedFileTypes;

            this._reset();

            if (typeof supportedExtensions === "string") {
                //todo
            } else if (Array.isArray(supportedExtensions)) {
                //todo
            }

            if (this.maxFileSize !== void 0 || this.maxFileSize !== null && fileSize > this.maxFileSize) {
                shouldAcceptFile = false;
            }

            if (typeof supportedFileTypes === "string") {
                shouldAcceptFile = fileType === supportedFileTypes;
            } else if (Array.isArray(supportedFileTypes)) {
                //todo
            }

            if (shouldAcceptFile) {
				var reader = new FileReader(),
                    self = this;

                reader.onload = function (event) {
					self.data = reader.result;
				};

                reader.onprogress = function (event) {
                    if (event.lengthComputable) {
                        self.progress = event.loaded/event.total*100;
                    } else {
                        self.progress = -1;
                    }
                };

                reader.onerror = function (event) {
                    self.error = error;
                }

                if (this.resultType === this.constructor.TYPES.dataUrl) {
                    reader.readAsDataURL(file);
                }  else if (this.resultType === this.constructor.TYPES.binary) {
                    reader.readAsBinaryString(file);
                } else {
                    reader.readAsText(file);
                }
            }
        }
    },

    _reset: {
        value: function () {
            this.data = null;
            this.error = null;
            this.progress = 0;
        }
    }

}, {

    TYPES: {
        value: {
            text: "text",
            binary: "binary",
            dataUrl: "dataUrl"
        }
    }

});
