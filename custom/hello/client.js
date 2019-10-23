(function($, Client) {

    if (typeof Client === 'undefined') {
        throw new Error('Client instance was not found and is required.')
    }

    $(function() {
        var $button = $("#open-button");

        var buttonHandler = function(e) {
            e.preventDefault();
            e.stopPropagation();

            Client.host('hello', 'Boom-dog', function(result) {
                Client.feedback(result);
            });

            $button.blur();
        }

        $button.off('click', buttonHandler).on('click', buttonHandler);
    });
})(jQuery, Client);
