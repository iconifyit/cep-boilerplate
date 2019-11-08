/**
 * Compisition Helper object.
 * @param {Composition}    compItem
 * @constructor
 */
var CompHelper = function(theItem) {
    // var _KEYS = [
    //     'active',
    //     'adjustmentLayer',
    //     'audioActive',
    //     'audioEnabled',
    //     'autoOrient',
    //     'blendingMode',
    //     'canSetCollapseTransformation',
    //     'canSetEnabled',
    //     'canSetTimeRemapEnabled',
    //     'collapseTransformation',
    //     'comment',
    //     'containingComp',
    //     'effectsActive',
    //     'elided',
    //     'enabled',
    //     'environmentLayer',
    //     'frameBlending',
    //     'frameBlendingType',
    //     'guideLayer',
    //     'guides',
    //     'hasAudio',
    //     'hasTrackMatte',
    //     'hasVideo',
    //     'height',
    //     'inPoint',
    //     'index',
    //     'isEffect',
    //     'isMask',
    //     'isModified',
    //     'isNameFromSource',
    //     'isNameSet',
    //     'isTrackMatte',
    //     'label',
    //     'locked',
    //     'matchName',
    //     'motionBlur',
    //     'name',
    //     'nullLayer',
    //     'numProperties',
    //     'outPoint',
    //     'parent',
    //     'parentProperty',
    //     'preserveTransparency',
    //     'propertyDepth',
    //     'propertyType',
    //     'quality',
    //     'samplingQuality',
    //     'selected',
    //     'selectedProperties',
    //     'shy',
    //     'solo',
    //     'source',
    //     'startTime',
    //     'stretch',
    //     'threeDLayer',
    //     'threeDPerChar',
    //     'time',
    //     'timeRemapEnabled',
    //     'trackMatteType',
    //     'width'
    // ];

    // var _functions = [
    //     'activeAtTime',
    //     'addGuide',
    //     'addProperty',
    //     'addToMotionGraphicsTemplate',
    //     'addToMotionGraphicsTemplateAs',
    //     'applyPreset',
    //     'audioActiveAtTime',
    //     'calculateTransformFromPoints',
    //     'canAddProperty',
    //     'canAddToMotionGraphicsTemplate',
    //     'compPointToSource',
    //     'copyToComp',
    //     'duplicate',
    //     'getRenderGUID',
    //     'moveAfter',
    //     'moveBefore',
    //     'moveTo',
    //     'moveToBeginning',
    //     'moveToEnd',
    //     'openInViewer',
    //     'property',
    //     'propertyGroup',
    //     'remove',
    //     'removeGuide',
    //     'replaceSource',
    //     'setGuide',
    //     'setParentWithJump',
    //     'sourcePointToComp',
    //     'sourceRectAtTime'
    // ];
}

extend(BaseHelper, CompHelper);

if (typeof console !== 'undefined') {
    console.log('CompHelper loaded');
}
else if (debug instanceof Function) {
    debug('CompHelper loaded');
}
