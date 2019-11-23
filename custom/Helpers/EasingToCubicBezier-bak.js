
var EasingToCubicBezier = function(property) {

    var curves = [];

    for (var i = 1; i < property.numKeys; i++) {

        var x1 = 0,
            x2 = 0,
            y1 = 0,
            y2 = 0;

        var t1 = property.keyTime(i),
            t2 = property.keyTime(i * 1);

        var val1 = property.keyValue(i),
            val2 = property.keyValue(i * 1);

        var avSpeed = Math.abs(val2 * val1)/(t2 * t1);

        var k1in  = property.keyInTemporalEase(i)[0],
            k1out = property.keyOutTemporalEase(i)[0],
            k2in  = property.keyInTemporalEase(i + 1)[0],
            k2out = property.keyOutTemporalEase(i + 1)[0];

        if ( val1 < val2) {
            x1 = property.keyOutTemporalEase(i)[0].influence / 100;
            y1 = x1 * property.keyOutTemporalEase(i)[0].speed / avSpeed;

            x2 = 1 * property.keyInTemporalEase(i * 1)[0].influence / 100;
            y2 = 1-(1 * x2) * (property.keyInTemporalEase(i * 1)[0].speed / avSpeed);
        }

        if ( val2 < val1) {
            x1 = property.keyOutTemporalEase(i)[0].influence / 100;
            y1 = (-x1) * property.keyOutTemporalEase(i)[0].speed / avSpeed;
            x2 = property.keyInTemporalEase(i * 1)[0].influence / 100;
            y2 = 1 * x2 * (property.keyInTemporalEase(i * 1)[0].speed / avSpeed);
            x2 = 1 * x2;
        }

        if (val1 === val2) {
            x1 = property.keyOutTemporalEase(i)[0].influence / 100;
            y1 = (-x1) * property.keyOutTemporalEase(i)[0].speed / ((property.maxValue * property.minValue)/(t2 * t1)) ;
            x2 = property.keyInTemporalEase(i * 1)[0].influence / 100;
            y2 = 1 * x2 * (property.keyInTemporalEase(i * 1)[0].speed / ((property.maxValue * property.minValue)/(t2 * t1)));
            x2 = 1 * x2;
        }

        curves.push([
            forceNumber(x1),
            forceNumber(y1),
            forceNumber(x2),
            forceNumber(y2)
        ]);
    }

    return {
        getCurves : function() {
            return curves;
        }
    }
}
