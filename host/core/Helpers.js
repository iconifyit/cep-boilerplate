var Helpers = {loaded : true};
/**
 * @author    Scott Lewis <scott@atomiclotus.net>
 * @copyright 2018 Astute Graphics
 * @version   1.0.0
 * @url       https://astutegraphics.com
 * @url       https://atomiclotus.net
 *
 * ABOUT:
 *
 *    Helper functions for general use.
 *
 * CREDITS:
 *
 *   This extension is based on the CEP Boilerplate extension by Scott Lewis
 *   at Atomic Lotus, LLC.
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
 * Context constants.
 * @type {{HOST: string, CLIENT: string}}
 */
var Contexts = {
    HOST   : 'HOST',
    CLIENT : 'CLIENT'
};

/**
 * Test if this class supports the Ai Object type. Before you can use
 * this method, define an array in the global scope named `supportedTypes`.
 * The underscore indicates the array is meant to be private.
 * @param   {string}    theType
 * @returns {boolean}
 * @private
 */
function isSupported(theType) {
    if (typeof(supportedTypes) == 'undefined') {
        throw "You must create a global array named `supportedTypes` with the supported type names";
    }
    return supportedTypes.indexOf(theType.toLowerCase()) >= 0;
}

/**
 * Check the type of an object.
 * @param   {*}         theItem
 * @param   {string}    theType
 * @returns {boolean}
 * @private
 */
function isType(theItem, theType) {
    return strcmp(typeof(theItem), theType);
}

/**
 * Check the typename of an AI Object.
 * @param   {*}         theItem
 * @param   {string}    theTypename
 * @returns {boolean}
 * @private
 */
function isTypename(theItem, theTypename) {
    if (strcmp(theItem.typename, 'undefined')) return false;
    return strcmp(theItem.typename, theTypename);
}

/**
 * Get the typename of an object if it is set.
 * @param   {object}    theItem
 * @returns {string|null}
 */
function getTypename(theItem) {
    if (isDefined(theItem.typename)) return theItem.typename;
    return "undefined";
}

/**
 * Is the item an array?
 * @param theItem
 * @returns {boolean}
 */
function isArray(theItem) {
    return theItem instanceof Array;
}

/**
 * Is theItem an object?
 * @param   {*} theItem
 * @returns {*}
 * @private
 */
function isObject(theItem) {
    return isType(theItem, 'object');
}

/**
 * Is theItem a function?
 * @param   {*}         theItem
 * @returns {boolean}
 * @private
 */
function isFunction(theItem) {
    return isType(theItem, 'function');
}

/**
 * Is theItem a string?
 * @param   {*}         theItem
 * @returns {boolean}
 */
function isString(theItem) {
    return isType(theItem, 'string');
}

/**
 * Is theItem a number?
 * @param   {*}         theItem
 * @returns {boolean}
 */
function isNumber(theItem) {
    return ! isNaN(theItem);
}

/**
 * Determine if a value is true-ish.
 * USE ONLY with strings, ints, and booleans.
 * @param   {string|boolean|integer} what
 * @returns {boolean}
 */
function isTrue(what) {

    if (what === true) return true;

    if (isString(what)) {
        var variants = [
            'yes', 'oui', 'ja', 'da',
            'si', 'yeah', 'yep', 'yup',
            'fuck yes', 'fuck yeah', 'fuckin a',
            'you know it', 'of course'
        ];
        what = what.toLowerCase();
        if (what === "true")     return true;
        if (variants.indexOf(what) != -1) return true;
    }

    if (! isNaN(what)) {
        if (parseInt(what) > 0) return true;
    }

    return false;
}

/**
 * Determine if a value is false-ish.
 * USE ONLY with strings, ints, and booleans.
 * @param   {string|boolean|integer} what
 * @returns {boolean}
 */
function isFalse(what) {

    if (what === false) return true;

    if (isString(what)) {
        var variants = [
            'no', 'non', 'nein', 'nyet',
            'nope', 'nah', 'not a chance', 'nay',
            'fuck no', 'false', 'no way', '0'
        ];
        what = what.toLowerCase();
        if (variants.indexOf(what) != -1) return true;
    }

    if (! isNaN(what)) {
        if (parseInt(what) === 0) return true;
    }

    return false;
}

