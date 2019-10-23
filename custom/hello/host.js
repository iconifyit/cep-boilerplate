(function(Host) {
    if (typeof Host === 'undefined') {
        return new HostResponse(undefined, 'Host instance was not found but is required.').stringify();
    }

    Host.fn('hello', function(name) {
        var message = 'Hello ' + name + '!';
        var response = new HostResponse(message, undefined).stringify();
        this.logger.info(response);
        return response;
    });
})(Host);
