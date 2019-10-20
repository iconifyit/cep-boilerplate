/**
 * @author Scott Lewis <scott@atomiclotus.net>
 * @copyright 2018 Scott Lewis
 * @version 1.0.0
 * @url http://github.com/iconifyit
 * @url https://atomiclotus.net
 *
 * ABOUT:
 *
 *    This script is a basic Configuration object.
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
 * Creates a new Configuration option with the values from options.
 * @param {Object} Options
 * @constructor
 */
var Configuration = function(Options) {

    "use strict";

    this.values = {};

    /**
     * Get a value from an object or array.
     * @param   {object|array}    subject
     * @param   {string}          key
     * @param   {*}               dfault
     * @returns {*}
     */
    this.get = function(key, dfault) {
        var value = dfault;
        if (typeof(this.values[key]) != 'unedfined') {
            value = this[key];
        }
        return value;
    };

    /**
     * Get a value from an object or array.
     * @param   {object|array}    subject
     * @param   {string}          key
     * @param   {*}               dfault
     * @returns {*}
     */
    this.set = function(key, value) {
        this.values[key] = value;
    };

    /**
     * Extends {Object} target with properties from {Object} source.
     * @param target
     * @param source
     */
    this.extend = function(source) {
        for (var key in source) {
            if (this.get(key, false)) {
                continue;
            }
            this[key] = source[key];
        }
    };

    /**
     * Updates {Object} target with properties from {Object} source.
     * Any previously set values will be over-written.
     * @param {Object}  source      The source object with new values.
     * @param {Boolean} overwrite   Whether or not new values should replace old values.
     */
    this.update = function(source, overwrite) {
        if (typeof(overwrite) == undefined) {
            overwrite = true;
        }
        for (var key in source) {
            if (typeof(this.values[key]) != 'unedfined') {
                if (! overwrite && this.get(key, false)) {
                    continue;
                }
                this.values[key] = source[key];
            }
        }
    };

    this.extend(Options);
};

module.exports = Configuration;
