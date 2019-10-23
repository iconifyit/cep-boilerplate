/**
 * PresetsError class.
 * @param message
 * @param stack
 * @constructor
 */
var WritableError = function(message, stack) {
    this.name    = "WritableError";
    this.message = message || "Unknown WritableError";
    this.stack   = stack;
};
WritableError.prototype = Error.prototype;

/**
 * Writable object class.
 * @param options
 * @constructor
 */
var Writable = function(options) {
    try {
        this.setDatasource(options.get('dataFile'));
        this.load();
    }
    catch(e) {
        throw new WritableError(e)
    }
}

/**
 * Saves form presets.
 * @param {string} presetValues
 */
Writable.prototype.save = function() {
    var result;
    try {
        result = window.cep.fs.writeFile(
            this.getDatasource(),
            this.toJSON(),
            cep.encoding.UTF8
        );
    }
    catch(e) {
        throw new PresetsError(e);
    }
}

/**
 * Test if datasource exists.
 * @returns {boolean}
 */
Writable.prototype.exists = function() {
    var result = window.cep.fs.readFile(
        this.getDatasource(),
        cep.encoding.UTF8
    );
    return result.err === 0;
}

/**
 * get the saved presets.
 * @returns {Object}
 */
Writable.prototype.load = function() {
    var result, presets = {};

    try {
        console.log('this.getDatasource()', this.getDatasource());
        result = window.cep.fs.readFile(
            this.getDatasource(),
            cep.encoding.UTF8
        );

        if (result.data && result.err === 0) {
            presets = JSON.parse(result.data);
            this.init(presets);
        }
        else {
            throw new WritableError('Writable read error : ' + result.err);
        }
    }
    catch(e) {
        throw new WritableError(e);
    }

    return presets;
}

/**
 * Updates the Presets.
 * @param values
 */
Writable.prototype.update = function(values) {
    console.log('Calling Presets.update', values);
    this.init(values);
    this.save();
}

/**
 * @returns {string}
 */
Writable.prototype.getDatasource = function() {
    return this.datasource;
}

/**
 * @param datasource
 */
Writable.prototype.setDatasource = function(datasource) {
    this.datasource = datasource;
}

/**
 * @param datasource
 */
Writable.prototype.initDatasource = function(datasource) {
    this.datasource = datasource;
}
