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
 * Create a new logger instance.
 * @param name
 * @param folder
 * @constructor
 */
function Logger(name, folder) {

    /**
     * Default settings for the logger.
     * @type {{folder: string}}
     */
    this.defaults = {
        folder: Folder.myDocuments + "/logs"
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
    this.file = new File(
        this.folder.absoluteURI + "/" + name + "-" + dateFormat(new Date().getTime()) + ".log"
    );

};

/**
 * Logger prototype.
 * @type {{
 *     types: {
 *         INFO: string,
 *         WARN: string,
 *         ERROR: string
 *     },
 *     info: Logger.info,
 *     warn: Logger.warn,
 *     error: Logger.error,
 *     log: Logger.log,
 *     remove: Logger.remove,
 *     create: Logger.create
 * }}
 */
Logger.prototype = {

    /**
     * Log message types.
     */
    types: {
        INFO    : localize({en_US: "INFO"}),
        WARN    : localize({en_US: "WARN"}),
        ERROR   : localize({en_US: "ERROR"}),
        INSPECT : localize({en_US: "INSPECT"})
    },

    /**
     * Add info message to log.
     * @param message
     */
    info : function(message) {
        this.log(message, this.types.INFO);
    },

    /**
     * Add warning message to log.
     * @param message
     */
    warn : function(message) {
        this.log(message, this.types.WARN);
    },

    /**
     * Add error message to log.
     * @param message
     */
    error : function(message) {
        this.log(message, this.types.ERROR);
    },

    /**
     * Add message to log.
     * @param message
     */
    log : function(message, type) {
        Utils.write_file(
            this.file.absoluteURI,
            "[" + this.types[type] + "][" + new Date().toUTCString() + "] " + message
        );
    },

    /**
     * Delete log file.
     * @returns {*|Array}
     */
    remove : function() {
        if (this.file.exists) {
            return this.file.remove();
        }
    },

    /**
     * Create the log file.
     * @param message
     */
    create : function() {
        if (! this.file.exists) {
            return this.file.create();
        }
    },

    /**
     * Prints an object to the log.
     * @param obj
     */
    inspect: function(obj) {
        for (key in obj) {
            try {
                this.log(key + ' : ' + obj[key], this.types.INSPECT);
            }
            catch(e) {
                this.log(key + ' : [' + localize({en_US: 'Internal Error'}) + ']', this.types.INSPECT);
            }

        }
    }
};