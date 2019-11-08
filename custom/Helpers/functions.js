/**
 * Debug output
 * @param label
 * @param message
 */
function debug(label, message) {

    try {
        var strValue;

        if (! isDefined(message)) {
            strValue = '* undefined *';
        }
        else if (isEmpty(message)) {
            strValue = '* empty *';
        }
        else if (isFunction(message)) {
            strValue = 'function() { [native code] }';
        }
        else if (isNumber(message)) {
            strValue = String(message);
        }
        else if (isObject(message)) {
            strValue = '[Object]';
        }
        else {
            strValue = String(message);
        }

        logger.info(label + (! isEmpty(strValue) ? ' : ' + strValue : ''));
    }
    catch(e) {
        alert(e);
    }
}

/**
 * Filter compositions from Project
 * @param items
 * @returns {[]}
 */
function getCompositions(items) {

    var item,
        comps = [];

    for (var i = 1; i <= items.length; i++) {
        item = items[i];
        if (item.typeName.toLowerCase() === 'composition') {
            comps.push(item);
        }
    }

    return comps;
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
                debug('[theItem.' + prop + ']', typeof theItem[prop]);
                info[prop] = String(theItem[prop]);

                (theItem[prop] instanceof Function ? funcs : props).push(prop);
            }
            catch(e) {
                debug('[theItem.' + prop + ']', e.message);
            }
        }

        debug('[properties]', stringify(props));
        debug('[methods]',    stringify(funcs));

        infos.push(info);
    }
    catch(e) {
        debug('Error enumerating props', e.message);
    }

    return { properties : props, methods : funcs }
}

/**
 * Filter compositions from Project
 * @param items
 * @returns {[]}
 */
function getCompositions(items) {

    var item,
        comps = [];

    for (var i = 1; i <= items.length; i++) {
        item = items[i];
        if (item.typeName.toLowerCase() === 'composition') {
            comps.push(item);
        }
    }

    return comps;
}

/**
 * Get the keyFrames for a given property.
 * @param property
 * @returns {[]}
 */
function getKeyFrames(property) {
    var keyFrames = [],
        numKeys   = property.numKeys;

    debug('property.numKeys', property.numKeys);

    for (var i = 1; i <= numKeys; i++) {
        debug(stringify({
            keyTime  : property.keyTime(i),
            keyValue : property.keyValue(i)
        }));

        keyFrames.push({
            keyTime  : property.keyTime(i),
            keyValue : property.keyValue(i)
        });
    }

    return keyFrames;
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
        layers.push(new LayerInfo(theLayer, i));
    }

    return layers;
}

/**
 * Gets selected properties info.
 * @param compItem
 * @returns {[]}
 */
function getSelectedProperties(compItem) {
    var sProps = compItem.selectedProperties;

    var properties    = [],
        numProperties = sProps.length;

    if (numProperties) {
        for (var i = 1; i <= numProperties; i++) {
            properties.push(
                new PropertyInfo(sProps(i), i)
            );
        }
    }

    return properties;
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