/**
 * Is theString an error (Starts with the word 'Error')?
 * @param   {string}    theString
 * @returns {boolean}
 */
function isErrorString(theString) {
    return theString.substr(0, 5).toLowerCase() == 'error';
}

/**
 * Is theItem a GroupItem?
 * @param   {*}         theItem
 * @returns {boolean}
 * @private
 */
function isGroupItem(theItem) {
    return isTypename(theItem, 'GroupItem');
}

/**
 * Is theItem a PathItem?
 * @param   {*}         theItem
 * @returns {boolean}
 * @private
 */
function isPathItem(theItem) {
    return isTypename(theItem, 'PathItem');
}

/**
 * Is theItem a CompoundPathItem?
 * @param   {GroupItem} theItem
 * @returns {boolean}
 * @private
 */
function isCompoundPathItem(theItem) {
    return isTypename(theItem, 'CompoundPathItem');
}

/**
 * Test if a value is defined.
 * @param   {string}    property
 * @returns {boolean}
 * @private
 */
function isDefined(theItem) {
    return typeof(theItem) != 'undefined';
}

/**
 * Is the value null or empty?
 * @param theItem
 * @returns {boolean}
 */
function isNull(theItem) {
    if (theItem === null) return true;
    if (! isDefined(theItem)) return true;
    if (isEmpty(theItem)) return true;
    return false;
}

/**
 * If theItem is defined, return it, otherwise set it to theDefault value.
 * @param   {*}     theItem
 * @param   {*)     theDefault
 * @returns {boolean|*}
 */
function isDefinedOr(theItem, theDefault) {
    if (typeof(theItem) != 'undefined') {
        return theItem;
    }
    return theDefault;
}

/**
 * If theItem is not empty, return it, otherwise set it to theDefault value.
 * @param   {*}     theItem
 * @param   {*)     theDefault
 * @returns {boolean|*}
 */
function isEmptyOr(theItem, theDefault) {
    if (! isEmpty(theItem)) {
        return theItem;
    }
    return theDefault;
}

/**
 * Get the current timestamp.
 * @returns {number}
 * @private
 */
function now() {
    return (new Date()).getTime();
}

/**
 * Get a value from an object or array.
 * @param {object|array}    subject     The object or array to search
 * @param {string}          key         The object property to find
 * @param {*}               _default    The default value to return if property is not found
 * @returns {*}                         The found or default value
 */
function get( subject, key, _default ) {
    var value = _default;
    if (typeof(subject[key]) != 'undefined') {
        value = subject[key];
    }
    return value;
}

/**
 * Ensures a URL ends with a trailing slash.
 * @param url
 * @returns {*}
 */
function slash(url) {
    if (url.charAt(url.length-1) != '/') {
        url += '/';
    }
    return url;
};

/**
 * Appends a string to a base string using a divider.
 * @param   {string} base
 * @param   {string} add
 * @param   {string} divider
 * @returns {string}
 */
function pack(base, add, divider) {
    if (base.charAt(base.length-1) != divider) {
        base += divider;
    }
    return base + add;
}

/**
 * Case-insensitive string comparison.
 * @param   {string}  aText
 * @param   {string}  bText
 * @returns {boolean}
 */
function strcmp(aText, bText) {
    return aText.toLowerCase() == bText.toLowerCase();
}

/**
 * Trap function execution in a try/catch block.
 * @param   {function}    func
 * @returns {*}
 */
function trap(func, customError) {
    try {
        return func();
    }
    catch(e) {
        return customError || e.message ;
    }
}

/**
 * Format date into a filename-friendly format.
 * @param   {string}  date
 * @returns {string} "YYYY-MM-DD"
 */
function dateFormat(date, separator) {
    if (! isDefined(separator)) {
        separator = "-";
    }
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day   = '' + d.getDate(),
        year  = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join(separator);
}

