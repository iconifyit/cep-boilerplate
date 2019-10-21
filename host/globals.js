/**
 * CSInterface object.
 */
if (typeof csInterface === 'undefined' && typeof CSInterface !== 'undefined') {
    var csInterface = new CSInterface();
}

/**
 * Get the USER_DATA folder.
 */
var userDataFolder = (function() {
    var _userDataFolder;
    try {
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
 * Context constants.
 * @type {{HOST: string, CLIENT: string}}
 */
var Contexts = {
    HOST   : 'HOST',
    CLIENT : 'CLIENT'
};

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
var EXTENSION_ID = 'com.atomic.cep-boilerplate.panel';
Config = {
    EXTENSION_ID     : EXTENSION_ID,
    EXTENSION_VERS   : '0.0.0',
    APP_NAME         : EXTENSION_ID,
    USER_DATA        : userDataFolder +  '/' + EXTENSION_ID,
    LOG_FOLDER       : userDataFolder  + '/' + EXTENSION_ID + '/logs',
    SETTINGS_FILE    : userDataFolder  + '/' + EXTENSION_ID + '/settings.json'
};
