/**
 * Dialog class.
 * @param settings
 * @param logger
 * @returns {Window}
 * @constructor
 */
var Dialog = function(settings, logger) {

    var module,
        response,
        bounds,
        width,
        height,
        top,
        left,
        rows,
        columns,
        margins,
        spacing;

    /*
     * Capture `this` in symbol for scoping issues.
     */

    module          = this;
    module.logger   = logger;
    module.settings = settings;

    /*
     * The window type.
     */

    this.windowType = settings.get('windowType', 'dialog');

    /*
     * For storing field names & types.
     */

    module._fields  = [];

    /*
     * Store button names.
     */

    module._buttons = [];

    /*
     * Panels
     */

    module._panels = [];

    /*
     * Event listeners table.
     */

    module._eventListeners = {};

    /**
     * The current row.
     * @type {number}
     */
    module.currentRow = 1;

    /**
     * The current column.
     * @type {number}
     */
    module.currentColumn = 1;

    /**
     * Does the current element have a containing panel?
     * @type {boolean}
     */
    module.hasPanel = false;

    /*
     * Test if field type is checkbox or radio.
     */

    this._hasValueProperty = function(theField) {
        return typeof theField.value === 'boolean';
    }

    /*
     * Set local variables for dimensions.
     */

    width   = settings.width || 450;
    height  = settings.height || 450;
    left    = 550;
    top     = 300;
    rows    = settings.rows || 2;
    columns = settings.columns || 2,
    margins = settings.margins || 20,
    spacing = settings.spacing || 4;

    /*
     * Calculate screen center.
     */

    if (bounds = Utils.getScreenSize()) {
        left = Math.abs(Math.ceil((bounds.width/2) - (width/2)));
        top  = Math.abs(Math.ceil((bounds.height/2) - (height/2)));
    }

    /*
     * Initialize response value.
     */

    response = false;

    /**
     * Dialog bounds: [ Left, TOP, RIGHT, BOTTOM ]
     * default: //550, 350, 1000, 800
     * @type {Window}
     *
     * type, title, bounds, properties
     */
    module.window = new Window(
        this.windowType,
        settings.name || 'Dialog',
        [
            left,
            top,
            left + width,
            top + height
        ],
        {
            margin        : 30,
            spacing       : 10
        }
    );

    module.window.margin  = 30;
    module.window.spacing = 10;

    // module.window.margins = settings.margins;
    // module.window.spacing = settings.spacing;

    /*
     * Create new window instance.
     */

    module.form = new Base({
        rows        : settings.rows || 1,
        columns     : settings.columns || 1 ,
        margins     : settings.margins || 10,
        spacing     : settings.spacing || 4,
        width       : settings.width || 450,
        height      : settings.height || 450
    });

    module.form.getRowHeight = function() {
        return Math.min(
            Math.floor(this.get('height') / this.get('rows')),
            30
        );
    }

    module.form.getColumnWidth = function() {
        return Math.floor(this.get('width') / this.get('columns'));
    }

    module.form.getMargins = function() {
        return this.get('margins', 0);
    }

    module.form.getSpacing = function() {
        return this.get('spacing', 0);
    }

    module.form.getWidth = function() {
        return this.get('width', 450);
    }

    module.form.getHeight = function() {
        return this.get('height', 450);
    }
}

/**
 * Add panel field.
 * @param options
 * @returns {*}
 */
Dialog.prototype.addPanel = function(options) {
    try {

        /*
         * Reference to `this`
         */

        var module = this;

        /*
         * Create getter/setter version of options.
         */

        options = new Base(options || {});

        /*
         * Set up local variables.
         */

        var value = options.get('title',    'Field ' + Utils.shortUUID());

        var _options = new Base({
            title   : value,
            value   : value,
            ID      : 'panel__' + Utils.shortUUID(),
            type    : FieldTypes.PANEL,
            row     : options.get('row',      1),
            column  : options.get('column',   1),
            span    : options.get('span',     1),
            rowspan : options.get('rowspan',  1),
            margins : options.get('margins',  0),
            spacing : options.get('spacing',  0)
        });

        var _panel = this.add(_options);

        _panel.margin  = 20; // _options.get('margins');
        _panel.spacing = 4;  // _options.get('spacing');

        this.logger.info(_panel);

        module._panels.push(_panel);

        return _panel;
    }
    catch(e) { this.logger.error(e); throw e; }
}

// dialog.sizePanel = dialog.add('panel',  [p1, 16, p2, 170],   Strings.LABEL_SIZE);

/**
 * Add form element.
 * @param options
 * @returns {*}
 */
