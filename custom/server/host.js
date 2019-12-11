
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
    Host.fn('openDocument', function(location) {

        /**
         * Reference to Host's `this`
         */
        var module = this;

        try {
            var fileRef = new File(location);
            var docRef  = app.open(fileRef);

            return new HostResponse('Opened file ' + location, undefined).stringify();
        }
        catch(e) {
            debug('[ERROR]', e.message);
        }
    });
})(Host);
