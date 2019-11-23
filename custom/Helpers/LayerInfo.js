/**
 * Info item for Layer
 * @param   {Layer}       theLayer        The current Layer being processed.
 * @param   {int}         index           The index of the current Layer in the Layers array.
 * @param   {CompItem}    theCompItem     The current CompItem being processed.
 * @returns {{name: *, index: *, type: string}}
 * @constructor
 */
var LayerInfo = function(theLayer, index, theCompItem) {
    try {
        return {
            type          : 'Layer',
            index         : index,
            name          : get(theLayer, 'name', '--'),
            matchName     : get(theLayer, 'matchName', '--'),
            numProperties : get(theLayer, 'numProperties', 0),
            properties    : processLayerProperties(theLayer, theCompItem)
        }
    }
    catch(e) { debug('[ERROR][LayerInfo][main body] ' + e) }
}
