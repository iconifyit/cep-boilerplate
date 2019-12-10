/**
 * Debug output
 * @param label
 * @param message
 */
function debug(label, message) {
    if (typeof DEBUG === 'undefined' || DEBUG == false) return;

    try {
        var strValue;

        if (! isDefined(message)) {
            strValue = '';
        }
        else if (isEmpty(message)) {
            strValue = '';
        }
        else if (isFunction(message)) {
            strValue = 'function() { [native code] }';
        }
        else if (isNumber(message)) {
            strValue = String(message);
        }
        else if (isObject(message)) {
            try {
                strValue = stringify(message);
            }
            catch(e) {
                strValue = '[object]';
            }
        }
        else {
            strValue = String(message);
        }

        logger.info(label + (! isEmpty(strValue) ? ' : ' + strValue : ''));
    }
    catch(e) {
        logger.error('[ERROR in debug()] - ' + e.message);
    }
}

/**
 * Open a file.
 * @param filepath
 */
function openFile(filepath) {
    try {
        debug('[EXECUTE]', filepath);
        new File(filepath).execute();
    }
    catch(e) {
        debug('[ERROR]', e.message);
        alert(e.message);
    }
}

/**
 * Get all property and method names from an object.
 * @param comp
 */
function getPropertiesAndMethods(theItem) {

    var props = [],
        funcs = [];

    try {
        for (var prop in theItem) {
            try {
                debug('[theItem.' + prop + '] ' + typeof theItem[prop]);
                (theItem[prop] instanceof Function ? funcs : props).push(prop);
            }
            catch(e) {
                debug('[theItem.' + prop + '] ' + e.message);
            }
        }
    }
    catch(e) {
        debug('[Error enumerating props]', e.message);
    }

    return { properties : props, methods : funcs }
}

/**
 * Generic getter
 * @param   {object}    subject
 * @param   {string}    key
 * @param   {*}         fallback
 * @returns {*}
 */
if (! (get instanceof Function)) {
    function get(subject, key, fallback) {
        var value = fallback;
        if (typeof subject[key] !== 'undefined') {
            value = subject[key];
        }

        debug('[Subject.' + key + ']', value);

        return value;
    }
}

/**
 * Logical OR
 * @param test
 * @param fallback
 * @returns {*}
 */
function xor(test, fallback) {
    return test || fallback;
}

/**
 * Tests `test` value. If empty returns zero `0`
 * @param test
 * @returns {*|number}
 */
function xor0(test) {
    var result = test;
    if (typeof test === 'undefined') result = 0;
    if (test === null) result = 0;
    if (! isNaN(test) && ! test) result = 0;
    return result;
}

/**
 * Force a value to a number.
 * @param value
 * @returns {number}
 */
function insureNumber(value) {
    if (isNaN(parseInt(value))) value = 0;
    return value;
}

/**
 * Creates a string padded with `char`
 * @param   {string}    str     The string to be padded.
 * @param   {string}    char    The character or string to pad with.
 * @param   {int}       len     The length of the final, padded string.
 * @returns {string}
 */
function pad(str, fill, len) {
    var diff = parseInt((len - str.length) / 2);
    var _pad = new Array(str.length ? diff : len).join( fill );
    return (str.length ? [_pad, str, _pad].join(' ') : _pad);
}

/**
 * A point object.
 * @param x
 * @param y
 * @returns {{x: *, y: *}}
 * @constructor
 */
var Point = function(x, y) {
    return {
        x : x,
        y : y
    }
}

/**
 * Hernan Torrisi's method for translating easing to cubic bezier curves.
 * NOTE: This only works with one-dimensional properties.
 * @author      Hernan Torrisi
 * @url         https://forums.creativecow.net/docs/forums/post.php?forumid=227&postid=27968&univpostid=27968&pview=t
 * @param       {property} property
 * @returns     {{easeIn: {speed: *, influence: *}, time: *, value: *}}
 * @constructor
 */
var HernanTorrisiMethod = function(property) {

    var duration, diff, averageSpeed, bezierIn, bezierOut;

    var key = {
        time   : property.keyTime(2),
        value  : property.keyValue(2),
        easeIn : {
            influence : property.keyInTemporalEase(2)[0].influence,
            speed : property.keyInTemporalEase(2)[0].speed
        }
    }

    debug('HernanTorrisiMethod.key', key);

    var lastKey = {
        time    : property.keyTime(1),
        value   : property.keyValue(1),
        easeOut : {
            influence : property.keyOutTemporalEase(1)[0].influence,
            speed : property.keyOutTemporalEase(1)[0].speed
        }
    }

    debug('HernanTorrisiMethod.lastKey', lastKey);

    duration = key.time - lastKey.time;
    diff     = key.value - lastKey.value;
    averageSpeed = diff/duration;

    key.bezierIn = {
        x : round(key.easeIn.influence / 100, 2),
        y : round(1 - (key.easeIn.speed / averageSpeed) * (key.easeIn.influence / 100), 2)
    };

    debug('HernanTorrisiMethod.key.bezierIn', key.bezierIn);

    key.bezierOut = {
        x : round(lastKey.easeOut.influence / 100, 2),
        y : round((lastKey.easeOut.speed / averageSpeed) * (lastKey.easeOut.influence / 100), 2)
    };

    debug('HernanTorrisiMethod.key.bezierOut', key.bezierOut);

    return key;
}

