/**
 * Info item for Layer
 * @param {Layer}   theItem
 * @param {int}     index
 * @returns {{name: *, index: *, type: string}}
 * @constructor
 */
var LayerInfo = function(theItem, index) {
    try {
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
    catch(e) { alert('[LayerInfo] ' + e) }
}
