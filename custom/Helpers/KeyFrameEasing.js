/**
 * KeyFrameEasing object.
 * @param keyInEase
 * @param keyOutEase
 * @returns {{getEasings: (function(): [])}|Array}
 * @constructor
 */
var KeyFrameEasing = function(keyInEase, keyOutEase) {

    var easings = [];

    if (! (keyInEase instanceof Array))            return [];
    if (! (keyOutEase instanceof Array))           return [];
    if (! (keyInEase.length || keyOutEase.length)) return [];
    if (keyInEase.length !== keyOutEase.length)    return [];

    // We have two sets of values we can calculate;

    for (var i = 0; i < keyInEase.length; i++) {
        var kInSpeed     = keyInEase[i].speed,
            kInInfluence = keyInEase[i].influence,
            kOutSpeed    = keyOutEase[i].speed,
            kOutInflence = keyOutEase[i].influence;

        easings.push({
            easeIn  : new KeyframeEase(kInSpeed,  kInInfluence),
            easeOut : new KeyframeEase(kOutSpeed, kOutInflence)
        });
    }

    return {
        getEasings : function() {
            return easings;
        }
    }
}