/**
 * Test of a variable is completely empty.
 * @param   {*}         data
 * @returns {boolean}
 */
function isEmpty(data) {
    if (typeof(data) == 'number' || typeof(data) == 'boolean') {
        return false;
    }
    if (typeof(data) == 'undefined' || data === null) {
        return true;
    }
    if (typeof(data.length) != 'undefined') {
        return data.length == 0;
    }
    var count = 0;
    for (var i in data) {
        if (data.hasOwnProperty(i)) count ++;
    }
    return count == 0;
}

/**
 * Convert XML document to string.
 * @param   {XmlDocument} xmlData
 * @returns {string}
 */
function xmlToString(xmlData) {
    //IE
    if ( window.ActiveXObject ) {
        return xmlData.xml;
    }
    // Everyone else.
    return (new XMLSerializer()).serializeToString(xmlData);
}

/**
 * Trim newline chars from a long string.
 * @param   {string}    theText
 * @returns {string}
 */
function trimNewLines(theText) {
    return theText.replace(/\r?\n/g, "");
}

/**
 * Trims a string.
 * @param   {string}  str     The string to trim
 * @returns  {XML|string|void}
 */
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

/**
 * Get the file extension portion of a file name.
 * @param theFileName
 * @returns {string}
 */
function getFileExtension(theFileName) {
    return theFileName.toLowerCase().split(".").pop();
}

/**
 * Get the base name of a file path or file name.
 * @param theFileName
 * @returns {void | string}
 */
function getBaseName(theFileName) {
    var justTheName = theFileName.split("/").pop();
    return justTheName.replace("." + getFileExtension(justTheName), "");
}

/**
 * Conditionally add a layer and set name.
 * @param i
 * @param layerName
 */
function maybeAddLayer(i, layerName) {
    var doc = app.activeDocument;
    try {
        if (i == 0) {
            doc.layers[0].name = layerName;
        }
        else {
            doc.layers.add().name = layerName;
        }
    }
    catch(ex) {
        logger.error("Layer `" + layerName + "` not created : " + ex.message );
    }
}

/**
 * Center and resize artwork per configuration.
 * @param theItem
 * @param CONFIG
 */
function centerAndResizeItem(theItem, CONFIG) {
    try {
        theItem.position = [
            Math.floor((CONFIG.ARTBOARD_WIDTH  - theItem.width) / 2),
            Math.floor((CONFIG.ARTBOARD_HEIGHT - theItem.height) / 2) * -1
        ];
        if (typeof(theItem.resize) == "function" && CONFIG.SCALE != 100) {
            theItem.resize(CONFIG.SCALE, CONFIG.SCALE, true, true, true, true, CONFIG.SCALE);
        }
    }
    catch(ex) {
        try {
            theItem.position = [0, 0];
        }
        catch(ex) {/*Exit Gracefully*/}
    }
}

/**
 * Sort file list if sorting is selected.
 * @param   {array}   fileList
 * @param   {object}  CONFIG
 * @param   {Logger}  logger
 * @returns {array}
 */
function maybeSortFileList(fileList, CONFIG, logger) {
    if (CONFIG.SORT_ARTBOARDS == true) {
        try {
            fileList.sort(comparator);
        }
        catch(ex) {
            logger.error(Strings.SORT_FILELIST_FAILED);
        }
    }
    return fileList;
}

/**
 * Get artboard name from file and folder names.
 * @param theFolder
 * @param theFile
 * @returns {string|XML|void}
 */
function getBoardName(theFolder, theFile) {

    var bits      = theFolder.name.split('-');
    var boardName = theFile.name.replace(/\.svg|\.ai|\.eps|\.pdf/gi, "");

    /**
     * If the file is in a subfolder, prepend the
     * subfolder name to the board name.
     */
    if (Folder(theFile.path).absoluteURI != Folder(theFolder).absoluteURI) {
        boardName = Folder(theFile.path).name + '-' + boardName;
    }

    boardName = Utils.slugify(boardName);

    bits = boardName.split("--");
    if (bits.length > 1 && ! isNaN(bits[0])) {
        boardName = trim(bits[1]);
    }

    return boardName;
}

