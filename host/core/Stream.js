var Stream = function(filepath) {
    this.contexts = {
        CLIENT : 'CLIENT',
        HOST   : 'HOST'
    }

    this.setDatasource(filepath);
}

/**
 * StreamError class.
 * @param message
 * @param stack
 * @constructor
 */
var StreamError = function(message, stack) {
    this.name    = "StreamError";
    this.message = message || "Unknown StreamError";
    this.stack   = stack;
};
StreamError.prototype = Error.prototype;

/**
 * Get file path.
 * @returns {*}
 */
Stream.prototype.getDatasource = function() {
    return this.datasource;
}

/**
 * Get file path.
 * @returns {*}
 */
Stream.prototype.setDatasource = function(datasource) {
    this.datasource = datasource;
    return datasource;
}

/**
 * Get the code context.
 * @returns {string}
 */
Stream.prototype.getContext = function() {
    if (typeof window === 'undefined') {
        return this.contexts.HOST;
    }
    return this.contexts.CLIENT;
}

/**
 * Test if a file exists.
 * @param filepath
 * @returns {boolean|*}
 */
Stream.prototype.exists = function(filepath) {

    filepath = filepath === undefined ? this.getDatasource() : filepath;

    var exists = false;

    if (this.getContext() === this.contexts.HOST) {
        var file = new File(filepath);
        exists = file.exists;
    }
    else {
        var result = window.cep.fs.readFile(
            filepath,
            cep.encoding.UTF8
       );
        exists = result.err === 0;
    }
    return exists;
}

/**
 * Write to file.
 * @param theText
 */
Stream.prototype.remove = function(theText) {
    try {
        if (this.getContext() === this.contexts.HOST) {
            try {
                var file = new File(this.getDatasource());

                if (! file.exists) {
                    return {
                        data : 'Could not find file ' + this.getDatasource(),
                        err  : 2
                    }
                }

                if (! file.remove()) {
                    return {
                        data : 'file.open() failed ' + this.getDatasource(),
                        err  : 4
                    }
                }

                return {
                    data : 'Removed file ' + this.getDatasource(),
                    err  : 0
                }
            }
            catch(e) {
                throw new StreamError('The file could not be removed - ' + e);
            }
        }
        else {
            var result = window.cep.fs.deleteFile(
                this.getDatasource()
            );

            if (result.err === 0) {
                return {
                    data : 'Removed file ' + this.getDatasource(),
                    err  : 0
                }
            }

            return {
                data : 'Could not delete file ' + this.getDatasource(),
                err  : 6
            }
        }
    }
    catch(e) {
        return {
            err : 3,
            data : e.message
        }
    }
}

/**
 * Write to file.
 * @param theText
 */
Stream.prototype.write = function(theText) {
    try {
        if (this.getContext() === this.contexts.HOST) {
            try {
                var file = new File(this.getDatasource());

                if (! file.open("e", "TEXT", "????")) {
                    return {
                        data : 'file.open() failed ' + this.getDatasource(),
                        err : 4
                    }
                }

                if (! file.seek(0,2)) {
                    return {
                        data : 'file.seek() failed ' + this.getDatasource(),
                        err : 5
                    }
                }

                $.os.search(/windows/i)  != -1 ? file.lineFeed = 'windows'  : file.lineFeed = 'macintosh';

                if (! file.writeln(theText)) {
                    return {
                        data : 'file.write() failed ' + this.getDatasource(),
                        err : 6
                    }
                }

                file.close();

                return {
                    data : 'Write to ' + this.getDatasource(),
                    err : 0
                }
            }
            catch(e) {
                throw new StreamError('The stream file could not be written - ' + e);
            }
        }
        else {
            var result = window.cep.fs.writeFile(
                this.getDatasource(),
                theText,
                cep.encoding.UTF8
           );

            if (result.err === 3) {
                throw new StreamError('The stream file could not be read');
            }
            else if (result.err === 2) {
                throw new StreamError('No such file : ' + this.getDatasource());
            }
            else if (result.err === 1) {
                throw new StreamError('The stream file could not be written');
            }
        }
    }
    catch(e) {
        return {
            err : 3,
            data : e.message
        }
    }
}

/**
 * Read from file.
 * @returns {*}
 */
Stream.prototype.read = function() {
    try {
        if (this.getContext() === this.contexts.HOST) {
            var content = "";

            var theFile = new File(this.getDatasource());

            if (theFile) {
                try {
                    if (theFile.alias) {
                        while (theFile.alias) {
                            theFile = theFile.resolve().openDlg(
                                Strings.CHOOSE_FILE,
                                "",
                                false
                           );
                        }
                    }
                }
                catch(e) {
                    logger.error(new StreamError(e));
                }

                try {
                    theFile.open('r', undefined, undefined);
                    if (theFile !== '') {
                        content = theFile.read();
                        theFile.close();
                    }
                }
                catch(e) {
                    try { theFile.close(); }catch(e){};
                    logger.error(new StreamError(e));
                }
            }
            return {
                err : 0,
                data : content
            };
        }
        else {
            var result = window.cep.fs.readFile(
                this.getDatasource(),
                cep.encoding.UTF8
           );

            if (result.err === 3) {
                throw new StreamError('The stream file could not be read (' + result.err + ')');
            }
            else if (result.err === 2) {
                throw new StreamError('No such file : ' + this.getDatasource());
            }
            else if (result.err === 1) {
                throw new StreamError('The stream file could not be read (' + result.err + ')');
            }

            return result;
        }
    }
    catch(e) {
        logger.error(new StreamError(e));
    }
}
