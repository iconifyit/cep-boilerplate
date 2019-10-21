if (typeof(Config) == 'undefined') {
    alert('The functions.js file must be loaded before index.js');
}

/**
 * The main process.
 */
$(function() {

    try {

        // Share the Extension data with the Host

        var Extension = getExtension(csInterface.getExtensionID());

        // Set extensionID in global scope of Host.

        csInterface.evalScript('$.global.extensionID = "' + csInterface.getExtensionID() + '";', function(result) {
            console.log(result);
        });

        csInterface.evalScript('$.global.extension = ' + JSON.stringify(Extension) + ';');

        Config.EXTENSION_VERS = Extension.version;

        // Pass Config object to Host so we only load & parse once and are using
        // the same object in both scopes.

        csInterface.evalScript('Config = ' + JSON.stringify(new ConfigValues(Config)) + ';', function(result) {
            console.log('Host.Config', result);
        });

        // Initialize the flyout menu.

        // initFlyoutMenu();

        // Create the Host object and initialize the UI.

        csInterface.evalScript( 'createHostInstance()', function(result) {

            // If the Host instance was not created, we cannot continue.

            if ( ! isTrue(result) ) {
                alert(new CreateHostError('The Host instance could not be created'));
                return;
            }

            console.log('Client initialized and created');

        });
    }
    catch(e) {
        console.error(e);
    }
});
