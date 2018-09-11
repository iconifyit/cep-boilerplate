var Configuration = function(CONFIG) {

    var self = new Object();

    /**
     * Get a value from an object or array.
     * @param   {object|array}    subject
     * @param   {string}          key
     * @param   {*}               dfault
     * @returns {*}
     */
    self.prototype.get = function( key, dfault ) {
        var value = dfault;
        if (this.hasOwnProperty(key)) {
            value = this[key];
        }
        return value;
    };

    /**
     * Get a value from an object or array.
     * @param   {object|array}    subject
     * @param   {string}          key
     * @param   {*}               dfault
     * @returns {*}
     */
    self.prototype.set = function( key, value ) {
        this[key] = value;
    };

    /**
     * Extends {Object} target with properties from {Object} source.
     * @param target
     * @param source
     */
    self.prototype.extend = function(source) {
        for (var key in source) {
            if (this.get(key, false)) {
                continue;
            }
            this[key] = source[key];
        }
    };

    /**
     * Updates {Object} target with properties from {Object} source.
     * Any previously set values will be over-written.
     * @param {Object}  source      The source object with new values.
     * @param {Boolean} overwrite   Whether or not new values should replace old values.
     */
    self.prototype.update = function(source, overwrite) {
        if (typeof(overwrite) == undefined) {
            overwrite = true;
        }
        for (var key in source) {
            if (this.hasOwnProperty(key)) {
                if (! overwrite && this.get(key, false)) {
                    continue;
                }
                this[key] = source[key];
            }
        }
    };

    self.extend(CONFIG);

    return self;

};