/**
 * Manny Gonzalez's method for converting easing to cubic bezier curves.
 * NOTE: This only works with one-dimensional properties.
 * @url https://forums.creativecow.net/docs/forums/post.php?forumid=227&postid=27968&univpostid=27968&pview=t
 * @param property
 * @returns {[number|*, number|*, number|*, number|*]}
 * @constructor
 */
var MannyGonzalezMethod = function(property) {

    var x1, y1, x2, y2;
    var t1, t2, v1, v2, delta_t, delta, avSpeed;

    if (property.numKeys > 1) {
        for (var i = 1; i < property.numKeys; i++) {

            t1      = property.keyTime(i);
            t2      = property.keyTime(i+1);
            v1      = property.keyValue(i);
            v2      = property.keyValue(i+1);
            delta_t = t2-t1;
            delta   = v2-v1;
            avSpeed = Math.abs(v2-v1)/(t2-t1);

            var easeOut = property.keyOutTemporalEase(i)[0],
                easeIn  = property.keyInTemporalEase(i+1)[0];

            if (v1 < v2) {
                x1 = easeOut.influence /100;
                y1 = x1 * easeOut.speed / avSpeed;

                x2 = 1 - easeIn.influence /100;
                y2 = 1 - (1 - x2) * (easeIn.speed / avSpeed);
            }
            if (v2 < v1) {
                x1 = easeOut.influence /100;
                y1 = (-x1) * easeOut.speed / avSpeed;
                x2 = easeIn.influence /100;
                y2 = 1 + x2 * (easeIn.speed / avSpeed);
                x2 = 1 - x2;
            }
            if (v1 == v2) {
                x1 = easeOut.influence /100;
                y1 = (-x1) * easeOut.speed / ((property.maxValue - property.minValue)/(t2 - t1)) ;
                x2 = easeIn.influence /100;
                y2 = 1 + x2 * (easeIn.speed / ((property.maxValue - property.minValue)/(t2 - t1)));
                x2 = 1 - x2;
            }
        }
    }

    return [
        round(x1, 2),
        round(y1, 2),
        round(x2, 2),
        round(y2, 2)
    ];
}

/**
 * NOT WORKING CURRENTLY!.
 * calculate and return cubic bezier text string
 * @param {property} obj - property object
 * @url https://github.com/iconifyit/inspectorspacetime
 */
function SpaceTimeMethod(property) {
    var dims, k1, k2, change, keyOutSp, keyInSp, y1Mult, y2Mult;
    var x1, y1, x2, y2;
    var startEase, endEase;
    var result = [];

    try {
        // count the property dimension
        dims = (property.value instanceof Array) ? property.value.length : 1;


        // initalize first key
        k1   = property.startValue;

        // initalize last key
        k2   = property.endValue;

        change = (dims == 1 || property.propertyType == PropertyType.PROPERTY)
            ? k2 - k1
            : Math.sqrt( Math.pow(k2[0] - k1[0], 2) + Math.pow(k2[1] - k1[1], 2) );

        debug('[SpaceTimeMethod][dims, k1, k2, change]', stringify([dims, k1, k2, change]));

        startEase = property.startTemporalEase;
        endEase   = property.endTemporalEase;

        keyOutSp = (startEase.speed < 0) ? property.startTemporalEase.speed : -property.startTemporalEase.speed;
        y1Mult   = (startEase.speed < 0) ? 1 : -1;
        keyInSp  = (endEase.speed < 0) ? property.endTemporalEase.speed : -property.endTemporalEase.speed;
        y2Mult   = (endEase.speed > 0) ? 1 : -1;

        debug('[SpaceTimeMethod][keyOutSp, keyinSp, y1Mult, y2Mult]', stringify([keyOutSp, keyinSp, y1Mult, y2Mult]));

        x1 = startEase.influence/100;
        y1 = ((keyOutSp * x1) * property.duration/change) * y1Mult;
        x2 = 1 - property.endTemporalEase.influence/100;
        y2 = 1 - ((keyInSp * (x2 - 1)) * property.duration/change) * y2Mult;

        debug('[SpaceTimeMethod][x1, y1, x2, y2]', stringify([x1, y1, x2, y2]));

        // check type of keys

        try {
            if (property.startEaseType == KeyframeInterpolationType.LINEAR && property.endEaseType == KeyframeInterpolationType.LINEAR) {
                // return if linear keys
                result = 'Linear';
            }
            else if (property.startEaseType == KeyframeInterpolationType.HOLD) {
                // return if no change
                result = 'Hold';
            }
            else if (isNaN(y1)) {
                // return if no change
                result = 'No Change';
            }
            else {
                // return cubic bezier
                result = [
                    round(x1, 2),
                    round(y1, 2),
                    round(x2, 2),
                    round(y2, 2)
                ];
            }
        }
        catch(e) {
            debug('[ERROR][SpaceTimeMethod - key types]', e.message);
        }
    }
    catch(e) {
        debug('[ERROR][SpaceTimeMethod]', e.message);
    }
    return result;
}


