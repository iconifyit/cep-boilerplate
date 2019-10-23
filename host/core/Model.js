
logger.info('Config before Model creation ' + JSON.stringify(Config));


/**
 * @param options
 * @constructor
 */
var Model = function(settings_file, defaults) {

    try {
        logger.info('New Model with source : ' + settings_file);

        /**
         * Preset fields.
         * @type {{}}a
         */
        this.fields = {};

        /**
         * @type {{
         * }}
         */
        this.defaults = defaults || {};

        /*
         * Add extension name.
         */
        this.add('name', Config.APP_NAME);

        /*
         * Initialize any unset values with defaults.
         */
        this.fields = merge(this.fields, this.defaults, false);

        /**
         * Stream object.
         * @type {{}}
         * @private
         */
        this._stream = {};

        /*
         * Set Stream object.
         */
        this.setStream(new Stream(settings_file));

        /**
         * Set the data source.
         */
        this.setDatasource(settings_file);

        /**
         * The log folder object.
         * @type {Folder}
         */
        this.folder = new Folder(Config.PRESETS);

        /*
         * Create the log folder if it does not exist.
         */
        if (! this.folder.exists) {
            this.folder.create();
        }

        /**
         * Data source file.
         * @type {File}
         */
        this.file = new File(settings_file);

        /*
         * Make sure there is a settings file to read/write.
         */
        if (! this.exists()) {
            this.save();
        }

        /*
         * Load the settings data.
         */
        this.load();

    }
    catch(e) {
        throw new ModelError('Preset constructor : ' + e)
    }
}

/**
 * Get default options.
 * @returns {object} options
 */
Model.prototype.getDefaults = function() {
    return this.defaults || {};
}

/**
 * Set default options.
 * @param {object} options
 */
Model.prototype.init = function(options) {

    logger.info('Calling Model.init with ' + options);

    for (var key in options) {
        this.fields[key] = options[key];
    }

    return this.getValues();
}

/**
 * @returns {string}
 */
Model.prototype.toString = function() {
    return JSON.stringify(this.getValues());
}

/**
 * @returns {any}
 */
Model.prototype.toJSON = function() {
    return JSON.parse(
        JSON.stringify(
            this.getValues()
        )
    )
}

/**
 * Get the field values as a simple object.
 * @returns {{
 *     spacing   : (Integer|number),
 *     filename  : String,
 *     folder    : String,
 *     width     : (Integer|number),
 *     filetypes : String[],
 *     scale     : (Integer|number),
 *     logging   : Integer,
 *     sort      : Integer,
 *     height    : (Integer|number)
 * }}
 */
Model.prototype.getValues = function() {
    return this.fields;
};

/**
 * Get the field values as a simple object.
 * @returns {{
 *     spacing   : (Integer|number),
 *     filename  : String,
 *     folder    : String,
 *     width     : (Integer|number),
 *     filetypes : String[],
 *     scale     : (Integer|number),
 *     logging   : Integer,
 *     sort      : Integer,
 *     height    : (Integer|number)
 * }}
 */
Model.prototype.valueOf = function() {
    return this.fields;
};

/**
 * @returns {string}
 */
Model.prototype.getDatasource = function() {
    return this.datasource;
}

/**
 * @param datasource
 */
Model.prototype.setDatasource = function(datasource) {
    this.datasource = datasource;
}

/**
 * Saves form model.
 * @param {string} presetValues
 */
Model.prototype.save = function() {
    try {

        this.getStream().remove();

        var result = this.getStream().write(
            this.toString()
        );

        if (result.err === 1) {
            throw new ModelSaveError(result.data);
        }
        else if (result.err === 2) {
            throw new ModelFileNotFound('No such file : ' + this.getDatasource());
        }
        else if (result.err === 3) {
            throw new ModelWriteError(result.data);
        }
        else if (result.err === 4) {
            throw new ModelSaveError(result.data);
        }
        else if (result.err === 5) {
            throw new ModelSaveError(result.data);
        }
        else if (result.err === 6) {
            throw new ModelSaveError(result.data);
        }
        else if (! this.exists()) {
            throw new ModelError(result.data);
        }

        return true;
    }
    catch(e) {
        throw new ModelSaveError(e);
    }
}

/**
 * Updates the Model.
 * @param values
 */
Model.prototype.update = function(values) {
    logger.info('Calling Model.update ' + values);
    this.init(values);
    this.save();
}

/**
 * test if data file exists.
 * @returns {*}
 */
Model.prototype.exists = function(filepath) {
    return this.getStream().exists(filepath);
}

/**
 * get the saved model.
 * @returns {Object}
 */
Model.prototype.load = function() {
    var result, model = {};

    try {

        logger.info('this.getDatasource() ' + this.getDatasource());

        if (! this.exists()) {
            throw new ModelFileNotFound('The model file was not found');
        }
        else {
            result = this.getStream(this.getDatasource()).read();

            if (result.data && result.err === 0) {
                model = JSON.parse(result.data);
                this.init(model);
            }
            else {
                throw new ModelLoadError(result.err);
            }
        }
    }
    catch(e) {
        throw new ModelLoadError(e.message);
    }

    return model;
}

