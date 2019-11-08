/**
 * Info item for KeyFrame
 * @param {keyFrame}    theItem
 * @param {ing}         index
 * @returns {{name: *, index: *, type: string}}
 * @constructor
 */
var KeyFrameInfo = function(theItem, index) {
    try {
        return {
            type  : 'KeyFrame',
            id    : get(theItem, 'id',   'unknown KeyFrame.id'),
            index : index,
            name  : get(theItem, 'name', 'keyFrame name found')
        }
    }
    catch(e) { alert('[KeyFrameInfo] ' + e) }
}
