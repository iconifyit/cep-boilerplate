/**
 * CSInterface object.
 */
if (typeof CSInterface !== 'undefined') {
    csInterface.evalScript("$.getenv('HOME')", function(result) {
        HOME = result;
    })
}

/**
 * Global counter.
 * @type {number}
 */
var counter = counter || 0;

/**
 * Get the USER_DATA folder.
 */
var userDataFolder = (function() {
    var _userDataFolder;
    try {
        console.log(
            'csInterface.getSystemPath(SystemPath.USER_DATA)',
            csInterface.getSystemPath(SystemPath.USER_DATA)
        );
        console.log(
            window.location.href
        )
        _userDataFolder = csInterface.getSystemPath(SystemPath.USER_DATA);
    }
    catch(e) {
        try {
            _userDataFolder = Folder.userData;
        }
        catch(e) {
            alert('logger.info : ' + e);
        }
    }
    return _userDataFolder;
})();

/**
 * Get the extension path.
 */
var extensionPath = (function() {
    var _extensionPath;
    try {
        console.log(
            'csInterface.getSystemPath(SystemPath.EXTENSION)',
            csInterface.getSystemPath(SystemPath.EXTENSION)
        );
        _extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);
    }
    catch(e) {
        try {
            var _extensionPath = $.fileName.split('/').slice(0, -3).join('/') + '/';
        }
        catch(e) { /* Exit gracefully */ }
    }
    return _extensionPath;
})();

/**
 * Event constants.
 * @type {{KEY_SAVED: string, OPEN_URL: string}}
 */
var Events = {
    KEY_SAVED : 'key_saved',
    OPEN_URL  : 'open_url',
    SLCT      : 'slct'
};

/**
 * Context constants.
 * @type {{HOST: string, CLIENT: string}}
 */
var Contexts = {
    HOST    : 'HOST',
    CLIENT  : 'CLIENT',
    JS      : 'JS',
    JSX     : 'JSX',
    UNKNOWN : 'UNKNOWN',
    ERR     : 'ERROR'
};

/**
 * Operating system constants.
 * @type {{
 *     UNKNOWN : string,
 *     WIN     : string,
 *     MAC     : string
 * }}
 */
var Platforms = {
    MAC     : 'mac',
    WIN     : 'windows',
    UNKNOWN : 'unknown'
};

/**
 * Mode constants.
 * @type {{
 *   TEST : string,
 *   LIVE : string
 * }}
 */
var Modes = {
    TEST : 'test',
    LIVE : 'live'
};

/**
 * File Extensions constants.
 * @type {{JPG: string, PDF: string, SVG: string, GIF: string, AI: string, PNG: string, EPS: string}}
 */
var FileTypes = {

    SVG : "SVG",
    EPS : "EPS",
    AI  : "AI",
    PDF : "PDF",
    PNG : "PNG",
    JPG : "JPG",
    GIF : "GIF",

    toRegex : function(theType) {
        if (typeof(FileTypes[theType.toUpperCase()]) == 'string') {
            return new RegExp(theType.toLowerCase(), 'ig');
        }
    }
};

var EXTENSION_ID = 'com.atomic.ai-icontools.panel';

/**
 * Global Config object.
 * @type {{
 *     APP_NAME     : string,
 *     USER_DATA    : *,
 *     LOGFOLDER    : *,
 *     API_KEY      : *,
 *     API_ENDPIONT : *
 * }}
 */
Config = {
    EXTENSION_ID     : EXTENSION_ID,
    EXTENSION_VERS   : '0.0.0',
    APP_NAME         : EXTENSION_ID,
    EXTENSION_PATH   : extensionPath,
    USER_DATA        : userDataFolder + '/' + EXTENSION_ID,
    PRESETS          : userDataFolder + '/' + EXTENSION_ID + '/presets',
    LOG_FOLDER       : userDataFolder + '/' + EXTENSION_ID + '/logs',
    SETTINGS_FILE    : userDataFolder + '/' + EXTENSION_ID + '/settings.json',

    MODE             : Modes.TEST,
    DEBUG            : true
};
