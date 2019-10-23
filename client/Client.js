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
var Client = (($, csInterface) => {

    var Instance = function() {

        /**
         * The FlyOutMenu virtual object.
         * @type {{state: Array}}
         */
        // this.flyoutMenu = {state: []};

        /**
         * The FlyOutMenu state.
         * @type {{}}
         */
        this.menuState = {};

        /**
         * The extension meta data.
         * @type {object}
         */
        this.extension = null;

        /**
         * User-defined plugins already loaded.
         * @type {Array}
         */
        this.plugins = [];
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
     * Initialize the extension meta data.
     * @returns {{mainPath, isAutoVisible, minWidth, version, windowType, minHeight, basePath, maxHeight, name, width, id, height, maxWidth}}
     */
    Instance.prototype.getExtension = function() {

        var module = this;

        var extension;

        if (! this.extension) {
            this.extension = getExtension(csInterface.getExtensionID());

            var extPath   = csInterface.getSystemPath(SystemPath.EXTENSION);

            this.extension.customPath = extPath + '/custom';

            console.log('this.extension', this.extension);
        }

        return this.extension;
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

                // module.host('hello', 'Boomer', function(result) {
                //     module.feedback(result);
                // });

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

            // module.initHost();
        }
        catch(e) {
            // Handle the error however you need to.
            this.showMessage(e.message);
            this.error('Client Instance error', e);
        }
    }

    /**
     * Initialize some variables in the Host environment.
     */
    // Instance.prototype.initHost = function() {
    //
    //     var module = this;
    //
    //     // Share the Extension data with the Host
    //
    //     var Extension = module.getExtension();
    //
    //     csInterface.evalScript('$.global.extensionID = "' + csInterface.getExtensionID() + '";');
    //     csInterface.evalScript('$.global.extension = ' + stringify(Extension) + ';');
    //
    //     // Pass Config object to Host so we only load & parse once and are using
    //     // the same object in both scopes.
    //
    //     csInterface.evalScript('Extension = ' + stringify(Extension) + ';', function(result) {
    //         module.feedback(result);
    //     });
    // }

    /**
     * Load the Host's plugins.
     */
    Instance.prototype.loadHostPlugins = function() {
        var module = this;
        csInterface.evalScript('Host.loadPlugins("' + this.extension.customPath + '")', function(result) {
            module.feedback(result);
        });
    }

    /**
     * Load user-defined plugins.
     * @param pluginsPath
     */
    Instance.prototype.loadPlugins = function() {

        var module = this;

        var config,
            plugins,
            pluginsPath;

        var extension = module.getExtension(),
            extPath   = csInterface.getSystemPath(SystemPath.EXTENSION);

        extension.customPath = extPath + '/custom';

        console.log('extension', extension);

        pluginsPath = extension.customPath;

        try {
            config = JSON.parse(readFileData(pluginsPath + '/plugins.json'));

            plugins = config.plugins;

            plugins.map(function(plugin) {
                if (! isDefined(plugin)) return;
                plugin.client.map(function(script) {
                    try {
                        console.log([pluginsPath, plugin.name, script].join('/'));
                        addScript([pluginsPath, plugin.name, script].join('/'), function() {
                            console.log([pluginsPath, plugin.name, script].join('/') + ' added');
                        });
                        module.plugins.push(plugin.name);
                    }
                    catch(e) {
                        error(e + '[' + script + ']');
                    }
                });

            });

            console.info('Client.plugins', this.plugins);
        }
        catch(e) {
            error('[loadPlugins] ' + e);
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
     * Call the csInterface to open session.
     * @param filePath
     */
    Instance.prototype.host = function(method, data, theCallback) {
        csInterface.evalScript('Host.' + method + '("' + data + '")', theCallback);
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
     * Allows you to add methods to the Host without modifying the core code.
     *
     *   Example:
     *
     *   Host.fn('helloWorld', function() {
     *       this.logger.info("Hello World!");
     *   });
     */
    Instance.prototype.fn = function(name, _function) {
        console.log('Added method ' + name + ' to Client prototype');
        Instance.prototype[name] = _function;
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

})(jQuery, csInterface);

/**
 * Load user-defined plugins
 */
Client.loadPlugins();
Client.loadHostPlugins();


if (typeof exports !== 'undefined') {
    exports.Client = Client;
}
