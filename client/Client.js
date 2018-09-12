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

window.Client = window.Client || {};

$(function() {

    var csInterface = new CSInterface();

    // Ugly workaround to keep track of "checked" and "enabled" statuses
    var checkableMenuItem_isChecked = true;
    var targetMenuItem_isEnabled    = true;

    /**
     * Eval a script to run in the JSX host app.
     * @param theScript
     */
    Client.eval = function(theScript) {
        csInterface.evalScript(theScript);
    };

    /**
     * Show a message in #message element.
     * @param text
     */
    Client.showMessage = function(text) {
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
        }
        catch(e) {
            Client.error(e.message);
        }
    };

    /**
     * Clears and hides the palette message block.
     */
    Client.clearMessage = function() {
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
    Client.validate = function(result) {

        Client.info("Validate : " + result);

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
    Client.enable = function(subject) {
        $select(subject).removeAttr('disabled');
    };

    /**
     * Disable an eneabled element.
     * @param $o
     */
    Client.disable = function(subject) {
        $select(subject).attr('disabled', '');
    };

    /**
     * Initialize the HTML UI or update with result from a JSX script callback.
     * @param {*} result
     */
    Client.init = function(result) {

        var $message = $("#message");
        var $open    = $("#open-button");
        var $save    = $("#save-button");
        var data     = null;

        // Example enabling a disabled button.

        Client.enable($open);

        // Client validate should throw an error if the validation fails,
        // or return the expected data if it passes. Wrap the validation
        // call in a try/catch block to trap errors.

        try {

            if (typeof(result) != 'undefined') {
                data = Client.validate(result);
            }

            Client.clearMessage();
            Client.showMessage(data || "This is the first run");

            $open.mouseup(function() {
                Client.hostMethod("Open button clicked", Client.init);
                Client.disable($open);
                $open.blur();
            });

            $save.mouseup(function() {
                Client.hostMethod("Save button clicked", Client.init);
                Client.disable($save);
                $save.blur();
            });
        }
        catch(e) {
            // Handle the error however you need to.
            Client.error(message);
            Client.showMessage(e.message);
        }
    };

    /**
     * Call the csInterface to open session.
     * @param filePath
     */
    Client.hostMethod = function(someData, theCallback) {
        csInterface.evalScript('Host.publicMethod("' + someData + '")', theCallback);
    };

    /**
     * Send error message to log via CSInterface.
     * @param message
     */
    Client.error = function(message) {
        Client.log(message, 'error');
    };

    /**
     * Send info message to log via CSInterface.
     * @param message
     */
    Client.info = function(message) {
        Client.log(message, 'info');
    };

    /**
     * Send success message to log via CSInterface.
     * @param message
     */
    Client.success = function(message) {
        Client.log(message, 'success');
    };

    /**
     * Send warning message to log via CSInterface.
     * @param message
     */
    Client.warn = function(message) {
        Client.log(message, 'warn');
    };

    /**
     * Log a message to the client console and the host logger.
     * @param message
     */
    Client.log = function(message, type) {
        if (typeof(console[type]) == 'function') {
            console[type](message);
        }
        csInterface.evalScript('csxLogger("' + message + '", "' + type + '")')
    };

    /**
     * Flyout menu builder.
     */
    Client.initFlyoutMenu = function() {
        var Menu = new FlyoutMenu();
        Menu.add('enabledMenuItem',   'Enabled Menu Item', true, false, false);
        Menu.add('disabledMenuItem',  'Disabled Menu Item', false, false, false);
        Menu.divider();
        Menu.add('checkableMenuItem', 'Yo, check it', true, true, true);
        Menu.add('actionMenuItem',    'Click to toggle the target', true, false, false);
        Menu.add('targetMenuItem',    'I am the target', true, false, false);
        Menu.setHandler(Client.flyoutMenuClickedHandler);
        Menu.build();
    };

    /**
     * Flyout menu click handler.
     * @param event
     */
    Client.flyoutMenuClickedHandler = function(event) {

        // the event's "data" attribute is an object, which contains "menuId" and "menuName"

        switch (event.data.menuId) {
            case "checkableMenuItem":
                checkableMenuItem_isChecked = !checkableMenuItem_isChecked;
                csInterface.updatePanelMenuItem("Yo, check it", true, checkableMenuItem_isChecked);
                break;

            case "actionMenuItem":
                targetMenuItem_isEnabled = !targetMenuItem_isEnabled;
                csInterface.updatePanelMenuItem("I am the target", targetMenuItem_isEnabled, false);
                break;

            default:
                break;
        }

        console.log(event.data.menuName + " clicked!");

        csInterface.evalScript("alert('Clicked!\\n \"" + event.data.menuName + "\"');");
    };

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

    Client.init();
    Client.hostMethod('Initial Run', Client.init);
    Client.initFlyoutMenu();
});