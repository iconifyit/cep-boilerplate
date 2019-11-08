/**
 * Info object for CompItem
 * @param theItem
 * @param index
 * @returns {{frameRate: *, name: *, width: *, layers: *, index: *, type: string, height: *}}
 * @constructor
 */
var CompItemInfo = function(theItem, index) {
    try {
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
    catch(e) {
        alert('[CompItemInfo] ' + e)
    }
}

if (typeof console !== 'undefined') {
    console.log('CompItemInfo loaded');
}
else if (debug instanceof Function) {
    debug('CompItemInfo loaded');
}
