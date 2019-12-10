(function($, Client) {

    if (typeof Client === 'undefined') {
        throw new Error('Client instance was not found and is required.')
    }

    $(function() {

        var $button = $("#info-button");

        Client.enable($button);

        var clickHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();

            Client.host('info', 'Boom-dog', function(result) {
                Client.feedback(result);
            });

            $button.blur();
        }

        $button
            .off('click', clickHandler)
            .on('click', clickHandler);
    });
})(jQuery, Client);