/**
 * Private method to open the log file.
 * @param {Logger} logger
 */
function doOpenLogFile(logger) {
    try {
        logger.info("LOG FILE : " + logger.file.absoluteURI);
        logger.open();
    }
    catch(ex) {
        logger.error(ex);
    }
}

/**
 * Creates a web shortcut then opens it in the default browser.
 * @param address
 * @private
 */
function doOpenWebAddress( address, logger ) {
    try {
        Utils.write_exec(
            Folder.temp + '/' + now() + '-shortcut.url',
            '[InternetShortcut]' + '\r' + 'URL=' + encodeURI(address) + '\r'
        );
    }
    catch(e) {
        logger.error(e);
        prompt(
            Utils.i18n(
                "The web address could not be automatically opened but you " +
                "can copy & paste the address below to your browser."
            ),
            address
        );
    }
};

/**
 * Set the PathPoints in an AI PathItem from SVG path value.
 * @param {PathItem}    path
 * @param {string}      svg
 *
 * @author Malcolm McLean <malcolm@astutegraphics.co.uk>
 */
function setPathItemFromSVG(path, svg)
{
    var i;
    var pp;
    var pointArray = svgToPathPointArray(svg);

    while(path.pathPoints.length > 1)
    {
        path.pathPoints[0].remove();
    }
    path.pathPoints[0].anchor = pointArray[0].anchor;
    path.pathPoints[0].leftDirection = pointArray[0].leftDirection;
    path.pathPoints[0].rightDirection = pointArray[0].rightDirection;

    for(i=1;i<pointArray.length;i++)
    {
        pp = path.pathPoints.add();
        pp.anchor = pointArray[i].anchor;
        pp.leftDirection = pointArray[i].leftDirection;
        pp.rightDirection = pointArray[i].rightDirection;
        pp.pointType = PointType.CORNER;
    }
}

/**
 * Copies path points from one path to another.
 * @param targetPath
 * @param sourcePath
 */
function copyPathPoints(targetPath, sourcePath) {

    var i,
        pp,
        pointArray,
        targetPPKey,
        sourcePPKey;

    targetPPKey = targetPath.selected ? "selectedPathPoints" : "pathPoints";
    sourcePPKey = sourcePath.selected ? "selectedPathPoints" : "pathPoints";

    while (targetPath[targetPPKey].length > 1) {
        targetPath[targetPPKey][0].remove();
    }

    pointArray = sourcePath[sourcePPKey];

    targetPath[targetPPKey][0].anchor         = pointArray[0].anchor;
    targetPath[targetPPKey][0].leftDirection  = pointArray[0].leftDirection;
    targetPath[targetPPKey][0].rightDirection = pointArray[0].rightDirection;

    for(i=1; i < pointArray.length; i++) {
        try {
            pp = targetPath[targetPPKey].add();
            pp.anchor         = pointArray[i].anchor;
            pp.leftDirection  = pointArray[i].leftDirection;
            pp.rightDirection = pointArray[i].rightDirection;
            pp.pointType      = PointType.CORNER;
        }
        catch(e) {
            Utils.dump("[copyPathPoints()#targetPath[targetPPKey].add()] " + e.message);
        }
    }
}

/**
 * Converts SVG Path value to cubic bezier points.
 * @param   {string}    svg
 * @returns {Array}
 *
 * @author Malcolm McLean <malcolm@astutegraphics.co.uk>
 */
