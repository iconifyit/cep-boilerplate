/**
 *
 * @param {string}  formId      The form ID attribute value
 * @param {Presets} presets     The default values
 * @constructor
 */
var Form = function(formId, presets) {

    var self = this;

    /**
     * Marker to indicate if any value of the form changed.
     * @type {boolean}
     */
    self.changed = false;

    /**
     * Trigger the Form's change event.
     *
     *     Usage:  $(Form).on("change", function(event, data) {});
     */
    self.markAsChanged = function() {
        this.changed = true;
        $(this).trigger("changed", this.getValues());
    }

    /**
     * @type {{
     *     WIDTH     : string,
     *     HEIGHT    : string,
     *     SPACING   : string,
     *     SCALE     : string,
     *     LOGGING   : string,
     *     SORT      : string,
     *     FILETYPES : string,
     *     FILENAME  : string,
     *     FOLDER    : string
     * }}
     */

    self.selectors = {
        FIND      : "input[name='find']",
        REPLACE   : "input[name='replace']",
        REGEX     : "input[name='regex']",
        ARTBOARDS : "input[name='artboards']",
        LAYERS    : "input[name='layers']"
    }

    /**
     * Get the value of an array member.
     * @param   {object}    subject
     * @param   {string}    key
     * @param   {*}         fallback
     * @returns {*}
     */
    function get(subject, key, fallback) {
        var value = fallback;
        if (typeof subject[key] !== 'undefined') {
            value = subject[key];
        }
        return value;
    }

    /**
     * @type {String}
     */
    self.find = '';

    /**
     * @type {String}
     */
    self.replace = '';

    /**
     * @type {Boolean}
     */
    self.regex = false;

    /**
     * @type {Boolean}
     */
    self.layers = false;

    /**
     * @type {Boolean}
     */
    self.artboards = false;

    /**
     * Fake constructor for ES5
     * @param presets
     */
    self.init = function(presets) {

        self.$form = $(formId);

        /**
         * @type {jQuery|HTMLElement}
         */
        self.$width = $("input[name='width']", self.$form);
        self.$width.val(presets.getWidth())
        self.$width.on('change', function(e) {

            console.log('self.$width.val()', self.$width.val())

            self.setWidth(
                self.$width.val()
            )
        });

        /**
         * @type {jQuery|HTMLElement}
         */
        self.$height = $("input[name='height']", self.$form);
        self.$height.val(presets.getHeight());
        self.$height.on('change', function(e) {

            console.log('self.$height.val()', self.$height.val());

            self.setHeight(
                self.$height.val()
            )
        });

        /**
         * @type {jQuery|HTMLElement}
         */
        self.$spacing = $("input[name='spacing']", self.$form);
        self.$spacing.val(presets.getSpacing());
        self.$spacing.on('change', function(e) {

            console.log('self.$spacing.val()', self.$spacing.val());

            self.setSpacing(
                self.$spacing.val()
            )
        });

        /**
         * @type {jQuery|HTMLElement}
         */
        self.$scale = $("input[name='scale']", self.$form);
        self.$scale.val(presets.getScale());
        self.$scale.on('change', function(e) {

            console.log('self.$scale.val()', self.$scale.val())

            self.setScale(
                self.$scale.val()
            )
        });

        /**
         * @type {jQuery|HTMLElement}
         */
        self.$logging = $("input[name='logging']", self.$form);
        self.$logging.val(presets.getLogging());
        self.$logging.on('change', function(e) {

            console.log("self.$logging.prop('checked')", self.$logging.prop('checked'))

            self.setLogging(
                Boolean(self.$logging.prop('checked'))
            )
        });

        /**
         * @type {jQuery|HTMLElement}
         */
        self.$sort = $("input[name='sort']", self.$form);
        self.$sort.val(presets.getSort());
        self.$sort.on('change', function(e) {

            console.log("self.$sort.prop('checked')", self.$sort.prop('checked'));

            self.setSort(
                Boolean(self.$sort.prop('checked'))
            )
        });

        /**
         * @type {jQuery|HTMLElement}
         */
        self.$filetypes = $("input[name*='filetypes']", self.$form);
        self.$filetypes.on('change', function(e) {
            var checked = [];
            $("input[name*='filetypes']").each(function(i, item) {

                if ($(item).prop('checked')) {

                    console.log("$(item).val()", $(item).val());

                    checked.push($(item).val())
                }
            });
            self.setFiletypes(checked)
        });

        presets.getFiletypes().map(function(value) {
            var $checkbox = $(":checkbox[value=" + value + "]");
            $checkbox.prop('checked', 'true');
        });

        /**
         * @type {jQuery|HTMLElement}
         */
        self.$filename = $("input[name='filename']", self.$form);
        self.$filename.val(presets.getFilename());
        self.$filename.on('change', function(e) {

            console.log('self.$filename.val()', self.$filename.val());

            self.setFilename(
                self.$filename.val()
            )
        });

        /**
         * @type {jQuery|HTMLElement}
         */
        self.$folder = $("input[name='folder']", self.$form);
        self.$folder.val(presets.getFolder());
        self.$folder.on('change', function(e) {

            console.log('self.$folder.val()', self.$folder.val());

            self.setFolder(
                self.$folder.val()
            )
        });
    }

    /**
     * Call the fake constructor.
     */
    self.init(presets);

};

