/**
 * Info object for CompItem
 * @param theCompItem
 * @param index
 * @returns {{frameRate: *, name: *, width: *, layers: *, index: *, type: string, height: *}}
 * @constructor
 */
var CompItemInfo = function(theCompItem, index) {
    try {
        return {
            type      : 'CompItem',
            index     : index,
            id        : get(theCompItem, 'id',        '--'),
            name      : get(theCompItem, 'name',      '--'),
            frameRate : get(theCompItem, 'frameRate', '--'),
            width     : get(theCompItem, 'width',     '--'),
            height    : get(theCompItem, 'height',    '--'),
            layers    : getLayerInfos(theCompItem),
            numLayers : get(theCompItem, 'numLayers', '--')
        }
    }
    catch(e) { debug('[ERROR][CompItemInfo]', e.message) }
}

if (typeof console !== 'undefined') {
    console.log('CompItemInfo loaded');
}
else if (debug instanceof Function) {
    debug('CompItemInfo loaded');
}
