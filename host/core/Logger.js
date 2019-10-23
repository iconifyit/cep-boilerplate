/**
 * @author Scott Lewis <scott@atomiclotus.net>
 * @copyright 2018 Scott Lewis
 * @version 1.0.0
 * @url http://github.com/iconifyit
 * @url https://atomiclotus.net
 *
 * ABOUT:
 *
 *    This script creates a simple logger class.
 *
 * NO WARRANTIES:
 *
 *   You are free to use, modify, and distribute this script as you see fit.
 *   No credit is required but would be greatly appreciated.
 *
 *   THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND.
 *   YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL
 *   THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF
 *   ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO
 *   NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.
 */
/**
 * Define the Session class.
 */
/**
 * Create a new logger instance.
 * @param name
 * @param folder
 * @constructor
 */
var Logger = function(name, folder) {

    /**
     * Default settings for the logger.
     * @type {{folder: string}}
     */
    this.defaults = {
        folder: Folder.myDocuments + "/logs"
    }

    /**
     * Logging levels.
     * @type {{INSPECT: string, ERROR: string, INFO: string, WARN: string}}
     */
    this.types = {
        INFO    : "INFO",
        WARN    : "WARN",
        ERROR   : "ERROR",
        INSPECT : "INSPECT"
    }

    /**
     * The log folder object.
     * @type {Folder}
     */
    this.folder = new Folder(folder || this.defaults.folder);

    /*
     * Create the log folder if it does not exist.
     */
    if (! this.folder.exists) {
        this.folder.create();
    }

    /*
     * Add filepath
     */
    this.filepath = this.folder.absoluteURI + "/" + name + "-" + dateFormat(new Date().getTime()) + ".log"

    /**
     * Format date into a filename-friendly format.
     * @param date
     * @returns {string}
     */
    function dateFormat(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    /**
     * The log file.
     * @type {File}
     */
    this.file = new File(this.filepath).absoluteURI;

    /**
     * Stream writer object.
     * @type {Stream}
     */
    this.stream = new Stream(this.filepath);

};

/**
 * Returns the folder for the current logger.
 * @returns {Folder}
 */
Logger.prototype.getFolder = function() {
    return this.folder;
}

/**
 * Returns the folder path for the current logger.
 * @returns {string}
 */
Logger.prototype.getFolderPath = function() {
    try {
        return this.folder.absoluteURI;
    }
    catch(e) {
        return null;
    }
}

/**
 * Returns the filepath for the current logger.
 * @returns {string}
 */
Logger.prototype.getFilePath = function() {
    return this.filepath;
}

/**
 * Set stream writer.
 * @param stream
 */
Logger.prototype.setStream = function(stream) {
    this.stream = stream;
}

/**
 * Gets the current stream writer.
 * @returns {Stream}
 */
Logger.prototype.getStream = function() {
    return this.stream;
}

/**
 * Add info message to log.
 * @param message
 */
Logger.prototype.info = function(message) {
    this.log(message, this.types.INFO);
}

/**
 * Add warning message to log.
 * @param message
 */
Logger.prototype.warn = function(message) {
    this.log(message, this.types.WARN);
}

/**
 * Add error message to log.
 * @param message
 */
Logger.prototype.error = function(message) {
    this.log(message, this.types.ERROR);
}

/**
 * Add message to log.
 * @param message
 */
Logger.prototype.log = function(message, type) {
    this._write( "[" + this.types[type] + "][" + new Date().toUTCString() + "] " + message );
}

/**
 * Write message to log file.
 * @param message
 * @private
 */
Logger.prototype._write = function(message) {
    this.getStream().write(message);
}

/**
 * Delete log file.
 * @returns {*|Array}
 */
Logger.prototype.remove = function() {
    if (this.file.exists) {
        return this.file.remove();
    }
}

/**
 * Create the log file.
 * @param message
 */
Logger.prototype.create = function() {
    if (! this.file.exists) {
        return this.file.create();
    }
}

/**
 * Prints an object to the log.
 * @param obj
 */
Logger.prototype.inspect = function(obj) {
    for (var key in obj) {
        try {
            this.log(key + ' : ' + obj[key], this.types.INSPECT);
        }
        catch(e) {
            this.log(key + ' : [' + localize({en_US: 'Internal Error'}) + ']', this.types.INSPECT);
        }

    }
}

/**
 * Open the log file.
 */
Logger.prototype.open = function() {
    if (this.file.exists) {
        this.file.execute();
    }
    else {
        return "Log file `" + this.file.absoluteURI + "` does not exist";
    }
}


/**
 * The local scope logger object.
 * @type {Logger}
 */
// var logger = new Logger(Config.APP_NAME, Config.LOG_FOLDER);
//
// logger.info('Initialize Logger.js');