/**
 * Get width.
 * @returns {Integer|number}
 */
Form.prototype.getWidth = function() {
    return this.$width.val();
};

/**
 * Set width.
 * @param value
 * @returns {*|number}
 */
Form.prototype.setWidth = function(value) {

    console.log('Form.setWidth', value);

    this.width = Number(value || 256);

    this.markAsChanged();
};

/**
 * Get height.
 * @returns {Integer|number}
 */
Form.prototype.getHeight = function() {
    return this.$height.val();
};

/**
 * Set height.
 * @param value
 * @returns {*|number}
 */
Form.prototype.setHeight = function(value) {

    console.log('Form.setHeight', value);

    this.height = Number(value || 256);

    this.markAsChanged();
};

/**
 * Get spacing.
 * @returns {Integer|number}
 */
Form.prototype.getSpacing = function() {
    return this.$spacing.val();
};

/**
 * Set spacing.
 * @param value
 * @returns {*|number}
 */
Form.prototype.setSpacing = function(value) {

    console.log('Form.setSpacing', value);

    this.spacing = Number(value || 24);

    this.markAsChanged();
};

/**
 * Get Scale.
 * @returns {Integer|number}
 */
Form.prototype.getScale = function() {
    return this.$scale.val();
};

/**
 * Set Scale.
 * @param value
 * @returns {*|number}
 */
Form.prototype.setScale = function(value) {

    console.log('Form.setScale', value);

    this.scale = Number(typeof value !== 'undefined' ? value : 100);

    this.markAsChanged();
};

/**
 * Get logging.
 * @returns {Integer}
 */
Form.prototype.getLogging = function() {
    return this.$logging.prop('checked');
};

/**
 * Set logging.
 * @param value
 * @returns {*|boolean}
 */
Form.prototype.setLogging = function(value) {

    console.log('Form.setLogging', value);

    this.logging = Boolean(value || false);

    this.markAsChanged();
};

/**
 * Get Sort.
 * @returns {Integer}
 */
Form.prototype.getSort = function() {
    return this.$sort.prop('checked');
};

/**
 * Set Sort.
 * @param value
 * @returns {*|boolean}
 */
Form.prototype.setSort = function(value) {

    console.log('Form.setSort', value);

    this.sort = Boolean(value || false);

    this.markAsChanged();
};

/**
 * get filetypes.
 * @returns {String[]}
 */
Form.prototype.getFiletypes = function() {

    var filetypes = [];

    $("input[name*='filetypes']").each(function(i, item) {
        if ($(item).prop('checked')) {
            filetypes.push($(item).val())
        }
    });

    return filetypes;
};

/**
 * Set filetypes.
 * @param value
 * @returns {*|string[]}
 */
Form.prototype.setFiletypes = function(value) {

    console.log('Form.setFiletypes', value);

    this.filetypes = value || [ FileTypes.SVG ];

    this.markAsChanged();
};

/**
 * Get filename.
 * @returns {String}
 */
Form.prototype.getFilename = function() {
    return this.$filename.val();
};

