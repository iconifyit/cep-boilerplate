/**
 * @author Scott Lewis <scott@atomiclotus.net>
 * @copyright 2018 Scott Lewis
 * @version 1.0.0
 * @url http://github.com/iconifyit
 * @url https://atomiclotus.net
 *
 * ABOUT:
 *
 *    This script is a very basic boilerplate for Adobe CEP extensions.
 *
 * NO WARRANTIES:
 *
 *   You are free to use, modify, and distribute this script as you see fit.
 *   No credit is required but would be greatly appreciated.
 *
 *   THIS SCRIPT IS OFFERED AS-IS WITHOUT ANY WARRANTY OR GUARANTEES OF ANY KIND.
 *   YOU USE THIS SCRIPT COMPLETELY AT YOUR OWN RISK AND UNDER NO CIRCUMSTANCES WILL
 *   THE DEVELOPER AND/OR DISTRIBUTOR OF THIS SCRIPT BE HELD LIABLE FOR DAMAGES OF
 *   ANY KIND INCLUDING LOSS OF DATA OR DAMAGE TO HARDWARE OR SOFTWARE. IF YOU DO
 *   NOT AGREE TO THESE TERMS, DO NOT USE THIS SCRIPT.
 */
var Client = (($, csInterface, console) => {

    var Instance = {};

    // Ugly workaround to keep track of "checked" and "enabled" statuses
    var checkableMenuItem_isChecked = true;
    var targetMenuItem_isEnabled    = true;

    Instance.flyoutMenu = {state: []};
    Instance.menuState = {};

    /**
     * Eval a script to run in the JSX host app.
     * @param theScript
     */
    Instance.eval = function(theScript) {
        csInterface.evalScript(theScript);
    };

    /**
     * Show a message in #message element.
     * @param text
     */
    Instance.showMessage = function(text) {
        try {
            Instance.clearMessage();
        } catch(e) {}

        try {
            var $message = $("#message");
            var chars    = text.length;
            var text     = $.trim(text);
            var oldText  = $.trim($message.text());

            if (text == "") return;
            if (strcmp(oldText, text)) return;

            $message.text(text);
            if (chars > 100) {
                // In some cases, you might want to put sanity limits on message length.
            }

            $message.show();

            console.log(text);
        }
        catch(e) {
            Instance.error(e.message);
        }
    };

    /**
     * Clears and hides the palette message block.
     */
    Instance.clearMessage = function() {
        var $message = $("#message");
        $message.text("");
        $message.hide();
    };

    /**
     * Method to validate the data returned from a JSX callback
     * to make sure it is in the expected format. All results are
     * returned as a string. I recommend using stringified JSON
     * as a common format between Host and Client.
     * @param data
     */
    Instance.validate = function(result) {

        Instance.info("Validate : " + result);

        var data = JSON.parse(result);

        // Perform whatever validation is needed on the data here.

        if (typeof(data) != 'object') {
            throw "Host did not return a JSON object";
        }
        else if (typeof(data.value) == 'undefinied') {
            throw "Host did not return a valid value";
        }
        else if (isEmpty(data.value)) {
            throw "Host returned an empty value";
        }

        // Validation passed, return the data value.
        // I am returning a single value from the JSON
        // object but you can return the whole object.
        return data.value;
    };

    /**
     * Enabled a disabled element.
     * @param $o
     */
    Instance.enable = function(subject) {
        $select(subject).removeAttr('disabled');
    };

    /**
     * Disable an eneabled element.
     * @param $o
     */
    Instance.disable = function(subject) {
        $select(subject).attr('disabled', '');
    };

    /**
     * Initialize the HTML UI or update with result from a JSX script callback.
     * @param {*} result
     */
    Instance.init = function(result) {

        var $message = $("#message");
        var $open    = $("#open-button");
        var $save    = $("#save-button");
        var data     = null;

        // Example enabling a disabled button.

        Instance.enable($open);

        // Client validate should throw an error if the validation fails,
        // or return the expected data if it passes. Wrap the validation
        // call in a try/catch block to trap errors.

        try {

            if (typeof(result) !== 'undefined') {
                data = Instance.validate(result);
            }

            Instance.showMessage(data || "This is the first run");

            var openHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();

                Instance.hostMethod("Open button clicked", Client.showMessage);
                // Instance.disable($open);
                $open.blur();
            }

            var saveHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();

                Instance.hostMethod("Save button clicked", Client.showMessage);
                // Instance.disable($save);
                $save.blur();
            }

            $open.off('click', openHandler).click(openHandler);
            $save.off('click', saveHandler).click(saveHandler);
        }
        catch(e) {
            // Handle the error however you need to.
            Instance.error(message);
            // Instance.showMessage(e.message);
            // console.error('Client Instance error', e);
        }
    };

    /**
     * Call the csInterface to open session.
     * @param filePath
     */
    Instance.hostMethod = function(someData, theCallback) {
        csInterface.evalScript('Host.publicMethod("' + someData + '")', theCallback);
    };

    /**
     * Send error message to log via CSInterface.
     * @param message
     */
    Instance.error = function(message) {
        Instance.log(message, 'error');
    };

    /**
     * Send info message to log via CSInterface.
     * @param message
     */
    Instance.info = function(message) {
        Instance.log(message, 'info');
    };

    /**
     * Send success message to log via CSInterface.
     * @param message
     */
    Instance.success = function(message) {
        Instance.log(message, 'success');
    };

    /**
     * Send warning message to log via CSInterface.
     * @param message
     */
    Instance.warn = function(message) {
        Instance.log(message, 'warn');
    };

    /**
     * Log a message to the client console and the host logger.
     * @param message
     */
    Instance.log = function(message, type) {
        if (type === undefined) type = 'info';
        if (typeof(console[type]) === 'function') {
            console[type](message);
        }
        csInterface.evalScript('csxLogger("' + message + '", "' + type + '")')
    };

    /**
     * Flyout menu builder.
     */
    Instance.initFlyoutMenu = function() {
        var flyoutMenu = new FlyoutMenu();
        flyoutMenu.add('enabledMenuItem',   'Enabled Menu Item', true, false, false);
        flyoutMenu.add('disabledMenuItem',  'Disabled Menu Item', false, false, false);
        flyoutMenu.divider();
        flyoutMenu.add('checkableMenuItem', 'Yo, check it', true, true, true);
        flyoutMenu.add('actionMenuItem',    'Click to toggle the target', true, false, false);
        flyoutMenu.add('targetMenuItem',    'I am the target', true, false, false);
        flyoutMenu.add('reloadExtension',   'Reload Extension', true, false, false);
        flyoutMenu.setHandler(Instance.flyoutMenuClickedHandler);
        flyoutMenu.build();

        Instance.menuState = flyoutMenu.getState();

        console.log('flyoutMenu', flyoutMenu);
        console.log('flyoutMenu.state', Instance.menuState);
    };

    /**
     * Flyout menu click handler.
     * @param event
     */
    Instance.flyoutMenuClickedHandler = (function(console) {
        return function(event) {
            try {

                var menuId = event.data.menuId;

                var itemState;

                if (Instance.menuState[menuId]) {
                    itemState = Instance.menuState[menuId];
                }

                Instance.log(menuId + ' clicked', 'info');

                switch (menuId) {
                    case "checkableMenuItem":
                        itemState.checked = ! itemState.checked;
                        csInterface.updatePanelMenuItem("Yo, check it", true, itemState.checked);
                        break;

                    case "actionMenuItem":
                        itemState.enabled = ! itemState.enabled;
                        csInterface.updatePanelMenuItem("I am the target", itemState.enabled, false);
                        break;

                    case "reloadExtension":
                        reloadExtension();
                        break;

                    default:
                        break;
                }
            }
            catch(e) { alert(e) }
        }
    })(console);

    /**
     * Reload the index.html
     */
    function reloadExtension() {
        try {
            window.cep.process.removeAllListeners();
            window.location.href = "index.html";
        }
        catch (e) {
            window.location.href = "index.html";
        }
    }

    /**
     * Test if a value is empty.
     * @param {*} data
     * @returns {boolean}
     */
    function isEmpty(data) {
        if (typeof(data) == 'number' || typeof(data) == 'boolean') {
            return false;
        }
        if (typeof(data) == 'undefined' || data === null) {
            return true;
        }
        if (typeof(data.length) != 'undefined') {
            return data.length == 0;
        }
        var count = 0;
        for (var i in data) {
            if (data.hasOwnProperty(i)) count ++;
        }
        return count == 0;
    }

    /**
     * Coerce any type of selector to the object it references, returned as a jQuery object.
     * @param subject
     * @returns {*}
     */
    function $select(subject) {
        var $o = subject;
        if (typeof(subject) != 'object') {
            $o = $(subject);
        }
        return $o;
    }

    /**
     * Case-insensitive string comparison.
     * @param aText
     * @param bText
     * @returns {boolean}
     */
    function strcmp(aText, bText) {
        return aText.toLowerCase() == bText.toLowerCase();
    }

    // Run now

    Instance.init();
    Instance.initFlyoutMenu();
    //Instance.hostMethod('Initial Run', Client.init);

    return Instance;

})(jQuery, csInterface, console);

if (typeof exports !== 'undefined') {
    exports.Client = Client;
}
