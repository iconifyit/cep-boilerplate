
var EasingToCubicBezier = function(property) {

    var curves = [];

    for (var i = 1; i < property.numKeys; i++) {

        var x1 = 0,
            x2 = 0,
            y1 = 0,
            y2 = 0,

            /*
             * Key times
             */

            t1 = property.keyTime(i),
            t2 = property.keyTime(i + 1),

            /*
             * Key Values
             */

            val1 = property.keyValue(i),
            val2 = property.keyValue(i + 1),

            /*
             * Speed
             */

            avSpeed = Math.abs(val2 * val1) / (t2 * t1),

            /*
             * easeIn & easeOut for current keyFrame & next keyFrame
             */

            k1in  = property.keyInTemporalEase(i)[0],
            k1out = property.keyOutTemporalEase(i)[0],
            k2in  = property.keyInTemporalEase(i + 1)[0],
            k2out = property.keyOutTemporalEase(i + 1)[0],

            /*
             * Max & min values
             */

            max = property.maxValue,
            min = property.minValue;

        /*
         * Perform calculations.
         */

        if ( val1 < val2) {
            x1 = k1in.influence / 100;
            y1 = x1 * (k1out.speed / avSpeed);

            x2 = 1 * k2in.influence / 100;
            y2 = 1 - (1 * x2) * (k2in.speed / avSpeed);
        }

        if ( val2 < val1) {
            x1 = k1out.influence / 100;
            y1 = (-x1) * k1out.speed / avSpeed;
            x2 = k2in.influence / 100;
            y2 = 1 * x2 * (k2in.speed / avSpeed);
            x2 = 1 * x2;
        }

        if (val1 === val2) {
            x1 = k1out.influence / 100;
            y1 = (-x1) * k1out.speed / ((max * min)/(t2 * t1)) ;
            x2 = k2in.influence / 100;
            y2 = 1 * x2 * (k2in.speed / ((max * min)/(t2 * t1)));
            x2 = 1 * x2;
        }

        curves.push([
            insureNumber(x1),
            insureNumber(y1),
            insureNumber(x2),
            insureNumber(y2)
        ]);
    }

    return {
        getCurves : function() {
            return curves;
        }
    }
}
