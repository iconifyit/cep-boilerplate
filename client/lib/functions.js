/**
 * Global config object.
 * @type {{}}
 */
window.Config = window.Config || {};

/**
 * A global object of constants.
 * @type {{EXTENSION_ID: string}}
 */
window.Config.extensionId = csInterface.getExtensionID();

/**
 * Global counter.
 * @type {number}
 */
window.counter = window.counter || 0;

/**
 * Creates a string ID
 * @returns {string}
 */
function getId() {
    return String(counter++);
}

/**
 * Build the custom User Agent string.
 * @param extensionId
 * @returns {*}
 */
function getUserAgent(extensionId) {

    var theAppInfo,
        theExtInfo;

    try {
        theAppInfo = getApplicationInfo();
    }
    catch(e) {
        error(ApplicationInfoError(e));
    }

    try {
        theExtInfo = getExtensionInfo(extensionId);
    }
    catch(e) {
        error(ExtensionInfoError(e));
    }

    return _t(
        '{ID} {PS} Plugin {EXT}/CEP {CEP} {OS}',
        {
            ID  : get(theAppInfo, 'ID', '??'),
            PS  : get(theAppInfo, 'Version', '??'),
            CEP : get(theAppInfo, 'CEP_Runtime', '??'),
            EXT : get(theExtInfo, 'version', '??'),
            OS  : csInterface.getOSInformation()
        }
    )
}

/**
 * Get the installData dump.
 * @type {string}
 */
function getInstallData() {
    try {
        return readFileData(
            csInterface.dumpInstallationInfo()
        );
    }
    catch(e) {
        throw new InstallInfoError(e.message, e.stack);
    }
}

/**
 * Parse the Extension manifest.
 * @returns {{Version: string}}
 */
function getExtensionInfo() {

    var extensionData = {
        version : ''
    };

    var ext,
        xmlString,
        theManifest;

    try {
        ext = getExtension(csInterface.getExtensionID());

        if (get(ext, 'basePath', false)) {

            xmlString   = readFileData(path(ext.basePath, 'CSXS/manifest.xml'));
            theManifest = $.parseXML(xmlString);
            var $ext    = $('Extension[Id="' + csInterface.getExtensionID() + '"]', theManifest).eq(0);

            extensionData.version = $ext.attr('Version');
        }
    }
    catch(e) {
        error(new ExtensionInfoError(e.message, e.stack));
        throw new ExtensionInfoError(e.message, e.stack);
    }

    return extensionData;
}


/**
 * Get an extension object. Defaults to current extension.
 * @param extensionId
 * @returns {*}
 */
function getExtension( extensionId ) {
    var extension,
        extensions;

    if (typeof(extensionId) == 'undefined') {
        extensionId = csInterface.getExtensionId();
    }

    extensions = csInterface.getExtensions( [extensionId] );

    if ( extensions.length == 1 ) {

        extension = extensions[0];
        extension.basePath = slash( extension.basePath );
        info(extension.basePath);

        if (get(extension, 'basePath', false)) {

            xmlString   = readFileData(path(extension.basePath, 'CSXS/manifest.xml'));
            theManifest = $.parseXML(xmlString);
            var $ext    = $('Extension[Id="' + extension.id + '"]', theManifest).eq(0);

            extension.version = $ext.attr('Version');
        }
    }

    return {
        id            : get( extension, 'id', '' ),
        name          : get( extension, 'width', '' ),
        version       : get( extension, 'version', ''),

        basePath      : slash( get( extension, 'basePath', '' ) ),
        mainPath      : slash( get( extension, 'mainPath', '' ) ),

        windowType    : get( extension, 'width', '' ),
        isAutoVisible : get( extension, 'width', '' ),

        height        : get( extension, 'height', '' ),
        width         : get( extension, 'width', '' ),
        maxHeight     : get( extension, 'width', '' ),
        maxWidth      : get( extension, 'width', '' ),
        minHeight     : get( extension, 'width', '' ),
        minWidth      : get( extension, 'width', '' )
    };
}

/**
 * Get the App info from Extension Installation Info dump.
 * @returns {{Locale: string, CEP_Runtime: string, Version: string, ID: string}}
 */
function getApplicationInfo() {

    var appInfo = {
        ID          : '',
        Version     : '',
        Locale      : '',
        CEP_Runtime : ''
    };

    var patterns = {
        'ID'          : new RegExp(/ID:(.*)/i),
        'Version'     : new RegExp(/Version:(.*)/i),
        'Locale'      : new RegExp(/Locale:(.*)/i),
        'CEP_Runtime' : new RegExp(/CEP Runtime Version:(.*)/i)
    };

    var theDump;

    try {
        theDump = getInstallData();

        for (key in patterns) {

            var found = theDump.match( patterns[key] );

            if (typeof (found.length) != 'undefined' && found.length > 1) {
                appInfo[key] = found[1];
            }
        }
    }
    catch(e) {
        error(new ApplicationInfoError(e.message, e.stack));
        throw new ApplicationInfoError(e.message, e.stack);
    }
    return appInfo;
}

/**
 * Determine if application is currently connected to the internet.
 * @returns {*}
 */
function isAppOnline() {
    return get(csInterface.getNetworkPreferences(), 'isAppOnline', false);
}

/**
 * For dev only. Test the progress bar.
 */
