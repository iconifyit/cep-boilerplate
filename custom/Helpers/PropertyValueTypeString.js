/**
 * Render the PropertyTypeValue as a string.
 * @param property
 * @returns {{toString: (function(): string), type: *}}
 * @constructor
 */
var PropertyValueTypeString = function(property) {
    try {
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
    catch(e) { alert('[PropertyValueTypeString] ' + e) }
}
