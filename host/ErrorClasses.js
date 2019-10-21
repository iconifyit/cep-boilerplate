/**
 * Custom DeleteFileError.
 * @param message
 * @constructor
 */
var DeleteFileError = function(message) {
    this.name    = "DeleteFileError";
    this.message = (message || "The file was not deleted");
    this.code    = "EDELFIL";
}
DeleteFileError.prototype = Error.prototype;

/**
 * Custom ReadFileError.
 * @param message
 * @constructor
 */
var ReadFileError = function(message) {
    this.name    = "ReadFileError";
    this.message = (message || "The file could not be read");
    this.code    = "EREADF";
}
ReadFileError.prototype = Error.prototype;

/**
 * InstallInfoError
 * @param message
 * @param stack
 * @constructor
 */
var InstallInfoError = function(message, stack){
    this.name    = "InstallInfoError";
    this.message = message || "InstallInfo error";
    this.stack   = stack;
};
InstallInfoError.prototype = Error.prototype;

/**
 * GetExtensionError
 * @param message
 * @param stack
 * @constructor
 */
var GetExtensionError = function(message, stack){
    this.name    = "GetExtensionError";
    this.message = message || "GetExtensionError error";
    this.stack   = stack;
};
GetExtensionError.prototype = Error.prototype;

/**
 *
 * @param message
 * @param stack
 * @constructor
 */
var ApplicationInfoError = function(message, stack) {
    this.name    = 'ApplicationInfoError';
    this.message = message || 'ApplicationInfoError error';
    this.stack   = stack || '';
};
ApplicationInfoError.prototype = Error.prototype;

/**
 *
 * @param message
 * @param stack
 * @constructor
 */
var ExtensionInfoError = function(message, stack) {
    this.name    = 'ExtensionInfoError';
    this.message = message || 'ExtensionInfoError error';
    this.stack   = stack || '';
};
ExtensionInfoError.prototype = Error.prototype;

/**
 *
 * @param message
 * @param stack
 * @constructor
 */
var NoSuchFileError = function(message, stack) {
    this.name    = "NoSuchFileError";
    this.message = message || "The specified file does not exist";
    this.stack   = stack;
}
NoSuchFileError.prototype = Error.prototype;

/**
 * CreateHost error.
 * @param message
 * @param stack
 * @constructor
 */
var CreateHostError = function(message, stack) {
    this.name    = "CreateHostError";
    this.message = message || "An unknown CreateHostError occurred";
    this.stack   = stack;
}
CreateHostError.prototype = Error.prototype;

/**
 * NoOpenDocumentsError error.
 * @param message
 * @param stack
 * @constructor
 */
var NoOpenDocumentsError = function(message, stack) {
    this.name    = "NoOpenDocumentsError";
    this.message = message || "There are no open documents";
    this.stack   = stack;
}
NoOpenDocumentsError.prototype = Error.prototype;

/**
 * ExtensionPathError error.
 * @param message
 * @param stack
 * @constructor
 */
var ExtensionPathError = function(message, stack) {
    this.name    = "ExtensionPathError";
    this.message = message || "Error getting extension base path";
    this.stack   = stack;
}
ExtensionPathError.prototype = Error.prototype;

/**
 * MockjaxTestError error.
 * @param message
 * @param stack
 * @constructor
 */
var MockjaxTestError = function(message, stack) {
    this.name    = "MockjaxTestError";
    this.message = message || "Error in Mockjax test harness";
    this.stack   = stack;
}
MockjaxTestError.prototype = Error.prototype;