function startProgressBar() {

    var inProgress = false,
        $progress  = $("#progress");

    if (! inProgress) {

        updateProgress(0);

        var timerId = setInterval(function() {

            inProgress = true;
            var value  = parseInt( $progress.attr('value') );

            updateProgress(value + 1);

            if ( value >= 100) {
                clearInterval(timerId);
                inProgress = false;
            }
        }, 200);
    }
}

/**
 * Update the progress bar values.
 * @param value
 * @param max
 */
function _updateProgress(value) {
    $("#progress").attr('value', value);
}

function updateProgressValue(value) {
    var $progress  = $("#progress");
    $('#indicator').css({
        width: (($progress.data('value') / $progress.data('max')) * 100) + "%"
    });
}

/**
 * Update the progress bar from the xhr.progress event.
 * @param {number}  loaded      The amount of data transferred.
 * @param {number}  total       The total amount of data to transfer.
 * @param {string}  direction   Whether upload or download.
 */
function updateProgressBar(loaded, total, direction) {
    $("#progress").attr('value', (loaded / total) * 100);
}

/**
 * Replace tokens in a string with key => value paired vars.
 * @param theText
 * @param theVars
 * @returns {*}
 * @private
 */
function _t(theText, theVars) {
    for (token in theVars) {
        theText = theText.replace(
            new RegExp("{" + token + "}","g"),
            theVars[token]
        );
    }
    return theText;
}

/**
 * Show an element for a limited time.
 * @param selector
 * @param duration
 */
function showTemporarily(selector, duration) {
    var $item = $(selector);
    $item.fadeIn(200, function() {
        setTimeout(function() {
            $item.fadeOut(200);
        }, duration * 1000);
    });
}

/**
 * Get the current extension version.
 * @returns {string}
 */
function getExtensionVersion() {
    var extensionInfo = getExtensionInfo();
    var version = '0.0.0';
    if (typeof extensionInfo == 'object' && typeof extensionInfo.version != 'undefined') {
        version = extensionInfo.version;
    }
    return version;
}

/**
 * Loads external JSX files.
 */
function loadDependencies() {
    var ext = getExtension(csInterface.getExtensionID());
    var files = [
        'host/polyfills.js',
        'host/JSON.jsx',
        'host/Logger.jsx',
        'host/Helpers.jsx',
        'host/SelectionDimensions.jsx',
        'host/Utils.jsx',
        'host/SettingsDialog.jsx',
        'host/ErrorClasses.jsx',
        'host/globals.js'
    ];
    for (var i=0; i<files.length; i++) {
        var theFile = ext.basePath +  files[i];
        csInterface.evalScript("include('" + theFile + "')", function(result) {
            info(result);
        });
    }
}

/**
 * Client-side include file function (passes through to JSX include).
 * @param filePath
 */
function include(filePath, callback) {
    try {
        csInterface.evalScript("include('" + filePath + "')", function(result) {
            info('result of include call : ' + result);
            callback.apply(null, result);
        });
    }
    catch(e) {
        throw new Error(e);
    }
}

/**
 * Adds the progress bar to the palette.
 */
function showProgressBar() {
    removeProgressBar();
    $("#top-section").append(
        '<progress id="progress" max="100" value="0"></progress>'
    );
}

/**
 * Removes the progress bar from the palette.
 */
function removeProgressBar() {
    $("#progress").remove();
}

/**
 * Are we in debug mode?
 * @returns {boolean}
 */
function isDebug() {
    return Config.DEBUG === true;
}

/**
 * Are we in test mode?
 * @returns {boolean}
 */
function isTest() {
    return Config.MODE === 'test';
}

/**
 * DEV ONLY
 * Reloads the extension front-end.
 */
function reloadExtension() {
    try {
        window.cep.process.removeAllListeners();
    }
    catch (e) {console.error(e)}
    window.location.href = "index.html";
}

/**
 * Open url in browser.
 * @param event
 */
function eventHandlerOpenInBrowser(event) {
    info(event.data);
    csInterface.openURLInDefaultBrowser(event.data.url);
}

/**
 * Dynamically add a script tag to a page.
 * @param src
 */
function addScript(src, fn) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    s.onload = function() {
        console.info('Script ' + src + ' dynamically loaded');
        fn();
    };
    document.body.appendChild(s);
}

/**
 * Queue a script to load on DOM.ready
 * @param src
 * @param fn
 */
function enqueue(src, fn) {
    $(function() {
        addScript(src, fn);
    });
}

/**
 * Get the extension root path.
 * @returns {undefined}
 */
function getExtensionPath() {
    var extensionPath = undefined;
    try {
        extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);
    }
    catch(e) { throw new ExtensionPathError(e); }
    return extensionPath;
}

/**
 * Returns only primitive values.
 * @returns {{ }}
 */
var ConfigValues = function(Config) {
    var values = {};
    for (var key in Config) {
        if (typeof Config[key] !== 'function') {
            if (key !== 'ACCOUNT') {
                values[key] = Config[key];
            }
        }
    }
    return values;
}

/**
 * Generate a short unique ID with collision-checking.
 */
function shortUUID() {
    var _generatedUIDs = {};
    while (true) {
        var uid = ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
        if (!_generatedUIDs.hasOwnProperty(uid)) {
            _generatedUIDs[uid] = true;
            return uid;
        }
    }
}

/**
 * Escape JSON string.
 * @param str
 * @returns {void | string | never}
 */
function escapeJson(str) {
    return str.replace(/\\/g, "\\\\");
}