function svgToPathPointArray(svg)
{
    var result = [];
    var splits = svg.split("C");
    var i;
    var point = {};
    var start = splits[0].slice(1, splits[0].length);
    var starts = start.split(",");
    if(starts.length != 2)
    {
        return [];
    }
    point.anchor = [parseFloat(starts[0]), parseFloat(starts[1])];
    result.push(point);
    point = {};
    for(i=1; i < splits.length;i++)
    {
        point = {};
        segs = splits[i].split(",");
        if(segs.length != 6)
        {
            return [];
        }
        result[i-1].rightDirection = [parseFloat(segs[0]), parseFloat(segs[1])];
        point.leftDirection = [parseFloat(segs[2]), parseFloat(segs[3])];
        point.anchor = [parseFloat(segs[4]), parseFloat(segs[5])];
        result.push(point);
    }
    if(svg.indexOf("Z") >= 0)
    {
        result[0].leftDirection = point.leftDirection;
        point = {};
        if(result.length > 1)
        {
            result.pop();
        }
    }
    else
    {
        result[0].leftDirection = result[0].anchor;
        result[result.length-1].rightDirection = result[result.length-1].anchor;
    }

    return result;

}

/**
 * Converts AI PathItem PathPoints to SVG path value.
 * @param   {PathItem}  path
 * @returns {*}
 *
 * @author Malcolm McLean <malcolm@astutegraphics.co.uk>
 */
function pathItemToSVG(path)
{
    var i;
    var answer = "";
    var ppa;
    var ppb;

    if(path.pathPoints.length == 0)
        return "";


    answer = "M" + path.pathPoints[0].anchor[0].toFixed(2) + "," + path.pathPoints[0].anchor[1].toFixed(2);


    for(i=0;i<path.pathPoints.length-1;i++)
    {
        ppa = path.pathPoints[i];
        ppb = path.pathPoints[i+1];
        answer += "C";
        answer += ppa.rightDirection[0].toFixed(2);
        answer += ",";
        answer += ppa.rightDirection[1].toFixed(2);
        answer += ",";
        answer += ppb.leftDirection[0].toFixed(2);
        answer += ",";
        answer += ppb.leftDirection[1].toFixed(2);
        answer += ",";
        answer += ppb.anchor[0].toFixed(2);
        answer += ",";
        answer += ppb.anchor[1].toFixed(2);
    }

    if(path.closed)
    {
        ppa = path.pathPoints[path.pathPoints.length-1];
        ppb = path.pathPoints[0];
        answer += "C";
        answer += ppa.rightDirection[0].toFixed(2);
        answer += ",";
        answer += ppa.rightDirection[1].toFixed(2);
        answer += ",";
        answer += ppb.leftDirection[0].toFixed(2);
        answer += ",";
        answer += ppb.leftDirection[1].toFixed(2);
        answer += ",";
        answer += ppb.anchor[0].toFixed(2);
        answer += ",";
        answer += ppb.anchor[1].toFixed(2);
        answer += "Z";
    }

    return answer;
}

/**
 * Replace tokens in a string with key => value paired vars.
 * @param theText
 * @param theVars
 * @returns {*}
 * @private
 */
function txt(theText, theVars) {
    for (token in theVars) {
        theText = theText.replace(
            new RegExp("{" + token + "}","g"),
            theVars[token]
        );
    }
    return theText;
}

/**
 * Make sure at least one file type is selected.
 * @returns {bool}
 */
function hasOneFileType() {
    return CONFIG.FILETYPE_SVG || CONFIG.FILETYPE_AI || CONFIG.FILETYPE_EPS || CONFIG.FILETYPE_PDF;
}

/**
 * Cleans up the filename/artboardname.
 * @param   {String}    name    The name to filter and reformat.
 * @returns  {String}            The cleaned up name.
 */
function filterName(name) {
    return decodeURIComponent(name).replace(' ', '-');
}

/**
 * Saves a file in Ai format.
 * @param {string}  dest    Destination folder path
 */
function saveFileAsAi(dest) {
    if (app.documents.length > 0) {
        var options = new IllustratorSaveOptions();
        var theDoc  = new File(dest);
        options.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
        options.pdfCompatible = true;
        app.activeDocument.saveAs(theDoc, options);
    }
}

/**
 * Align objects to nearest pixel.
 * @param   {object}  selection     The selection object
 * @returns  {void}
 */
function alignToNearestPixel(sel) {

    try {
        if (typeof selection != "object") {
            logger.info(Strings.NO_SELECTION);
        }
        else {
            for (i = 0 ; i < selection.length; i++) {
                selection[i].left = Math.round(selection[i].left);
                selection[i].top  = Math.round(selection[i].top);
            }
            redraw();
        }
    }
    catch(ex) {
        logger.error(ex);
    }
}

