/**
 * Base Helper class. You should not use this class directly
 * but create derived classes which provide an array _KEYS
 * of the property and function names.
 * @param theItem
 * @constructor
 */
var BaseHelper = function(theItem) {

    var _properties = {};

    for (var key in _KEYS) {
        if (typeof theItem[key] !== 'undefined') {
            _properties[key] = theItem[key];
        }
    }

    /**
     * Get a value of property.
     * @param   {string}    key         The name of the property to get the value of.
     * @param   {*}         fallback    The default value if item.prop is not found.
     * @returns {*}
     */
    this.get = function(key, fallback) {
        if (_properties.hasOwnProperty(key)) {
            return _properties[key];
        }
        return fallback;
    }

    /**
     * Add a property
     * @param propName
     */
    this.addProperty = function(propName) {
        _properties.push(propName);
    }

    /**
     * Add a function
     * @param funcName
     */
    this.addFunction = function(funcName) {
        _functions.push(funcName);
    }

    /**
     * Gets the functions of a Composition item.
     * @returns {*[]}
     */
    this.getFunctions = function() {
        return _functions;
    }

    /**
     * Gets the properties of a Composition item.
     * @returns {{}}
     */
    this.getProperties = function() {
        return _KEYS;
    }

    /**
     * Gets the properties of a Composition item.
     * @returns {{}}
     */
    this.valueOf = function() {
        return _properties;
    }

    /**
     * Test if the item has a given property.
     * @param key
     * @returns {boolean}
     */
    this.hasProperty = function(key) {
        return _properties.hasOwnProperty(key);
    }

    /**
     * Test if the item has a given function.
     * @param name
     * @returns {boolean}
     */
    this.hasFunction = function(name) {
        return _functions.indexOf(name) !== -1;
    }
}

if (typeof console !== 'undefined') {
    console.log('BaseHelper loaded');
}
else if (debug instanceof Function) {
    debug('BaseHelper loaded');
}