/**
 * Initialize the data file.
 */
Model.prototype.initDataSource = function(datasource) {
    try {
        logger.info('Set datasource to ' + datasource);

        this.setDatasource(datasource);

        logger.info('Set Model stream object');

        this.setStream(
            new Stream(datasource)
        )

        logger.info( 'Stream : ' + typeof this.getStream() );

        logger.info('Model test file exists');

        if (this.exists()) {
            logger.info(datasource + ' already exists. Skipping.');
            return;
        }

        logger.info(datasource + ' does not exist. Creating it.');

        this.getStream().write(
            JSON.stringify(this.getDefaults())
        );
    }
    catch(e) {
        throw new ModelInitDatasourceError(e);
    }
}

/**
 * Set Stream object.
 * @param {Stream} theStream
 */
Model.prototype.setStream = function(theStream) {
    this._stream = theStream;
}

/**
 * Get stream object.
 * @returns {Stream}
 */
Model.prototype.getStream = function() {
    return this._stream;
}

/**
 * Add preset field.
 * @param   {string}    key
 * @param   {*}         value
 */
Model.prototype.add = function(key, value) {
    return this.setFieldValue(key, value);
}

/**
 * Set field value.
 * @param   {string}    key
 * @param   {*}         value
 */
Model.prototype.set = function(key, value) {
    return this.setFieldValue(key, value);
}

/**
 * Get field value. Alias for Model.getFieldValue
 * @param   {string}    key
 * @param   {*}         fallback
 */
Model.prototype.get = function(key, fallback) {
    return this.getFieldValue(key, fallback);
}

/**
 * Remove preset field.
 * @param keys
 */
Model.prototype.remove = function(keys) {

    if (typeof keys === 'string') {
        keys = [keys];
    }

    keys.map(function(key) { return key.toLowerCase() });

    var tmpFields = this.fields,
        newFields = {};

    for (var field in tmpFields) {
        if (keys.indexOf(field.toLowerCase()) !== -1) continue;
        newFields[key] = tmpFields[key];
    }

    this.fields = newFields;
}

/**
 * Set preset field value.
 * @param key
 * @param value
 */
Model.prototype.setFieldValue = function(key, value) {
    var oldValue = this.getFieldValue(key, null);
    this.fields[key] = value;
    return oldValue;
}

/**
 * Get preset field value.
 * @param key
 * @param fallback
 */
Model.prototype.getFieldValue = function(key, fallback) {
    if (this.fields.hasOwnProperty(key)) {
        return this.fields[key];
    }
    return fallback;
}


/**
 * ModelError class.
 * @param message
 * @param stack
 * @constructor
 */
var ModelError = function(message, stack) {
    this.name    = "ModelError";
    this.message = message || "Unknown ModelError";
    this.stack   = stack;
};
ModelError.prototype = Error.prototype;

/**
 * Save error class.
 * @param message
 * @param stack
 * @constructor
 */
var ModelSaveError = function(message, stack) {
    this.name    = "ModelSaveError";
    this.message = message || "The Model file could not be saved.";
    this.stack   = stack;
};
ModelSaveError.prototype = Error.prototype;

/**
 * Load error class.
 * @param message
 * @param stack
 * @constructor
 */
var ModelLoadError = function(message, stack) {
    this.name    = "ModelLoadError";
    this.message = message || "The Model file could not be loaded.";
    this.stack   = stack;
};
ModelLoadError.prototype = Error.prototype;

/**
 * Read error class.
 * @param message
 * @param stack
 * @constructor
 */
var ModelReadError = function(message, stack) {
    this.name    = "ModelReadError";
    this.message = message || "The Model file could not be read.";
    this.stack   = stack;
};
ModelReadError.prototype = Error.prototype;

/**
 * Write error class.
 * @param message
 * @param stack
 * @constructor
 */
var ModelWriteError = function(message, stack) {
    this.name    = "ModelWriteError";
    this.message = message || "The Model file could not be written.";
    this.stack   = stack;
};
ModelWriteError.prototype = Error.prototype;

/**
 * File not found class.
 * @param message
 * @param stack
 * @constructor
 */
var ModelFileNotFound = function(message, stack) {
    this.name    = "ModelFileNotFound";
    this.message = message || "The Model file could not be found.";
    this.stack   = stack;
};
ModelFileNotFound.prototype = Error.prototype;

/**
 * File not found class.
 * @param message
 * @param stack
 * @constructor
 */
var ModelInitDatasourceError = function(message, stack) {
    this.name    = "ModelInitDatasourceError";
    this.message = message || "The data source could not be initialized";
    this.stack   = stack;
};
ModelInitDatasourceError.prototype = Error.prototype;
