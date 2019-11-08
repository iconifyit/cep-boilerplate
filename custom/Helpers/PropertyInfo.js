/**
 * Info item for Property
 * @param prop
 * @param index
 * @returns {{name: *, index: *, type: *, keyFrames: []}}
 * @constructor
 */
var PropertyInfo = function(theItem, index) {
    try {
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
    catch(e) { alert('[PropertyInfo] ' + e) }
}