/**
 * Trims a string.
 * @param   {string}  str     The string to trim
 * @returns  {XML|string|void}
 * @deprecated Use String.trim() instead.
 */
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

/**
 * Centers objects on artboards
 * @returns {void}
 */
function centerObjects() {
    doc = app.activeDocument;

    var doc  = app.activeDocument;
    var progress = showProgressBar(doc.artboards.length);

    for (i=0; i<doc.artboards.length; i++) {

        doc.artboards.setActiveArtboardIndex(i);

        var activeAB = doc.artboards[doc.artboards.getActiveArtboardIndex()];
        var right    = activeAB.artboardRect[2];
        var bottom   = activeAB.artboardRect[3];

        doc.selectObjectsOnActiveArtboard();

        for (x = 0 ; x < selection.length; x++) {
            try {
                selection[x].position = [
                    Math.round((right - selection[x].width)/2),
                    Math.round((bottom + selection[x].height)/2)
                ];
            }
            catch(e) {
                logger.error('ERROR - ' + e.message);
            }
            updateProgress(
                progress,
                CONFIG.ARTBOARD_COUNT,
                Strings.CENTERING_OBJ + i + " of " + CONFIG.ARTBOARD_COUNT + ": `" + activeAB.name + "`"
            );
        }
        redraw();
    }

    progress.close();
}

/**
 * Get board name prefix.
 * @param theFile
 * @param srcFolder
 * @returns {string}
 */
function getArtboardNamePrefix(theFile, srcFolder) {

    var prefix = Folder(theFile.path).absoluteURI.replace(
        Folder(srcFolder).absoluteURI, ""
    );

    var sep = '$';

    prefix = prefix.split('/').join(sep);

    if (prefix.charAt(0) == sep) {
        prefix = prefix.substring(1);
    }

    return prefix; // prefix.split('-').join('');
}

/**
 * Callback for sorting the file list.
 * @param   {File}  a
 * @param   {File}  b
 * @returns {number}
 */
function comparator(a, b) {
    var nameA = filterName(a.name.toUpperCase());
    var nameB = filterName(b.name.toUpperCase());
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    // names must be equal
    return 0;
}


/**
 * Show the progress bar.
 * @param   {int}     maxvalue  The maximum value of the progress counter
 * @returns  {object}            The progress bar object
 */
function showProgressBar(maxvalue) {

    var top, left;

    if ( bounds = Utils.getScreenSize() ) {
        left = Math.abs(Math.ceil((bounds.width/2) - (450/2)));
        top = Math.abs(Math.ceil((bounds.height/2) - (100/2)));
    }

    var progress = new Window("palette", Strings.PROGRESS, [left, top, left + 450, top + 100]);
    progress.pnl = progress.add("panel", [10, 10, 440, 100], "Script Progress");
    progress.pnl.progBar = progress.pnl.add("progressbar", [20, 35, 410, 60], 0, maxvalue);
    progress.pnl.progBarLabel = progress.pnl.add("statictext", [20, 20, 320, 35], "0%");

    progress.show();

    return progress;
}

/**
 * Update the progress bar
 * @param {object}  progress    A progress bar object
 * @param {int}     maxvalue    The maximum value of the progress counter
 * @param {string}  message     The progress bar message
 * @returns {void}
 */
function updateProgress(progress, maxvalue, message) {

    progress.pnl.progBarLabel.text = message;
    progress.pnl.progBar.value++;
    $.sleep(10);
    progress.update();
    return progress;
}

/**
 * Shortcut for JSON.stringify
 * @param   {object}    what    The object to stringify.
 * @returns {string}
 */
function stringify(what) {
    return JSON.stringify(what);
}

/**
 * Appends a string to a base string using a divider.
 * @param   {string} base
 * @param   {string} add
 * @param   {string} divider
 * @returns {string}
 * @deprecated
 */
