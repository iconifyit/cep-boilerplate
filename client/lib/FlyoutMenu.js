/**
 * @author Scott Lewis <scott@atomiclotus.net>
 * @copyright 2018 Scott Lewis
 * @version 1.0.0
 * @url http://github.com/iconifyit
 * @url https://atomiclotus.net
 *
 * ABOUT:
 *
 *    JavaScript class for building CEP Extension flyout menus.
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

if (typeof(csInterface) != 'object') {
    csInterface = new CSInterface();
}

/**
 * Create a new FlyoutMenu.
 * @param {array}  menuItems An array of MenuItems each having ID, Label, enabled, checked.
 * @returns {*}
 * @constructor
 */
function FlyoutMenu() {

    /**
     * The root menu.
     * @type {jQuery|HTMLElement}
     */
    var Menu = [];

    /**
     * Add a divider item.
     */
    this.divider = function() {
        Menu.push(MenuDivider());
    }

    /**
     * Add a MenuItem
     * @param id
     * @param label
     * @param enabled
     * @param checked
     */
    this.add = function(id, label, enabled, checked) {
        Menu.push(MenuItem(id, label, enabled, checked));
    };

    /**
     * Set the menu click handler.
     * @param clickHandler
     */
    this.setHandler = function(clickHandler) {
        csInterface.addEventListener('com.adobe.csxs.events.flyoutMenuClicked', clickHandler);
    };

    /**
     * Coerce menu to string.
     * @returns {*|jQuery}
     */
    this.toString = function() {
        return "<Menu>\n" + Menu.join('\n') + "\n</Menu>\n";
    }

    /**
     * Set the context menu.
     */
    this.build = function() {
        csInterface.setPanelFlyoutMenu(this.toString());
    };
};

/**
 * Build a MenuItem string.
 * @param   {string} id        The unique ID for the menu item.
 * @param   {string} label     The visible text for the menu item.
 * @param   {bool}   enabled   Whether or not the menu item is disabled/enabled.
 * @param   {bool}   checked   Whether or not the menu item is checked.
 * @returns {string}
 * @constructor
 */
function MenuItem(id, label, enabled, checked) {
    if (typeof(id) == 'undefined') {
        throw 'MenuItem must have an id';
    }
    if (typeof(label) == 'undefined') {
        throw 'MenuItem must have a label';
    }
    if (typeof(enabled) == 'undefined') {
        enabled = true;
    }
    if (typeof(checked) == 'unedefined') {
        checked = false;
    }

    return '<MenuItem Id="' + id + '" Label="' + label + '" Enabled="' + enabled + '" Checked="' + checked + '" />';
}

/**
 * Create a menu divider item.
 * @returns {*|jQuery}
 * @constructor
 */
function MenuDivider() {
    return '<MenuItem Label="---" />';
}