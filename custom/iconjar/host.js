(function(Host) {
    if (typeof Host === 'undefined') {
        return new HostResponse(undefined, 'Host instance was not found but is required.').stringify();
    }

    Host.fn('iconjar', function(name) {
        var message = 'IconJar host started';


        var response = new HostResponse(message, undefined).stringify();
        this.logger.info(response);
        return response;
    });

    Host.fn('chooseIconjar', function(folder, filter) {

        var response;

        try {
            var iconjar = Utils.chooseFile(
                new File(folder),
                'Choose an IconJar to open',
                filter
            );

            if (iconjar instanceof File) {

            }

            response = new HostResponse(iconjar.absoluteURI, undefined).stringify();
        }
        catch(e) {
            response = new HostResponse(undefined, e.message).stringify();
        }

        this.logger.info(response);
        return response;
    });
})(Host);