function pack(base, add, divider) {
    divider = typeof(divider) == 'undefined' ? '/' : divider;
    if (base.charAt(base.length-1) != divider) {
        base += divider;
    }
    return base + add;
}

/**
 * Appends a string to a base string using a divider.
 * @param   {string} path
 * @param   {string} subpath
 * @param   {string} separator
 * @returns {string}
 */
function path(path, subpath, separator) {
    separator = typeof(separator) == 'undefined' ? '/' : separator;
    if (path.charAt(path.length-1) != separator) {
        path += separator;
    }
    return path + subpath;
}

/**
 * Gets the app context.
 * @returns {string}
 */
function getContext() {
    if (typeof CSInterface == 'undefined') {
        return Contexts.HOST;
    }
    return Contexts.CLIENT;
}

/**
 * Read a file.
 * @param theFilePath
 * @returns {*}
 */
function readFileData(theFilePath) {
    var result;
    try {
        if (getContext() == Contexts.HOST) {
            var theFile = new File(theFilePath);
            if (theFile.exists) {
                try {
                    result = {data : theFile.read(), err : 0};
                }
                catch(e) {
                    result = {data : null, err : e.message};
                }
            }
        }

        // We are in the Client context.

        else {
            result = window.cep.fs.readFile(theFilePath);
        }

        if (result.err !== 0) {
            throw new Error("ReadFileError : " + result.err);
        }
        return result.data;
    }
    catch(e) {
        throw new Error(e.message, e.stack);
    }

    return result.data;
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
        var extPath = csInterface.getSystemPath(SystemPath.EXTENSION);
        extension.basePath = slash( extension.basePath );

        if (get(extension, 'basePath', false)) {

            extension.customPath = extension.basePath + 'custom';

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
 * Returns only primitive values.
 * @returns {object}
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
 * Loads user-defined plugins.
 * @param pluginsPath
 */
function loadPlugins(pluginsPath, context) {

    var config,
        plugins;

    try {
        config = JSON.parse(readFileData(pluginsPath + '/plugins.json'));

        plugins = config.plugins;

        console.info(stringify(plugins));

        plugins.map(function(plugin) {
            alert(plugin.name);
            if (! isDefined(plugin)) return;
            if (isString(plugin[context])) {
                try {
                    evalFile(plugin[context]);
                }
                catch(e) {
                    error(e + '[' + plugin[context] + ']')
                }
            }
            else if (isArray(plugin[context])) {
                plugin[context].map(function(script) {
                    try {
                        evalFile([pluginsPath, plugin.name, script].join('/'));
                    }
                    catch(e) {
                        error(e + '[' + script + ']');
                    }
                });
            }
        });
    }
    catch(e) {
        error('[loadPlugins] ' + e);
    }
}

function evalFile(theFile) {
    try {
        if (getContext() == Contexts.HOST) {
            $.evalFile(theFile);
        }
        else {
            var data = readFileData(theFile);
            eval(data);
        }
    }
    catch(e) {
        throw e;
    }
}

/**
 * Replace tokens in a string with key => value paired vars.
 * @param theText
 * @param theVars
 * @returns {*}
 * @private
 */
function _t(theText, theVars) {
    for (var token in theVars) {
        theText = theText.replace(
            new RegExp("{" + token + "}","g"),
            theVars[token]
        );
    }
    return theText;
}

/**
 * Send error message to all outputs.
 * @param message
 * @param vars
 */
function error(message, vars) {
    message = typeof(vars) != 'undefined' ? _t(message, vars) : message ;
    trap(function() { console.error(message);}, null);
    trap(function() { csInterface.evalScript( 'Host.logger.error("' + message + '")' ); }, null);
    trap(function() { Host.logger.error(message); }, null);
}

/**
 * Send info message to all outputs.
 * @param message
 * @param vars
 */
function info(message, vars) {
    message = typeof(vars) != 'undefined' ? _t(message, vars) : message ;
    trap(function() { console.log(message);}, null);
    trap(function() { csInterface.evalScript( 'Host.logger.info("' + message + '")' ); }, null);
    trap(function() { Host.info.error(message); }, null);
}
