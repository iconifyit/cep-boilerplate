(function($, Client, csInterface) {

    var EXTENSION_ID = 'com.atomic.cep-boilerplate.server';

    if (typeof Client === 'undefined') {
        throw new Error('Client instance was not found and is required.')
    }

    try {
        csInterface.requestOpenExtension(EXTENSION_ID, "");
        console.log(EXTENSION_ID + ' opened');
    }
    catch(e) {
        console.log('Could not open extension. ', e.message);
    }

    var $button = $('<button/>').appendTo('.buttons');

    $button.text('Download File');
    $button.attr({
        'id'    : 'import-button',
        'href'  : '#import-button',
        'class' : 'topcoat-button--large--cta'
    });

    $button.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        doImport();
    })

    /* Get the path for your panel */
    var extensionDirectory = csInterface.getSystemPath("extension");

    function doImport() {
        /* Make sure to include the full URL */
        var url = "http://localhost:3201/import";

        /* Use ajax to communicate with your server */
        $.ajax({
            type: "GET",
            url: url,
            headers: {
                "directory": extensionDirectory
            },
            success: response => {
                /* Use the ExtendScript function to display the downloaded file */
                csInterface.evalScript('Host.openDocument("' + response + '")');
            },
            error: (xhr, textStatus, error) => {
                console.error(textStatus);
                console.error(error, xhr.responseJSON);
            }
        })
    }

})(jQuery, Client, csInterface || new CSInterface());
