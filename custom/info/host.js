
// http://www.redefinery.com/ae/fundamentals/properties/
// https://aescripts.com/compcode/

(function(Host) {
    if (typeof Host === 'undefined') {
        return new HostResponse(undefined, 'Host instance was not found but is required.').stringify();
    }

    Host.fn('info', function(name) {

        /**
         * Reference to Host's `this`
         */
        var module = this;

        /**
         * Debug output
         * @param label
         * @param message
         */
        function debug(label, message) {

            try {
                var strValue;

                if (! isDefined(message)) {
                    strValue = '* undefined *';
                }
                else if (isEmpty(message)) {
                    strValue = '* empty *';
                }
                else if (isFunction(message)) {
                    strValue = 'function() { [native code] }';
                }
                else if (isNumber(message)) {
                    strValue = String(message);
                }
                else if (isObject(message)) {
                    strValue = '[Object]';
                }
                else {
                    strValue = String(message);
                }

                module.logger.info(label + (! isEmpty(strValue) ? ' : ' + strValue : ''));
            }
            catch(e) {
                alert(e);
            }
        }

        /**
         * Generic getter
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

            debug('[Subject.' + key + ']', value);

            return value;
        }

        /**
         * Filter compositions from Project
         * @param items
         * @returns {[]}
         */
        function getCompositions(items) {

            var item,
                comps = [];

            for (var i = 1; i <= items.length; i++) {
                item = items[i];
                if (item.typeName.toLowerCase() === 'composition') {
                    comps.push(item);
                }
            }

            return comps;
        }

        /**
         * Get all property and method names from an object.
         * @param comp
         */
        function getPropertiesAndMethods(theItem) {

            var props = [],
                funcs = [];

            try {
                for (var prop in theItem) {
                    try {
                        debug('[theItem.' + prop + ']', typeof theItem[prop]);
                        info[prop] = String(theItem[prop]);

                        (theItem[prop] instanceof Function ? funcs : props).push(prop);
                    }
                    catch(e) {
                        debug('[theItem.' + prop + ']', e.message);
                    }
                }

                debug('[properties]', stringify(props));
                debug('[methods]',    stringify(funcs));

                infos.push(info);
            }
            catch(e) {
                debug('Error enumerating props', e.message);
            }

            return { properties : props, methods : funcs }
        }

        /**
         * Info object for CompItem
         * @param theItem
         * @param index
         * @returns {{frameRate: *, name: *, width: *, layers: *, index: *, type: string, height: *}}
         * @constructor
         */
        var CompItemInfo = function(theItem, index) {
            return {
                type      : 'CompItem',
                index     : index,
                id        : get(theItem, 'id',        'unknown CompItem.id'),
                name      : get(theItem, 'name',      'name not found'),
                frameRate : get(theItem, 'frameRate', 'frameRate not found'),
                width     : get(theItem, 'width',     'width not found'),
                height    : get(theItem, 'height',    'height not found'),
                // selectedProperties : getSelectedProperties(theItem),
                layers    : getLayerInfos(theItem, index),
                numLayers : get(theItem, 'numLayers', 'CompItem.numLayers not found')
            }
        }

        function getSelectedProperties(compItem) {
            var sProps = compItem.selectedProperties;

            var properties    = [],
                numProperties = sProps.length;

            if (numProperties) {
                for (var i = 1; i <= numProperties; i++) {
                    properties.push(
                        new PropertyInfo(sProps(i), i)
                    );
                }
            }

            return properties;
        }

        /**
         * Test if the given type can be animated.
         * @param   {Layer}     theLayer
         * @returns {boolean}
         */
        function isAnimatable(theLayer) {
            return ( NonAnimatableLayerTypes.indexOf(theLayer.type) === -1 );
        }

        /**
         * Get the list of LayerInfo items
         * @param compItem
         * @returns {[]}
         */
        function getLayerInfos(compItem) {
            var theLayer,
                layers = [];

            for (var i = 1; i <= compItem.numLayers; i++) {
                theLayer = compItem.layer(i);
                if (! isAnimatable(theLayer)) continue;
                layers.push(new LayerInfo(theLayer, i));
            }

            return layers;
        }

        /**
         * Info item for Layer
         * @param {Layer}   theItem
         * @param {int}     index
         * @returns {{name: *, index: *, type: string}}
         * @constructor
         */
        var LayerInfo = function(theItem, index) {

            var properties    = [],
                numProperties = get(theItem, 'numProperties', 0);

            if (numProperties) {
                for (var i = 1; i <= numProperties; i++) {
                    properties.push(
                        new PropertyInfo(theItem.property(i), i)
                    );
                }
            }

            return {
                type          : 'Layer',
                index         : index,
                id            : get(theItem, 'id',   'unknown Layer.id'),
                name          : get(theItem, 'name', 'layer name not found'),
                numProperties : numProperties,
                properties    : properties
            }
        }

        /**
         * Info item for Property
         * @param prop
         * @param index
         * @returns {{name: *, index: *, type: *, keyFrames: []}}
         * @constructor
         */
        var PropertyInfo = function(theItem, index) {
            return {
                index             : index,
                id                : get(theItem, 'id',   'unknown Property.id'),
                type              : get(theItem, 'type', 'Unknown property type'),
                name              : get(theItem, 'name', 'Unknown property name'),
                numKeys           : get(theItem, 'numKeys', 0),
                keyFrames         : getKeyFrames(theItem),
                propertyValueType : new PropertyValueTypeString(theItem).toString(),
                value             : new PropertyValue(theItem).valueOf()
            }
        }

        /**
         * Get the keyFrames for a given property.
         * @param property
         * @returns {[]}
         */
        function getKeyFrames(property) {
            var keyFrames = [],
                numKeys   = property.numKeys;

            debug('property.numKeys', property.numKeys);

            for (var i = 1; i <= numKeys; i++) {
                debug(stringify({
                    keyTime  : property.keyTime(i),
                    keyValue : property.keyValue(i)
                }));

                keyFrames.push({
                    keyTime  : property.keyTime(i),
                    keyValue : property.keyValue(i)
                });
            }

            return keyFrames;
        }

        /**
         * Render the PropertyTypeValue as a string.
         * @param property
         * @returns {{toString: (function(): string), type: *}}
         * @constructor
         */
        var PropertyValueTypeString = function(property) {
            var typeString = '';

            switch (get(property, 'propertyValueType', 'NA')) {
                case PropertyValueType.NO_VALUE:
                    typeString = 'NO_VALUE';
                    break;
                case PropertyValueType.ThreeD_SPATIAL:
                    typeString = 'ThreeD_SPATIAL';
                    break;
                case PropertyValueType.ThreeD:
                    typeString = 'ThreeD';
                    break;
                case PropertyValueType.TwoD_SPATIAL:
                    typeString = 'TwoD_SPATIAL';
                    break;
                case PropertyValueType.TwoD:
                    typeString = 'TwoD';
                    break;
                case PropertyValueType.OneD:
                    typeString = 'OneD';
                    break;
                case PropertyValueType.COLOR:
                    typeString = 'COLOR';
                    break;
                case PropertyValueType.CUSTOM_VALUE:
                    typeString = 'CUSTOM_VALUE';
                    break;
                case PropertyValueType.MARKER:
                    typeString = 'MARKER';
                    break;
                case PropertyValueType.LAYER_INDEX:
                    typeString = 'LAYER_INDEX';
                    break;
                case PropertyValueType.MASK_INDEX:
                    typeString = 'MASK_INDEX';
                    break;
                case PropertyValueType.SHAPE:
                    typeString = 'SHAPE';
                    break;
                case PropertyValueType.TEXT_DOCUMENT:
                    typeString = 'TEXT_DOCUMENT';
                    break;
                default:
                    typeString = 'UNKNOWN';
            }
            return {
                type : typeString,
                toString : function() {
                    return typeString;
                }
            }
        }

        /**
         * Property value object.
         * @param property
         * @returns {{valueOf: (function(): *), value: *}}
         * @constructor
         */
        var PropertyValue = function(property) {
            var value = get(property, 'value', 'undefined'),
                roundFlag = true;

            try {
                switch (property.propertyValueType) {
                    case PropertyValueType.SHAPE:
                        var value = {
                            i : roundFlag ? round(value.inTangents, 3) :  value.inTangents,
                            o : roundFlag ? round(value.outTangents, 3) : value.outTangents,
                            v : roundFlag ? round(value.vertices, 3) : value.vertices,
                            c: value.closed
                        };
                        // return value;
                    case PropertyValueType.COLOR:
                        var i, len = value.length;
                        for (i = 0; i < len; i += 1) {
                            value[i] = Math.round(value[i]*1000000000000)/1000000000000;
                            value[i] = value[i];
                        }
                        // return value;
                    default:
                        // return roundFlag ? round(value, 3) :  value;
                }
            }
            catch(e) {
                // return value;
                value = e.message;
            }

            return {
                value : value,
                valueOf : function() {
                    return value;
                }
            }
        }

        /**
         * Info item for KeyFrame
         * @param {keyFrame}    theItem
         * @param {ing}         index
         * @returns {{name: *, index: *, type: string}}
         * @constructor
         */
        var KeyFrameInfo = function(theItem, index) {
            return {
                type  : 'KeyFrame',
                id    : get(theItem, 'id',   'unknown KeyFrame.id'),
                index : index,
                name  : get(theItem, 'name', 'keyFrame name found')
            }
        }

        /**
         * This code executes immediately when the plugin is called.
         */

        var project,
            activeItem,
            items,
            module;

        module = this;

        try {
            if (app.project !== undefined) {
                project = app.project;

                debug('[Project]', project.toString());

                // if (! project.activeItem) {
                //     return new HostResponse(undefined, 'No active item is selected').stringify();
                // }
                //
                // activeItem = app.project.activeItem;
                //
                // module.logger.info(activeItem.toString());

                if (! project.items.length) {
                    return new HostResponse(undefined, 'Project has no items').stringify();
                }

                items = project.items;
            }
        }
        catch(e) {
            return new HostResponse(undefined, 'Error getting activeItem. ' + e.message).stringify();
        }

        /**
         * - compositionName
         *    - CompFrameRate
         *    - CompWidth
         *    - CompHeight
         *    - layers
         *      - layerName
         *      - AnimatedProperties
         *          - propertyName
         *          - keyFrames
         *              - keyFrame
         *              - timingCurve/easing
         *              - *Time/frame
         *              - keyFrameValue
         *
         * compItem : {
         *      frameRate : 0
         *      width     : 0,
         *      height    : 0,
         *      layers : [{
         *          name : "name",
         *          properties : [{
         *              name : "prop-name",
         *              keyFrames : [{
         *                  // timingCurve/easing
         *                  // time/frame
         *                  // keyFrameValue
         *              }]
         *          }]
         *      }]
         *  }
         */

        var compItem,
            infoItem,
            infos = [],
            comps = getCompositions(items);

        debug('Composition count', comps.length);

        for (var i = 0; i < comps.length; i++) {
            try {

                debug('CompItem index',   i);
                debug('Typeof compiitem', typeof comps[i]);

                var compItemInfo = new CompItemInfo(comps[i], i);

                infos.push(compItemInfo);
            }
            catch(e) { alert('Error in compositions loop : ' + e) }
        }

        try {

            var infoString = stringify(infos);

            debug('[infos]', infoString);

            var response = new HostResponse(infoString, undefined).stringify();

            debug('[response]', response);

            fwrite(Config.LOGFOLDER + '/Untitled.json', infoString, false);

            return response;
        }
        catch(e) {
            return new HostResponse(undefined, 'Error creating response').stringify();
        }
    });
})(Host);
