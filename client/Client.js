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

    var Instance = function() {

        this.flyoutMenu = {state: []};
        this.menuState = {};
    }

    /**
     * Eval a script to run in the JSX host app.
     * @param theScript
     */
    Instance.prototype.eval = function(theScript) {
        csInterface.evalScript(theScript);
    }

    /**
     * Show a message in #message element.
     * @param text
     */
    Instance.prototype.showMessage = function(text) {
        try {
            this.clearMessage();
        } catch(e) {}

        try {
            var $message = $("#message");
            var text     = $.trim(text);
            var oldText  = $.trim($message.text());

            if (text === "") return;
            if (strcmp(oldText, text)) return;

            $message.text(text);
            $message.show();

            console.log(text);
        }
        catch(e) {
            this.error(e.message);
        }
    }

    /**
     * Clears and hides the palette message block.
     */
    Instance.prototype.clearMessage = function() {
        var $message = $("#message");
        $message.text("");
        $message.hide();
    }

    /**
     * Show the Host response.
     * @param response
     */
    Instance.prototype.feedback = function(response) {
        this.showMessage( this.validate(response) );
    }

    /**
     * Method to validate the data returned from a JSX callback
     * to make sure it is in the expected format. All results are
     * returned as a string. I recommend using stringified JSON
     * as a common format between Host and Client.
     *
     * To make sure the return value is predictable, use:
     *
     *     JSON.stringify({value : 'Your return value', error: 'If there is an error'});
     *
     * @param data
     */
    Instance.prototype.validate = function(result) {
        try {
            var hostResponse = new HostResponse().parse(result);

            if (hostResponse.isError()) {
                return hostResponse.getError();
            }

            return hostResponse.getValue();
        }
        catch(e) {
            return e.message;
        }
    }

    /**
     * Enabled a disabled element.
     * @param $o
     */
    Instance.prototype.enable = function(subject) {
        $select(subject).removeAttr('disabled');
    }

    /**
     * Disable an eneabled element.
     * @param $o
     */
    Instance.prototype.disable = function(subject) {
        $select(subject).attr('disabled', '');
    }

    /**
     * Initialize the HTML UI or update with result from a JSX script callback.
     * @param {*} result
     */
    Instance.prototype.init = function(result) {

        var module = this;

        var $message = $("#message");
        var $open    = $("#open-button");
        var $save    = $("#save-button");
        var data     = null;

        // Example enabling a disabled button.

        this.enable($open);

        // Client validate should throw an error if the validation fails,
        // or return the expected data if it passes. Wrap the validation
        // call in a try/catch block to trap errors.

        try {

            if (typeof(result) !== 'undefined') {
                data = this.validate(result);
            }

            this.showMessage(data || "This is the first run");

            var openHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();

                module.hostMethod("Open button clicked", function(result) {
                    module.feedback(result);
                });

                /*
                 * Example : You can disable a button after it is clicked:
                 *
                 *     Instance.disable($open);
                 */

                $open.blur();
            }

            var saveHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();

                module.hostMethod("Save button clicked", function(result) {
                    module.feedback(result);
                });

                /*
                 * Example : You can disable a button after it is clicked:
                 *
                 *     Instance.disable($save);
                 */

                $save.blur();
            }

            $open.off('click', openHandler).click(openHandler);
            $save.off('click', saveHandler).click(saveHandler);
        }
        catch(e) {
            // Handle the error however you need to.
            this.showMessage(e.message);
            this.error('Client Instance error', e);
        }
    }

    /**
     * Call the csInterface to open session.
     * @param filePath
     */
    Instance.prototype.hostMethod = function(someData, theCallback) {
        csInterface.evalScript('Host.publicMethod("' + someData + '")', theCallback);
    }

    /**
     * Send error message to log via CSInterface.
     * @param message
     */
    Instance.prototype.error = function(message) {
        this.log(message, 'error');
    }

    /**
     * Send info message to log via CSInterface.
     * @param message
     */
    Instance.prototype.info = function(message) {
        this.log(message, 'info');
    }

    /**
     * Send success message to log via CSInterface.
     * @param message
     */
    Instance.prototype.success = function(message) {
        this.log(message, 'success');
    }

    /**
     * Send warning message to log via CSInterface.
     * @param message
     */
    Instance.prototype.warn = function(message) {
        this.log(message, 'warn');
    }

    /**
     * Log a message to the client console and the host logger.
     * @param message
     */
    Instance.prototype.log = function(message, type) {
        if (type === undefined) type = 'info';
        if (typeof(console[type]) === 'function') {
            console[type](message);
        }
        csInterface.evalScript('csxLogger("' + message + '", "' + type + '")')
    }

    /**
     * Flyout menu builder.
     */
    Instance.prototype.initFlyoutMenu = function() {
        var module = this;
        var flyoutMenu = new FlyoutMenu();
        flyoutMenu.add('enabledMenuItem',   'Enabled Menu Item', true, false, false);
        flyoutMenu.add('disabledMenuItem',  'Disabled Menu Item', false, false, false);
        flyoutMenu.divider();
        flyoutMenu.add('checkableMenuItem', 'Yo, check it', true, true, true);
        flyoutMenu.add('actionMenuItem',    'Click to toggle the target', true, false, false);
        flyoutMenu.add('targetMenuItem',    'I am the target', true, false, false);
        flyoutMenu.add('reloadExtension',   'Reload Extension', true, false, false);
        flyoutMenu.setHandler(function(e) {
            module.flyoutMenuClickedHandler(e);
        });
        flyoutMenu.build();

        this.menuState = flyoutMenu.getState();

        console.log('flyoutMenu', flyoutMenu);
        console.log('flyoutMenu.state', this.menuState);
    }

    /**
     * Flyout menu click handler.
     * @param event
     */
    Instance.prototype.flyoutMenuClickedHandler = function(event) {
        try {

            var menuId = event.data.menuId;

            var itemState;

            if (this.menuState[menuId]) {
                itemState = this.menuState[menuId];
            }

            this.log(menuId + ' clicked', 'info');

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
                    this.reload();
                    break;

                default:
                    break;
            }
        }
        catch(e) { alert(e) }
    }

    /**
     * Reload the index.html
     */
    Instance.prototype.reload = function() {
        try {
            window.cep.process.removeAllListeners();
            window.location.href = "index.html";
        }
        catch (e) {
            window.location.href = "index.html";
        }
    }

    /**
     * Validate a JSON string.
     * @author  Thanks to https://stackoverflow.com/users/244374/matt-h
     * @url     https://stackoverflow.com/a/20392392/11357814
     * @param   {string}    jsonString  The stringified object to test.
     * @returns {boolean}
     */
    function isJSON(jsonString) {
        try {
            var o = JSON.parse(jsonString);

            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object",
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === "object") {
                return true;
            }
        }
        catch(e){}

        return false;
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
    var instance = new Instance();
    instance.init();
    instance.initFlyoutMenu();

    return instance;

})(jQuery, csInterface, window.console || {});

if (typeof exports !== 'undefined') {
    exports.Client = Client;
}
