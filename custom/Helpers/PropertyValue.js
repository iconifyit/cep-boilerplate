/**
 * Property value object.
 * @param property
 * @returns {{valueOf: (function(): *), value: *}}
 * @constructor
 */
var PropertyValue = function(property) {
    try {
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
    catch(e) { alert('[PropertyValue] ' + e) }
}