Dialog.prototype.add = function(options) {
    try {

        /*
         * Reference to `this`
         */

        var module = this,
            form   = this.form;

        /*
         * Create getter/setter version of options.
         */

        options = new Base(options || {});

        /*
         * Set up local variables.
         */

        var name     = options.get('title',    'Field ' + Utils.shortUUID()),
            type     = options.get('type',     FieldTypes.TEXT),
            row      = options.get('row',      1),
            column   = options.get('column',   1),
            span     = options.get('span',     1),
            rowspan  = options.get('rowspan',  1),
            value    = options.get('value',    null),
            nudge    = options.get('nudge',    null),
            onChange = options.get('onChange', options.get('onchange')),
            margins  = options.get('margins',  0),
            spacing  = options.get('spacing',  0),
            parent   = options.get('parent',   null);

        /*
         * Calculate height and width.
         */

        var rowHeight    = form.getRowHeight(),
            colWidth     = form.getColumnWidth(),
            windowWidth  = form.getWidth(),
            windowHeight = form.getHeight();
            // margins      = form.getMargins(),
            // spacing      = form.getSpacing();

        /*
         * Test for parent panel.
         */

        // module.hasPanel = parent !== null;

        /*
         * Set current row & column.
         */

        module.currentColumn = options.get('column', 1);
        module.currentRow    = options.get('row', 1);

        /*
         * Adjust row and column offsets.
         */

        span   = span || 1;
        row    = row - 1;
        column = column - 1;

        /*
         * Calculate new coordinates.
         */

        if (type == FieldTypes.PANEL) {
            margins   = Math.floor(margins / 2);
            rowHeight = rowHeight + spacing;
        }

        var topBottomMargins = margins,
            leftRightMargins = margins;

        if (this._panels.length > 0 && type !== FieldTypes.PANEL) {
            leftRightMargins = margins;
        }

        var x1 = column == 0 ? leftRightMargins : Math.floor( leftRightMargins + (spacing * column) + (colWidth * column) ),
            x2 = Math.min( x1 + (colWidth * span), windowWidth - leftRightMargins ),
            y1 = row == 0 ? topBottomMargins : Math.floor( topBottomMargins + (spacing * row) + (rowHeight * row) ),
            y2 = Math.min( (y1 + (rowHeight * rowspan)), windowHeight - topBottomMargins );


        if (this.panelHitTest(options) && type !== FieldTypes.PANEL) {
            this.logger.info('Hit test found, adjusting positions');
            this.logger.info([x1, y1, x2, y2]);
            y1 = y1 + margins;
            y2 = y2 + margins;
            x1 = x1 + margins;
            x2 = x2 - margins;
            this.logger.info([x1, y1, x2, y2]);
        }

        if (type === FieldTypes.PANEL) {
            this.logger.info('Panel found, adjusting positions');
            this.logger.info([y1, y2]);
            y1 = y1 - margins;
            y2 = y2 + margins;
            this.logger.info([y1, y2]);
        }

        /*
         * Set bounds array.
         */

        var bounds = [ x1, y1, x2, y2 ];

        /*
         * Execute callback if there is one.
         */

        if (typeof nudge === 'function') {
            bounds = nudge.call(module, bounds);
        }

        /*
         * Add the new control element to the window.
         */

        // var _target = parent ? parent : module.window;

        var _target = module.window;

        _target[name] = _target.add(type, bounds, value, {
            margins : margins,
            spacing : spacing,
            location : [30, 30]
        });

        var theField = _target[name];

        /*
         * If the control has a value property, set it.
         */

        if (module._hasValueProperty(theField)) {
            theField.value  = value;
        }

        /*
         * Return the field that was changed and the new value.
         */

        if (typeof onChange === 'function') {

            var eventName = 'onChange',
                fieldName = 'text';

            if (module._hasValueProperty(theField)) {
                eventName = 'onClick';
                fieldName = 'value';
            }

            theField[eventName] = function() {
                onChange.call(module, theField[fieldName], theField);
            }
        }

        /*
         * Add field desicription to fields table.
         */

        if ([FieldTypes.BUTTON, FieldTypes.LABEL, FieldTypes.PANEL].indexOf(type) == -1) {
            module._fields.push({
                name : name,
                type : type
            });
        }

        /*
         * Return the form element.
         */

        return theField;
    }
    catch(e) { this.logger.error(e); throw e; }
}


/**
 * Test if a field falls within the bounds of a panel.
 * @param   {object}    theField
 * @returns {boolean}
 */
Dialog.prototype.panelHitTest = function(theField) {
    try {

        var f_column  = theField.get('column', 1),
            f_row     = theField.get('row', 1),
            f_span    = theField.get('span', 1),
            f_rowspan = theField.get('rowspan', 1);

        var panels = this._panels;

        for (var i = 0; i < (panels || []).length; i++) {
            var thePanel = panels[i];

            var p_column  = thePanel.get('column', 1),
                p_row     = thePanel.get('row', 1),
                p_span    = thePanel.get('span', 1),
                p_rowspan = thePanel.get('rowspan', 1);

            var xhit, yhit;

            if (f_column.between(p_column, (p_column + (p_span - 1)), true)) {
                xhit = true;
                this.logger.info('X Hit found');
            }

            if (f_row.between(p_row, (p_row + (p_rowspan - 1)), true)) {
                yhit = true;
                this.logger.info('Y Hit found');
            }

            if (xhit && yhit) return true;
        }

        return false;
    }
    catch(e) { this.logger.error(e); throw e; }
}

/**
 * Set the field value on a Dialog object.
 * @param fieldName
 * @param value
 */
Dialog.prototype.getFormValue = function() {
    var values = {};
    for (var i = 0; i < this._fields.length; i++) {
        var name = this._fields[i].name;
        values[name] = this.get(name);
    }
    return values;
}

/**
 * Set the field value on a Dialog object.
 * @param fieldName
 * @param value
 */
Dialog.prototype.set = function(fieldName, value) {
    var theField = this.window[fieldName];
    theField[this._hasValueProperty(theField) ? 'value' : 'text'] = value;
}

/**
 * Get a field value from the Dialog object.
 * @param fieldName
 * @returns {*}
 */
Dialog.prototype.get = function(fieldName) {
    var theField = this.window[fieldName];
    return theField[this._hasValueProperty(theField) ? 'value' : 'text'];
}

/**
 * Show the dialog window.
 */
Dialog.prototype.show = function() {
    this.window.show();
}

/**
 * Close the dialog window.
 */
Dialog.prototype.close = function() {

    var module = this;

    var callback = module['onClose'] || module['onclose'];

    if (typeof callback === 'function') {
        module.addEventListener('onClose', callback);
    }

    module.dispatchEvent('onclose', module);

    this.window.close();
}


extend(Observable, Dialog);
