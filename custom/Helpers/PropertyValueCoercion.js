/**
 * Property value object.
 * @param property
 * @returns {{valueOf: (function(): *), value: *}}
 * @constructor
 */
var PropertyValueCoercion = function(property) {
    try {
        var value     = get(property, 'value', '--'),
            roundFlag = true;

        try {
            switch (get(property, 'propertyValueType', false)) {
                case PropertyValueType.SHAPE:
                    var value = {
                        i : roundFlag ? round(value.inTangents, 3) :  value.inTangents,
                        o : roundFlag ? round(value.outTangents, 3) : value.outTangents,
                        v : roundFlag ? round(value.vertices, 3) : value.vertices,
                        c: value.closed
                    };
                // return value;
                case PropertyValueType.COLOR:
                    // for (var i = 0; i < value.length; i++) {
                    //     value[i] = Math.round(value[i]*1000000000000)/1000000000000;
                    //     value[i] = value[i];
                    // }
                // return value;
                default:
                // return roundFlag ? round(value, 3) :  value;
            }
        }
        catch(e) {
            // return value;
            // value = 'Value Error : ' + e.message;
        }

        return {
            value : value,
            getValue : function() {
                return value;
            }
        }
    }
    catch(e) { debug('[Error][PropertyValueCoercion]', property.name ) }
}
