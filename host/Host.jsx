/**
 * Create symbols for classes in global scope.
 */
var host,
    Config,
    Utils,
    Logger,
    logger;

/**
 * The Host app class.
 * @param Config
 * @returns {Host}
 * @constructor
 */
var Host = function(Config) {

    var _logger;

    _logger = new Logger(Config.EXTENSION_ID, Config.LOG_FOLDER);
    _logger.clear();

    logger = _logger;

    /**
     * Create the USER_DATE folder if it does not exist.
     * @private
     */
    function _initDataFolder() {
        try {

            var dataFolder = Utils.folder(Config.USER_DATA),
                logFolder  = Utils.folder(Config.LOG_FOLDER);

            return '_initDataFolder : ' + typeof(dataFolder) != 'undefined' && typeof(logFolder) != 'undefined';
        }
        catch(e) {
            alert('_initDataFolder : ' + e + ' - ' + $.fileName + ':' + $.line);
            return '_initDataFolder : ' + e;
        }
    }

    /**
     * Initialize the Host.
     * @param {string} extensionID
     */
    function _init() {

        var initFolders = _initDataFolder();

        $.global.logfolder = Config.LOG_FOLDER;
        $.global.Config    = Config;
        $.global.API_KEY   = Config.API_KEY;

        _loadExternalObject();

        return initFolders;
    }

    // Initialize the object.

    _init();

    /**
     * Return the public interface.
     */
    return {
        init : function() {
            return _init();
        },
        alert : function(message) {
            alert(message);
        },
        logger : _logger
    }
};

/**
 * Create an instance of the Host object.
 * @returns {boolean}
 */
function createHostInstance() {
    try {
        host = new Host(Config);
        return typeof(host) != 'undefined';
    }
    catch(e) {
        alert(e);
        return false;
    }
}

/**
 * Create a new custom event object.
 * @param type
 * @param data
 * @returns {CSXSEvent}
 * @constructor
 */
function CustomEvent(type, data) {
    var event  = new CSXSEvent();
    event.type = type;
    event.data = data;
    return event;
}

/**
 * Wrappedr for CEP's evalFile.
 * @param theFilePath
 * @returns {*}
 */
function include(theFilePath) {
    try {
        if ((new File(theFilePath)).exists) {
            $.evalFile( theFilePath );
            return (new File(theFilePath)).name;
        }
        else {
            return theFilePath + ' does not exist';
        }
    }
    catch(e) {
        return e;
    }
}
