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
var module = typeof module === 'undefined' ? {} : module;

/**
 * Declare the target app.
 */

#include "Logger.jsx";
#include "JSON.jsx";
#include "Utils.jsx";
#include "core/functions.js";
#include "core/Helpers.js";
#include "Configuration.jsx";
#include "HostResponse.js";

/**
 * @type {{
 *      APP_NAME: string,
  *     USER: *,
  *     HOME: *,
  *     DOCUMENTS: *
  * }}
 */
var Config = new Configuration({
    APP_NAME         : 'cep-boilerplate',
    USER             : $.getenv('USER'),
    HOME             : $.getenv('HOME'),
    DOCUMENTS        : '~/Documents',
    LOGFOLDER        : '~/Downloads/cep-boilerplate'
});

/**
 * The local scope logger object.
 * @type {Logger}
 */
var logger = new Logger(Config.get('APP_NAME'), Config.get('LOGFOLDER'));

function debug(what) {
    logger.info(what);
    // alert(what);
}

debug('Logger instance created');

/**
 * Run the script using the Module patter.
 */
var Host = (function(Config, logger) {

    var Instance = function(Config, logger) {
        this.logger = logger;
    }

    /**
     * Private, local function.
     */
    Instance.prototype.publicMethod = function(someData) {

        debug('Start Host.publicMethod');
        debug('Debug someData : ' + someData);

        Host.hello('Scott');

        var response = new HostResponse(
            "The Host received the message - " + someData,
            undefined
        );

        debug('hostResponse : ' + typeof response);
        debug('hostResponse.stringify : ' + response.stringify());

        return response.stringify();
    };

    // Add code here to dynamically load external Host plugins.
    Instance.prototype.loadPlugins = function(pluginsPath) {

        var config,
            plugins;

        try {
            config = Utils.read_json_file(pluginsPath + '/plugins.json');
            plugins = config.plugins;

            plugins.map(function(plugin) {
                if (! isDefined(plugin)) return;
                if (isString(plugin.host)) {
                    var script = plugin.host;
                    try {
                        $.evalFile([pluginsPath, plugin.name, script].join('/'));
                    }
                    catch(e) {
                        logger.error(e + '[' + script + ']')
                    }
                }
                else if (isArray(plugin.host)) {
                    plugin.host.map(function(script) {
                        try {
                            $.evalFile([pluginsPath, plugin.name, script].join('/'));
                        }
                        catch(e) {
                            logger.error(e + '[' + script + ']');
                        }
                    });
                }
            });

            return new HostResponse('Host plugins loaded', undefined).stringify();
        }
        catch(e) {
            logger.error('[loadPlugins] ' + e);
            return new HostResponse(undefined, '[Host.loadPlugins] ' + e).stringify();
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
        this.logger.info('Added method ' + name + ' to Host prototype');
        Instance.prototype[name] = _function;
    }

    return new Instance(Config, logger);

})(Config, logger);

/**
 * Wrappedr for CEP's evalFile.
 * @param theFilePath
 * @returns {*}
 */
function include(theFilePath) {
    try {
        if ((new File(theFilePath)).exists) {
            $.evalFile( theFilePath );
            return (new File(theFilePath)).name;
        }
        else {
            return theFilePath + ' does not exist';
        }
    }
    catch(e) {
        return e;
    }
}


debug('Host file loaded');

/**
 * Use this to interface from client side.
 * Example: csxScript('log("some text", "info")')
 * @param message
 * @param type
 */
function csxLogger(message, type) {
    try {
        logger.info( message );
        return 'ok';
    }
    catch(e) {
        return e;
    }
}
