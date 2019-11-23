/**
 * Info item for KeyFrame
 * @param {keyFrame}    theItem
 * @param {ing}         index
 * @returns {{name: *, index: *, type: string}}
 * @constructor
 */
var KeyFrameInfo = function(property) {
    try {
        var keyFrames = [],
            numKeys   = get(property, 'numKeys', 0);

        for (var i = 1; i <= numKeys; i++) {

            var keyFrame = {
                index                 : i,
                keyTime               : property.keyTime(i),
                keyValue              : property.keyValue(i),
                easingBezier          : []
            };

            /*
             * The properties that are commented out can be enabled if needed.
             * They have been disabled to reduce the output file size.
             */
            var props = [
                // 'canSetExpression',
                // 'canVaryOverTime',
                // 'expression',
                // 'expressionEnabled',
                // 'expressionError',
                // 'hasMax',
                // 'hasMin',
                // 'isSeparationFollower',
                // 'isSeparationLeader',
                // 'isSpatial',
                // 'isTimeVarying',
                'maxValue',
                'minValue'
            ];

            for (var x = 0; x < props.length; x++) {
                var prop = props[x];
                try { keyFrame[prop] = property[prop]; }
                catch(e) {
                    debug( '[ERROR][property[' + prop + ']]', e.message);
                }
            }

            /*
             * The methods that are commented out can be enabled if needed.
             * They have been disabled to reduce the output file size.
             */
            var methods = [
                // 'keyInInterpolationType',
                // 'keyInSpatialTangent',
                // 'keyOutInterpolationType',
                // 'keyOutSpatialTangent',
                // 'keyRoving',
                // 'keySelected',
                // 'keySpatialAutoBezier',
                // 'keySpatialContinuous',
                // 'keyTemporalAutoBezier',
                // 'keyTemporalContinuous',
                'keyInTemporalEase',
                'keyOutTemporalEase',
                'keyTime',
                'keyValue'
            ];

            for (var x = 0; x < methods.length; x++) {
                var method = methods[x];
                try { keyFrame[method] = property[method](i); }
                catch(e) {
                    debug( '[ERROR][property[' + method + ']]', e.message);
                }
            }

            debug('[KEYFRAME]', stringify(keyFrame));

            // 𝑦(𝑥)=(1−𝑥)3𝑦0+3𝑥(1−𝑥)2𝑦1+3𝑥2(1−𝑥)𝑦2+𝑥3𝑦3
            // y(x) = (1 - x)^3 * y0 + 3x(1 - x)^2 * y1 + 3x^2(1 - x) * y2 + x^3 * y3
            // given [0.167, 0, 0.167, 11.24]

            // property, startIndex, endIndex, framerate
            // var tweenData = bm_keyframeHelper.calcTweenData(
            //     property, 0, 1, 24
            // );

            // Let's see which of thise approaches works.

            try {
                keyFrame.SpaceTimeMethod     = SpaceTimeMethod(property);
            }
            catch(e) { debug('[ERROR][EASING - SpaceTimeMethod]', e.message) }

            try {
                keyFrame.HernanTorrisiMethod = HernanTorrisiMethod(property);
            }
            catch(e) { debug('[ERROR][EASING - HernanTorrisiMethod]', e.message) }

            try {
                keyFrame.MannyGonzalezMethod = MannyGonzalezMethod(property);
            }
            catch(e) { debug('[ERROR][EASING] - MannyGonzalezMethod', e.message) }

            /*
             * Calculate the keyFrame easings.
             */

            keyFrames.push(keyFrame);
        }
    }
    catch(e) { debug('[ERROR][KeyFrameInfo] ' + e) }

    return {
        getKeyFrames : function() {
            return keyFrames;
        }
    }
}
