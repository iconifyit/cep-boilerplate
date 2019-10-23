/**
 * Base function to define getters/setters for all objects.
 * @param options
 * @constructor
 */
var Base = function(options) {

    return new Function().extend(options);
}

/**
 * Get a value from an object or array.
 * @param   {object|array}    subject
 * @param   {string}          key
 * @param   {*}               fallback
 * @returns {*}
 */
Base.prototype.get = function(key, fallback) {
    var value = fallback;
    if (this.hasOwnProperty(key)) {
        value = this[key];
    }
    return value;
};

/**
 * Set a member value.
 * @param key
 * @param value
 * @returns {*}
 */
Base.prototype.set = function(key, value) {
    this[key] = value;
    return this[key];
}

/**
 * Test if an object has a given property.
 * @param   {string}          key
 * @returns {boolean}
 */
Base.prototype.has = function(key) {
    return this.hasOwnProperty(key);
};

/**
 * Extends {Object} target with properties from {Object} source.
 * No new properties are added to the object meaning only properties that
 * exist in both source and target will be updated.
 * @param source
 * @returns {*}
 */
Base.prototype.update = function(source) {
    for (key in source) {
        if (this.hasOwnProperty(key)) {
            this[key] = source[key];
        }
    }
    return this;
};

/**
 * Extends {Object} target with properties from {Object} source.
 * Any values that are already set will not be updated. New properities
 * will be added to the object.
 * @param source
 * @returns {*}
 */
Base.prototype.extend = function(source) {
    for (key in source) {
        if (this.get(key, false)) {
            continue;
        }
        this[key] = source[key];
    }
    return this;
};
