
// http://www.redefinery.com/ae/fundamentals/properties/
// https://aescripts.com/compcode/

(function(Host) {
    if (typeof Host === 'undefined') {
        return new HostResponse(undefined, 'Host instance was not found but is required.').stringify();
    }

    Host.fn('info', function(name) {

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

        module = this;

        try {
            if (app.project !== undefined) {
                project = app.project;

                debug('[Project]', project.toString());

                // if (! project.activeItem) {
                //     return new HostResponse(undefined, 'No active item is selected').stringify();
                // }
                //
                // activeItem = app.project.activeItem;
                //
                // module.logger.info(activeItem.toString());

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
            comps = getCompositions(items);

        debug('Composition count', comps.length);

        for (var i = 0; i < comps.length; i++) {
            try {

                debug('CompItem index',   i);
                debug('Typeof compiitem', typeof comps[i]);

                var compItemInfo = new CompItemInfo(comps[i], i);

                infos.push(compItemInfo);
            }
            catch(e) { alert('Error in compositions loop : ' + e) }
        }

        try {

            var infoString = stringify(infos);

            debug('[infos]', infoString);

            var response = new HostResponse(infoString, undefined).stringify();

            debug('[response]', response);

            fwrite(Config.LOGFOLDER + '/Untitled.json', infoString, false);

            return response;
        }
        catch(e) {
            return new HostResponse(undefined, 'Error creating response').stringify();
        }
    });
})(Host);
