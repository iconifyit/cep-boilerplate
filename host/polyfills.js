/**
 * Trim leading and trailing whitespace on a string.
 */
if (! String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

/**
 * Obfuscate a string.
 */
if (! String.prototype.obfuscate) {
    String.prototype.obfuscate = function() {
        return this.replace(/./g, "*");
    };
}

/**
 * Test if a number is an integer.
 */
if (! Number.prototype.isInteger) {
    Number.prototype.isInteger = function() {
        return (Number(this.valueOf() % 1) === 0);
    }
}

/**
 * Add Array.indexOf support if not supported natively.
 */
if (! Array.prototype.indexOf) {
    /**
     * Gets the index of an element in an array.
     * @param what
     * @param i
     * @returns {*}
     */
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

/**
 * Add Array.remove support.
 * @returns {Array}
 */
if (! Array.prototype.remove) {
    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
}

/**
 * Get a value from an object or array.
 * @param   {object|array}    subject
 * @param   {string}          key
 * @param   {*}               fallback
 * @returns {*}
 */
if (! Object.prototype.get) {
    Object.prototype.get = function(key, fallback) {
        var value = fallback;
        if (this.hasOwnProperty(key)) {
            value = this.getProperty(key);
        }
        return value;
    };
}

/**
 * Get a value from an object or array.
 * @param   {object|array}    subject
 * @param   {string}          key
 * @param   {*}               dfault
 * @returns {*}
 */
if (! Object.prototype.set) {
    Object.prototype.set = function(key, value) {
        this.setProperty(key, value);
    };
}

/**
 * Extends {Object} target with properties from {Object} source.
 * @param source
 * NOTE : This function breaks with jQuery.
 */
// if (! Object.prototype.extend) {
//     Object.prototype.extend = function(source) {
//         for (var key in source) {
//             if (! this.hasOwnProperty(key)) {
//                 this[key] = source[key];
//             }
//         }
//     }
// }

/**
 * Updates {Object} target with properties from {Object} source.
 * Any previously set values will be over-written.
 * @param {Object}  source      The source object with new values.
 * @param {Boolean} overwrite   Whether or not new values should replace old values.
 */
if (! Object.prototype.update) {
    Object.prototype.update = function(source, overwrite) {
        if (typeof overwrite === 'undefined') overwrite = true;
        var self = this;
        source.keys().map(function(key) {
            if (! self.hasOwnProperty(key)) {
                self[key] = source[key];
            }
            else if (overwrite) {
                self[key] = source[key];
            }
        });
    }
}

/**
 * Polyfill for Object.keys
 *
 * @see: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
 */
if (! Object.keys) {
    Object.keys = (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function (obj) {
            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

            var result = [];

            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) result.push(prop);
            }

            if (hasDontEnumBug) {
                for (var i=0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                }
            }
            return result;
        }
    })()
};
