(function($, Client, csInterface) {

    if (typeof Client === 'undefined') {
        throw new Error('Client instance was not found and is required.')
    }

    csInterface.requestOpenExtension("com.atomic.cep-boilerplate.server", "")

})(jQuery, Client, csInterface || new CSInterface());
