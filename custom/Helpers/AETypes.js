/**
 * AfterEffects layer types (Prefixed with $ because `NULL` is a reserved word).
 * @type {{ADJUSTMENT: string, $LIGHT: string, $AUDIO: string, $SOLID: string, $SHAPE: string, $TEXT: string, $CAMERA: string, $NULL: string}}
 */
var LayerTypes = {
    $AUDIO      : 'Audio Layer',
    $CAMERA     : 'Camera Layer',
    $SHAPE      : 'Shape Layer',
    $SOLID      : 'Solid Layer',
    $TEXT       : 'Text Layer',
    $ADJUSTMENT : 'Adjustment Layer',
    $NULL       : 'Null Layer',
    $LIGHT      : 'Light Layer'
};

/**
 * Layer types that cannot be animated.
 * @type {*[]}
 */
var NonAnimatableLayerTypes = [
    LayerTypes.$AUDIO,
    LayerTypes.$CAMERA
]
