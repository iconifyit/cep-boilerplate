
var DEBUG = true;

(function(Host) {
    if (typeof Host === 'undefined') {
        return new HostResponse(
            undefined,
            'Host instance was not found but is required.'
        ).stringify();
    }

    /*
     * Attach the plugin's method.
     */
    Host.fn('server', function(name) {

        var start, stop;

        start = new Date().getTime();

        /**
         * Reference to Host's `this`
         */
        var module = this;

        /**
         * This code executes immediately when the plugin is called.
         */

        debug('*********************************************************************************************');
        debug('********************* START SERVER MAIN (' + (new Date().toUTCString()) + ')********************');
        debug('*********************************************************************************************');

        var infoString,
            fileName,
            exportFilePath,
            message;

        try {

            stop = new Date().getTime();

            infoString = stringify({foo: 'bar'});

            fileName = 'meta-export.json';
            try {
                fileName = app.project.file.name.replace('.aep', '.json')
            }catch(e){}

            exportFilePath = new File(Config.LOGFOLDER + '/' + fileName).absoluteURI;

            fwrite(exportFilePath, infoString, false);
            fwrite(Config.LOGFOLDER + '/timer.txt', ( (stop - start) / 1000 ) + ' seconds', false);

            message  = 'The export took ' + ((stop - start) / 1000 ) + ' seconds.';
            message += '<br>Open Exported Settings @ ' + exportFilePath;

            debug('************************************************************************************************');
            debug('****************** END SERVER MAIN (' + ((stop - start) / 1000 ) + ' seconds ) ******************************************');
            debug('************************************************************************************************');

            return new HostResponse(message, undefined).stringify();
        }
        catch(e) {
            return new HostResponse(undefined, 'Error creating response').stringify();
        }
    });
})(Host);
