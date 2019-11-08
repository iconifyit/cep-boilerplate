/**
 * Layer helper class
 * @param {Layer}    layer
 * @constructor
 */
var LayerHelper = function(theItem) {
    var _KEYS = [];
    var _functions = [];
}

extend(BaseHelper, LayerHelper);

if (typeof console !== 'undefined') {
    console.log('LayerHelper loaded');
}
else if (debug instanceof Function) {
    debug('LayerHelper loaded');
}
