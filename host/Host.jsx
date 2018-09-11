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

/**
 * Declare the target app.
 */
#target illustrator

$.localize = true;

#include "Logger.jsx"
#include "JSON.jsx"
#include "Utils.jsx"
#include "Configuration.jsx";

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
    DOCUMENTS        : Folder.myDocuments,
    LOGFOLDER        : '~/Downloads/cep-boilerplate'
});

/**
 * Run the script using the Module patter.
 */
var Host = (function(Config) {

    /**
     * The local scope logger object.
     * @type {Logger}
     */
    var _logger = new Logger(Config.get('APP_NAME'), Config.get('LOGFOLDER'));

    /**
     * Private, local function.
     */
    function _privateMethod(someData) {

        // Do something cool.
        return JSON.stringify({
            "value": "The Host received the message : '" + someData + "'"
        });
    };

    /**
     * Public object.
     */
    return {
        logger: _logger,
        /**
         * Public function.
         * @returns {*}
         */
        publicMethod: function(someData) {
            return _privateMethod(someData);
        }
    }

    // The closure takes the Configuration object as its argument.
})(Config);

/**
 * Get number of open documents.
 * @returns {*}
 */
function jsxCallback(someData) {

    // Write to the Host's logger output.
    Host.logger.info(someData);

    // Call the Host's public method.
    return Host.publicMethod(someData);
}