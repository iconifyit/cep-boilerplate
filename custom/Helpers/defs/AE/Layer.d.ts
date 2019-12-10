/**
 * Layer interface.
 */
interface Layer {

    active : boolean;

    activeAtTime : boolean;

    addGuide : Function;

    addProperty : Function;

    addToMotionGraphicsTemplate : Function;

    addToMotionGraphicsTemplateAs : Function;

    adjustmentLayer : Layer;

    applyPreset : Function;

    audioActive : boolean;

    audioActiveAtTime : boolean;

    audioEnabled : boolean;

    autoOrient : boolean;

    blendingMode : object;

    calculateTransformFromPoints : Function;

    canAddProperty : boolean;

    canAddToMotionGraphicsTemplate : boolean;

    canSetCollapseTransformation : boolean;

    canSetEnabled : boolean;

    canSetTimeRemapEnabled : boolean;

    collapseTransformation : boolean;

    comment : string;

    compPointToSource : Function;

    // @ts-ignore
    containingComp : CompItem;

    copyToComp : Function;

    duplicate : Function;

    effectsActive : boolean;

    elided : boolean;

    enabled : boolean;

    environmentLayer : Layer;

    frameBlending : null;

    frameBlendingType : null;

    getRenderGUID : Function;

    guideLayer : Layer;

    // @ts-ignore
    guides : Array<Guide>;

    hasAudio : boolean;

    hasTrackMatte : boolean;

    hasVideo : boolean;

    height : number;

    inPoint : number;

    index : number;

    isEffect : boolean;

    isMask : boolean;

    isModified : boolean;

    isNameFromSource : boolean;

    isNameSet : boolean;

    isTrackMatte : boolean;

    label : string;

    lightType : object;

    locked : boolean;

    matchName : string;

    motionBlur : object;

    moveAfter : Function;

    moveBefore : Function;

    moveTo : Function;

    moveToBeginning : Function;

    moveToEnd : Function;

    name : string;

    nullLayer : Layer;

    numProperties : number;

    openInViewer : Function;

    outPoint : number;

    parent : object;

    // @ts-ignore
    parentProperty : Property;

    preserveTransparency : boolean;

    property : Function;

    propertyDepth : number;

    propertyGroup : object;

    propertyType : object;

    quality : number;

    remove : Function;

    removeGuide : Function;

    replaceSource : Function;

    samplingQuality : number;

    selected : boolean;

    // @ts-ignore
    selectedProperties : Array<Property>;

    setGuide : Function;

    setParentWithJump : Function;

    shy : boolean;

    solo : boolean;

    source : object;

    sourcePointToComp : null;

    sourceRectAtTime : object;

    startTime : number;

    stretch : null;

    threeDLayer : null;

    threeDPerChar : null;

    time : number;

    timeRemapEnabled : boolean;

    trackMatteType : object;

    width : number
}
