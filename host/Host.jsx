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

#include "polyfills.js";
#include "Logger.jsx";
#include "JSON.jsx";
#include "Utils.jsx";
// #include "core/functions.AE.js";
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
}

debug('Logger instance created');

var Host;

/**
 * Run the script using the Module patter.
 */
module.Host = function(Config, logger) {

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

    Instance.prototype.loadPlugins = function(path) {

        var config,
            plugins;

        try {

            debug('Start Host.loadPlugins');

            config = Utils.read_json_file(path + '/plugins.json');

            debug('Host.loadPlugins - plugins config loaded (' + typeof config + ')');

            if (typeof config.plugins !== 'undefined') {
                plugins = config.plugins;

                debug('Host.loadPlugins - get plugins from config (' + typeof plugins + ')');

                for (var i = 0; i < plugins.length; i ++) {
                    var plugin = plugins[i];

                    if (typeof plugin === 'object') {

                        var isDisabled = typeof plugin.disabled !== 'undefined' && isTrue(plugin.disabled);

                        debug('Is ' + plugin.name + ' disabled? ' + (isDisabled ? 'Yes, skipping' : 'No, continuing'));

                        if (isDisabled) continue;

                        for (var x = 0; x < plugin.host.length; x++) {
                            var fileName = plugin.host[x];
                            try {
                                debug('Host.loadPlugins - $.evalFile - ' + fileName);
                                $.evalFile([path, plugin.name, fileName].join('/'));
                            }
                            catch(e) {
                                logger.error(e + '[' + fileName + ']');
                            }
                        }
                    }
                }
            }

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

};

/**
 * To be called from Client to create the Host instance.
 * @returns {string}
 */
function createHostInstance() {
    debug('createHostInstance called');
    try {
        Host = new module.Host(Config, logger);
        if (typeof Host === 'object') {
            return new HostResponse('Host instance was created', undefined).stringify();
        }
    }
    catch(e) {
        debug('createHostInstance error : ' + e);
        return new HostResponse(undefined, 'createHostInstance error : ' + e).stringify();
    }
}

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
