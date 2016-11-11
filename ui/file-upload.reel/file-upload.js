/**
 * @module ui/file-upload.reel
 */
var Component = require("montage/ui/component").Component;

//https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}


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

            this._fileInput.value = "";
            this._reset();
        }
    },

    resultType: {
        value: null
    },

    supportedExtensions: {
        value: null
    },

    supportedFileTypes: {
        value: null
    },

    maxFileSize: {
        value: null
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

    _getFilenameExtension: {
        value: function (filename) {
            var data = /\.+([a-zA-Z0-9]+)$/.exec(filename);
            return data && data.length === 2 ? data[1] : null;
        }
    },

    _isExtensionValid: {
        value: function (extenstionFilename) {
            var isValid = true,
                supportedExtensions = this.supportedExtensions;

            if (typeof supportedExtensions === "string") {
                isValid = extenstionFilename === supportedExtensions;
            } else if (Array.isArray(supportedExtensions) && supportedExtensions.length) {
                isValid = supportedExtensions.indexOf(extenstionFilename) !== -1;
            }

            return isValid;
        }
    },

    _isFileMimeTypeValid: {
        value: function (mimeType) {
            var isValid = true,
                supportedFileTypes = this.supportedFileTypes;

            if (typeof supportedFileTypes === "string") {
                isValid = mimeType === supportedFileTypes;
            } else if (Array.isArray(supportedFileTypes) && supportedFileTypes.length) {
                isValid = supportedFileTypes.indexOf(mimeType) !== -1;
            }

            return isValid;
        }
    },

    handleChange: {
        value: function () {
            var file = this._fileInput.files[0];

            if (file) {
                var extenstionFilename = this._getFilenameExtension(file.name),
                    fileMimeType = file.type,
                    shouldAcceptFile = true,
                    fileSize = file.size;

                this._reset();

                if ((shouldAcceptFile = this._isExtensionValid(extenstionFilename)) === false)  {
                    this.error = "extension not supported";
                }

                if (this.maxFileSize !== void 0 || this.maxFileSize !== null && fileSize > this.maxFileSize) {
                    shouldAcceptFile = false;
                    this.error = "file too big!";
                }

                if ((shouldAcceptFile = this._isFileMimeTypeValid(extenstionFilename)) === false)  {
                    this.error = "wrong type of file";
                }

                if (shouldAcceptFile) {
                    var reader = new FileReader(),
                        self = this;

                    reader.onload = function (event) {
                        self.data = self.resultType === self.constructor.TYPES.binary ?
                            b64EncodeUnicode(reader.result) : reader.result;
                    };

                    reader.onprogress = function (event) {
                        self.progress = event.lengthComputable ? event.loaded / event.total * 100 : -1;
                    };

                    reader.onerror = function (event) {
                        self.error = error;
                    }

                    if (this.resultType === this.constructor.TYPES.dataUrl) {
                        reader.readAsDataURL(file);
                    } else {
                        reader.readAsText(file);
                    }
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
