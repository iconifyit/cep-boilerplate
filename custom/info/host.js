
// http://www.redefinery.com/ae/fundamentals/properties/
// https://aescripts.com/compcode/

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
    Host.fn('info', function(name) {

        var start, stop;

        start = new Date().getTime();

        /**
         * Reference to Host's `this`
         */
        var module = this;

        /**
         * This code executes immediately when the plugin is called.
         */

        var project,
            activeItem,
            items,
            module;

        debug('*********************************************************************************************');
        debug('********************* START EXPORT MAIN (' + (new Date().toUTCString()) + ')********************');
        debug('*********************************************************************************************');

        try {
            if (app.project !== undefined) {
                project = app.project;

                if (! project.items.length) {
                    return new HostResponse(undefined, 'Project has no items').stringify();
                }

                items = project.items;
            }
        }
        catch(e) {
            return new HostResponse(undefined, 'Error getting activeItem. ' + e.message).stringify();
        }

        /**
         * - compositionName
         *    - CompFrameRate
         *    - CompWidth
         *    - CompHeight
         *    - layers
         *      - layerName
         *      - AnimatedProperties
         *          - propertyName
         *          - keyFrames
         *              - keyFrame
         *              - timingCurve/easing
         *              - *Time/frame
         *              - keyFrameValue
         *
         * compItem : {
         *      frameRate : 0
         *      width     : 0,
         *      height    : 0,
         *      layers : [{
         *          name : "name",
         *          properties : [{
         *              name : "prop-name",
         *              keyFrames : [{
         *                  // timingCurve/easing
         *                  // time/frame
         *                  // keyFrameValue
         *              }]
         *          }]
         *      }]
         *  }
         */

        var compItem,
            infoItem,
            infos = [],
            comps = getAllCompositions();

        debug('Composition count', comps.length);

        for (var i = 0; i < comps.length; i++) {
            try {
                infos.push( new CompItemInfo(comps[i], i) );
            }
            catch(e) { debug('[ERROR][compositions loop] ' + e) }
        }

        var infoString,
            fileName,
            exportFilePath,
            message;

        try {

            stop = new Date().getTime();

            infoString = stringify(infos);

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
            debug('****************** END EXPORT MAIN (' + ((stop - start) / 1000 ) + ' seconds ) ******************************************');
            debug('************************************************************************************************');

            return new HostResponse(message, undefined).stringify();
        }
        catch(e) {
            return new HostResponse(undefined, 'Error creating response').stringify();
        }
    });
})(Host);