/**
 * Set filename.
 * @param value
 */
Form.prototype.setFilename = function(value) {

    console.log('Form.setFilename', value);

    this.filename = String(value || 'untitled.ai');
    this.$filename.val(this.filename);

    this.markAsChanged();
};

/**
 * Get folder.
 * @returns {String}
 */
Form.prototype.getFolder = function() {
    return this.$folder.val();
};

/**
 * Set folder.
 * @param value
 */
Form.prototype.setFolder = function(value) {

    console.log('Form.setFolder', value);

    this.folder = String(value || HOME);

    this.markAsChanged();
};

/**
 * Check if a filetype is selected.
 * @param needle
 * @returns {boolean}
 */
Form.prototype.hasType = function(needle) {
    return $("input[name=filtypes['" + needle + "']").prop('checked');
};

/**
 * Check if SVG is selected.
 * @returns {boolean}
 */
Form.prototype.hasSvg = function() {
    return this.hasType(FileTypes.SVG);
};

/**
 * Check if AI is selected.
 * @returns {boolean}
 */
Form.prototype.hasAi = function() {
    return this.hasType(FileTypes.AI);
};

/**
 * Check if EPS is selected.
 * @returns {boolean}
 */
Form.prototype.hasEps = function() {
    return this.hasType(FileTypes.EPS);
};

/**
 * Check if PDF is selected.
 * @returns {boolean}
 */
Form.prototype.hasPdf = function() {
    return this.hasType(FileTypes.PDF);
};

/**
 * Get the field values as a simple object.
 * @returns {{
 *     spacing   : (Integer|number),
 *     filename  : String,
 *     folder    : String,
 *     width     : (Integer|number),
 *     filetypes : String[],
 *     scale     : (Integer|number),
 *     logging   : Integer,
 *     sort      : Integer,
 *     height    : (Integer|number)
 * }}
 */
Form.prototype.getValues = function() {
    return {
        width       : this.getWidth(),
        height      : this.getHeight(),
        spacing     : this.getSpacing(),
        scale       : this.getScale(),
        logging     : this.getLogging(),
        sort        : this.getSort(),
        filename    : this.getFilename(),
        folder      : this.getFolder(),
        filetypes   : this.getFiletypes()
    }
};

/**
 * Validate the form fields.
 * @param   {jQuery} $form
 * @returns {boolean}
 */
Form.prototype.validate = function() {

    var isValid   = true;

    console.log('Validate Form');

    var $width     = $(this.selectors.WIDTH),
        $height    = $(this.selectors.HEIGHT),
        $spacing   = $(this.selectors.SPACING),
        $scale     = $(this.selectors.SCALE),
        $filename  = $(this.selectors.FILENAME),
        $folder    = $(this.selectors.FOLDER),
        $logging   = $(this.selectors.LOGGING),
        $sort      = $(this.selectors.SORT),
        $filetypes = $(this.selectors.FILETYPES);

    if (! isNumber( this.getWidth() )) {
        isValid = false;
        // $width.addClass('error');
    }

    if (! isNumber( this.getHeight() )) {
        isValid = false;
        // $height.addClass('error');
    }
    if (! isNumber( this.getSpacing() )) {
        isValid = false;
        // $spacing.addClass('error');
    }

    if (! isNumber( this.getScale() )) {
        isValid = false;
        // $scale.addClass('error');
    }

    if (isEmpty( this.getFilename() )) {
        isValid = false;
        // $filename.addClass('error');
    }

    if (isEmpty( this.getFolder() )) {
        isValid = false;
        // $folder.addClass('error');
    }

    if (isValid) {
        this.$form.find('input').removeClass('error');
    }

    try {
        console.log('width',        this.getWidth());
        console.log('height',       this.getHeight());
        console.log('spacing',      this.getSpacing());
        console.log('scale',        this.getScale());
        console.log('logging',      this.getLogging());
        console.log('sort',         this.getSort());
        console.log('filename',     this.getFilename());
        console.log('folder',       this.getFolder());
        console.log('filetypes[]',  this.getFiletypes());
    }
    catch(e) { console.error(e) }

    return isValid;
};

// window.exports.Form = Form;
