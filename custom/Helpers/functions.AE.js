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
 * Inspect an object hierarchy.
 * @param subject
 * @returns {string|*}
 */
function inspect(subject) {
    var output = "\n******* BEGIN INSPECT *******\n";

    try {
        var props = subject.reflect.properties;
        for (var x = 0; x < props.length; x++) {
            var key = props[x].name;
            debug('[CompItem][reflect][' + key + ']', subject[key]);
        }

        var funcs = subject.reflect.methods;
        for (var x = 0; x < funcs.length; x++) {
            var fn = funcs[x].name;
            debug('[CompItem][reflect][' + fn + ']', subject[fn].toString());
        }
    }
    catch(e) {debug('[ERROR]', e.message)}

    output +=  "\n******* END INSPECT *******\n";
    return output;
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
 * Get all CompItems.
 * @returns {[]}
 */
function getAllCompositions() {
    var comps = [];
    for (var i = 1; i <= app.project.numItems; i++) {
        if (app.project.item(i) instanceof CompItem) {
            comps.push(app.project.item(i));
        }
    }
    return comps;
}

/**
 * Test if a layer has any nested keyFrames.
 * @param theLayer
 */
function hasAnyKeyFrames(theLayer) {
    var properties = countNestedKeyFrames(theLayer) > 0;
}

/**
 * Count all nested keyFrames.
 * @param theLayer
 * @returns {*}
 */
function countNestedKeyFrames(theLayer) {

    var count;

    function walkProperties(theProp) {
        if (theProp.propertyType === PropertyType.PROPERTY) {
            count += theProp.numKeys;
        }
        else {
            for (var i = 1; i <= theProp.numProperties; i++) {
                walkProperties(theProp.property(i));
            }
        }
    }

    for (var i = 1; i <= theLayer.numProperties; i++) {
        count += theItem.property(i).keyCount;
        walkProperties(theItem.property(i));
    }

    return count;
}

/**
 * Get the list of LayerInfo items
 * @param compItem
 * @returns {[]}
 */
function getLayerInfos(compItem) {
    var theLayer,
        layers = [];

    for (var i = 1; i <= compItem.numLayers; i++) {
        theLayer = compItem.layer(i);
        if (! isAnimatable(theLayer)) continue;
        // if (! hasAnyKeyFrames(theLayer)) continue;
        layers.push(new LayerInfo(theLayer, i, compItem));
    }

    return layers;
}

/**
 * Test if the given type can be animated.
 * @param   {Layer}     theLayer
 * @returns {boolean}
 */
function isAnimatable(theLayer) {
    return ( NonAnimatableLayerTypes.indexOf(theLayer.type) === -1 );
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

function getPropertyTypeName(theType) {
    var PropertyTypes = {};
    PropertyTypes[PropertyType.PROPERTY]      = 'PROPERTY';
    PropertyTypes[PropertyType.INDEXED_GROUP] = 'INDEXED_GROUP';
    PropertyTypes[PropertyType.NAMED_GROUP]   = 'NAMED_GROUP';
    return get(PropertyTypes, theType, theType);
}

/**
 * Gets a flat array of all property objects.
 * @param theProp
 * @returns {[]|*}
 */
function getAllProperties(theItem) {

    function getProperties(theProp) {
        var properties = [];

        if (theProp.propertyType === PropertyType.PROPERTY) {
            return theProp;
        }
        // Must be a Property group
        else {
            for (var i = 1; i <= theProp.numProperties; i++) {
                properties.push(
                    getProperties(theProp.property(i))
                );
            }
        }

        return properties;
    }

    var properties    = [],
        numProperties = get(theItem, 'numProperties', 0);

    for (var i = 1; i <= numProperties; i++) {
        properties.push( getProperties(theItem.property(i)) );
    }

    return properties;
}

/**
 * Is the Property an indexedGroup property type.
 * @param theProp
 * @returns {boolean}
 */
function isIndexedGroup(theProp) {
    return theProp.propertyType === PropertyType.INDEXED_GROUP;
}

/**
 * Is the Property an Named Group property type.
 * @param theProp
 * @returns {boolean}
 */
function isNamedGroup(theProp) {
    return theProp.propertyType === PropertyType.NAMED_GROUP;
}

/**
 * Is the Property a single property.
 * @param theProp
 * @returns {boolean}
 */
function isPropertyProperty(theProp) {
    return theProp.propertyType === PropertyType.PROPERTY;
}

/**
 * Is the Property a property group.
 * @param theProp
 * @returns {boolean}
 */
function isPropertyGroup(theProp) {
    return (
        (theProp.propertyType === PropertyType.INDEXED_GROUP) ||
        (theProp.propertyType === PropertyType.NAMED_GROUP)
    );
}

/**
 * Process a property group.
 * @param theProp
 * @returns {Array}
 */
function processGroup(theProp) {
    var properties = [];

    if (isPropertyGroup(theProp)) {
        try {
            for (var i = 1; i <= theProp.numProperties; i++) {
                if (isPropertyProperty(theProp.property(i))) {
                    properties.push(theProp.property(i));
                }
                else if (isPropertyGroup(theProp.property(i))) {
                    properties = Array.prototype.concat(
                        properties,
                        processGroup(theProp.property(i))
                    );
                }
            }
        }
        catch(e) { debug('[ERROR - PropertyGroup]', e.message);  }
    }
    return properties;
}

/**
 * Process a layer's properties.
 * @param {Layer}       theLayer    The current Layer being processed.
 * @param {CompItem}    compItem    The current CompItem being processed.
 * @returns {*[]}
 */
function processLayerProperties(theLayer, compItem) {
    var properties = [];

    debug('[processLayerProperties]', 'Processing layer ' + theLayer.name);
    // debug('[processLayerProperties]', theLayer.name + ' has ' + theLayer.numProperties + ' properties');

    for (var i = 1; i <= theLayer.numProperties; i++) {
        try {
            var theProp = theLayer.property(i);

            // debug('[processLayerProperties]', 'Checking property ' + theProp.name);

            if (isPropertyProperty(theProp)) {
                // debug('[processLayerProperties]',  theProp.name + ' is a PROPERTY');
                properties.push(theProp);
            }
            else if (isPropertyGroup(theProp)) {
                // debug('[processLayerProperties]',  theProp.name + ' is a GROUP');
                properties = Array.prototype.concat(
                    properties,
                    processGroup(theProp)
                );
            }
        }
        catch(e) { debug('[ERROR][processLayerProperties][for loop]', e.message) }

        // debug('[processLayerProperties]',  'properties now has ' + properties.length + ' items');
    }

    // debug('[processLayerProperties]', 'Finished layer ' + theLayer.name);

    return getPropertyInfos(properties, compItem, theLayer);
}

/**
 * Get PropertyInfo objects for properties.
 * @param {Property[]}  properties  The Properties array.
 * @param {CompItem}    compItem    The current CompItem being processed.
 * @returns {[]}
 */
function getPropertyInfos(properties, compItem, theLayer) {

    // debug('[getPropertyInfos]', 'Properties array flattened. Getting Property details.');

    var cleaned = [];
    for (var i = 0; i < properties.length; i++) {

        // debug('[getPropertyInfos]', 'Checking property ' + i);

        if (! properties[i].numKeys) {

            // debug('[getPropertyInfos]', 'Property ' + i + ' has no keys. Skipping to next');

            continue;
        }

        // debug('[getPropertyInfos]', 'Property ' + i + ' has keyframes. Getting animation details.');

        var propInfo = new PropertyInfo(properties[i], i, compItem, theLayer);

        if (! isEmpty(propInfo) && ! isFalse(propInfo)) {
            // debug('[getPropertyInfos]', 'Adding property ' + i + ' to final output');
            cleaned.push(propInfo);
        }
    }
    return cleaned;
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

function translateKeyData(keyData) {

    var k, kLen, perc, jLen, j = 0, fnc;

    var bez = BezierHelper;

    keyData.h = keyData.h || 0;

    if (keyData.to) {

        debug('keyData.to', keyData.to);

        var bezierData = bez.buildBezierData(keyData);

        debug('typeof bezierData', typeof bezierData);
        debug('bezierData', stringify(bezierData));
    }
    else {

        debug('keyData.to === undefined');

        var outX, outY, inX, inY, isArray = false, keyValue;

        len = (keyData.s.length || 0);

        for (var i = 0; i < len; i++) {
            debug('beziers loop ' + i);

            if (keyData.h !== 1) {
                debug('beziers loop ' + i, 'keyData.h !== 1');

                if (keyData.o.x instanceof Array) {

                    debug('beziers loop ' + i, 'keyData.o.x instanceof Array == true');

                    isArray = true;
                    if (typeof keyData.__fnct === 'undefined') {
                        debug('beziers loop ' + i + ' A');
                        keyData.__fnct = [];
                    }
                    if (! keyData.__fnct[i]) {
                        debug('beziers loop ' + i + ' B');
                        outX = keyData.o.x[i] || keyData.o.x[0];
                        outY = keyData.o.y[i] || keyData.o.y[0];
                        inX = keyData.i.x[i] || keyData.i.x[0];
                        inY = keyData.i.y[i] || keyData.i.y[0];
                    }
                }
                else {
                    debug('beziers loop ' + i + ' C');
                    isArray = false;
                    if (typeof keyData.__fnct === 'undefined') {
                        debug('beziers loop ' + i + ' D');
                        outX = keyData.o.x;
                        outY = keyData.o.y;
                        inX = keyData.i.x;
                        inY = keyData.i.y;
                    }
                }

                debug('beziers loop ' + i + ' A-D', stringify(keyData));

                if (isArray) {
                    debug('beziers loop ' + i + ' E');
                    if (typeof keyData.__fnct !== 'undefined') {
                        debug('beziers loop ' + i + ' F');
                        fnc = keyData.__fnct[i];
                    }
                    else {
                        debug('beziers loop ' + i + ' G');
                        try {
                            fnc = bez.getEasingCurve(outX, outY, inX, inY);
                            keyData.__fnct[i] = fnc;
                        }
                        catch(e) {
                            debug('[ERROR] beziers loop ' + i + ' G (getEasingCurve)', e.message);
                        }
                    }
                    debug('[keyData.__fnct]', fnc.toString());
                }
                else {
                    debug('beziers loop ' + i + ' H');
                    if (typeof keyData.__fnct !== 'undefined') {
                        debug('beziers loop ' + i + ' I');
                        fnc = keyData.__fnct;
                    }
                    else {
                        debug('beziers loop ' + i + ' J');
                        try {
                            fnc = bez.getEasingCurve(outX, outY, inX, inY);
                            keyData.__fnct  = fnc;
                        }
                        catch(e) {
                            debug('[ERROR] beziers loop ' + i + ' J (getEasingCurve)', e.message);
                        }
                    }
                    debug('[keyData.__fnct]', fnc.toString());
                }

                debug('beziers loop ' + i + ' E-J', stringify(keyData));

            }

            debug('beziers loop ' + i + ' K');

            perc = 1;

            try {
                debug('beziers loop ' + i + ' K - keyData',   stringify(keyData));
                debug('beziers loop ' + i + ' K - keyData.h', stringify(keyData.h));
                debug('beziers loop ' + i + ' K - keyData.s', stringify(keyData.s));
                debug('beziers loop ' + i + ' K - keyData.e', stringify(keyData.e));

                keyValue = keyData.h === 1 ? keyData.s[i] : keyData.s[i] + (keyData.e[i] - keyData.s[i]) * perc;

                debug('beziers loop ' + i + ' K - keyValue', stringify(keyValue));
            }
            catch(e) {
                debug('[ERROR] beziers loop ' + i + ' K', e.message);
            }
        }
    }

    return keyData;
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
 * Calculate the curve of a quadratic bezier.
 * @param {point}       p0
 * @param {point}       p1
 * @param {point}       p2
 * @param {float[0-1]}  t
 * @returns {{x: number, y: number}}
 */
var QuadraticBezier = function(p0, p1, p2, t) {
    return new Point(
        Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x,
        Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y
    );
}

/**
 * Returns a Cubic Bezier
 * @param p0
 * @param p1
 * @param t
 * @returns {{x: *, y: *}}
 * @constructor
 */
var CubicBezier = function(p0, p1, p2, p3, t) {
    return new Point(
        Math.pow(1 - t, 3) * p0.x + Math.pow(1 - t, 2) * 3 * t * p1.x + (1 - t) * 3 * t * t * p2.x + t * t * t * p3.x,
        Math.pow(1 - t, 3) * p0.y + Math.pow(1 - t, 2) * 3 * t * p1.y + (1 - t) * 3 * t * t * p2.y + t * t * t * p3.y
    );
}

/**
 * @param {float} t   Time
 * @param {float} B   Begin
 * @param {float} c   Change
 * @param {float} d   Duration
 */
var PennersFormula = function(t, b, c, d) {
    return b + c * ((t /= d) * t * t * t * t);
}

var Penner = {
    easeInQuad : function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },

    easeInOutSine : function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
}

/**
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


