/**
 * Info item for Property
 * @param   {Property}      theProperty         The current Property item.
 * @param   {integer}       index               The index of the current Property in the properties array.
 * @param   {CompItem}      theCompItem         The parent CompItem of the Property being processed.
 * @paramm  {Layer}         theLayer            The parent Layer of the Property being processed.
 * @returns {{name: *, index: *, type: *, keyFrames: []}}
 * @constructor
 */
var PropertyInfo = function(theProperty, index, theCompItem, theLayer) {
    try {
        debug('[PropertyInfo]', 'Get PropertyInfo object for property ' + index);

        var bezierPoints = [],
            beziersArray = [],
            cubicBezierEasing;

        try {

            try {

                debug('************************************************************************************************');
                debug('************************************ EXPORT BEZIERS START **************************************');
                debug('************************************************************************************************');

                /* prop, frRate, stretch, keyframeValues? */

                debug('bm_keyframeHelper.type',                 typeof bm_keyframeHelper);
                debug('bm_keyframeHelper.exportKeyframes.type', typeof bm_keyframeHelper.exportKeyframes);
                debug('theCompItem.type',                       typeof theCompItem);
                debug('theLayer.type',                          typeof theLayer);

                beziersArray = bm_keyframeHelper.exportKeyframes(
                    theProperty,
                    theCompItem.frameRate,
                    theLayer.stretch
                );

                debug('[EXPORTED BEZIERS]', stringify(beziersArray));

                debug('************************************************************************************************');
                debug('************************************ EXPORT BEZIERS END ****************************************');
                debug('************************************************************************************************');

                debug('************************************************************************************************');
                debug('************************************ TRANSLATE BEZIERS START ***********************************');
                debug('************************************************************************************************');

                var keyData, keyFrames;

                keyFrames = beziersArray.k;

                for (var i = 0; i < keyFrames.length; i++) {
                    try {
                        keyData = keyFrames[i];
                        keyData = translateKeyData(keyData);
                        debug('[TRANSLATE BEZIERS](' + i + ')', stringify(keyData));
                    }
                    catch(e) {
                        debug('[ERROR][TRANSLATE BEZIERS](' + i + ')', e.message);
                        debug('[ERROR][TRANSLATE BEZIERS](' + i + ')', stringify(keyData));
                        debug('************************************************************************************************');
                        debug('************************************ EXPORT BEZIERS ERROR **************************************');
                        debug('************************************************************************************************');
                    }
                }

                debug('************************************************************************************************');
                debug('************************************ TRANSLATE BEZIERS END *************************************');
                debug('************************************************************************************************');
            }
            catch(e) {
                debug('[ERROR][EXPORTED BEZIERS]', e.message);
                debug('************************************************************************************************');
                debug('************************************ EXPORT BEZIERS ERROR **************************************');
                debug('************************************************************************************************');
            }

            var keyFrames = beziersArray.k;

            for (var i = 0; i < keyFrames.length; i++) {

                var keyData = keyFrames[i];

                debug('[keyData]', stringify(keyData));



            }

            cubicBezierEasing = beziersArray.k;
        }
        catch(e) {
            debug('[ERROR][keyFrame.keyFrameEase]', e.message);
        }

        return {
            index              : index,
            propertyType       : getPropertyTypeName(get(theProperty, 'propertyType', -1)),
            name               : get(theProperty, 'name', '--'),
            matchName          : get(theProperty, 'matchName', '--'),
            numKeys            : get(theProperty, 'numKeys', 0),
            keyFrames          : new KeyFrameInfo(theProperty).getKeyFrames(),
            // bezierPoints       : bezierPoints || [],
            // beziersArray       : beziersArray || [],
            propertyValueType  : get(theProperty, 'propertyValueType', '--'),
            // value              : '((omitted for performance reasons))'
        }
    }
    catch(e) { debug('[ERROR][PropertyInfo]', e.message) }
}
