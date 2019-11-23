/**
 * Property interface.
 */
interface Property {

    active : boolean;

    addKey : Function;

    addToMotionGraphicsTemplate : Function;

    canAddToMotionGraphicsTemplate : null;

    canSetEnabled : boolean;

    canSetExpression : boolean;

    canVaryOverTime : boolean;

    dimensionsSeparated : null;

    duplicate : Function;

    elided : boolean;

    enabled : boolean;

    expression : null;

    expressionEnabled : boolean;

    expressionError : null;

    getSeparationFollower : Function;

    hasMax : boolean;

    hasMin : boolean;

    isEffect : boolean;

    isInterpolationTypeValid : boolean;

    isMask : boolean;

    isModified : boolean;

    isSeparationFollower : boolean;

    isSeparationLeader : boolean;

    isSpatial : boolean;

    isTimeVarying : boolean;

    keyInInterpolationType : Function;

    keyInSpatialTangent : Function;

    keyInTemporalEase : Function;

    keyOutInterpolationType : Function;

    keyOutSpatialTangent : Function;

    keyOutTemporalEase : Function;

    keyRoving : Function;

    keySelected : Function;

    keySpatialAutoBezier : Function;

    keySpatialContinuous : Function;

    keyTemporalAutoBezier : Function;

    keyTemporalContinuous : Function;

    keyTime : Function;

    keyValue : Function;

    matchName : string;

    maxValue : number;

    minValue : number;

    moveTo : Function;

    name : string;

    nearestKeyIndex : Function;

    numKeys : number;

    parentProperty : null;

    propertyDepth : number;

    propertyGroup : null;

    propertyIndex : number;

    // @ts-ignore
    propertyType : PropertyType;

    // @ts-ignore
    propertyValueType : PropertyValueType;

    remove : Function;

    removeKey : Function;

    selected : boolean;

    selectedKeys : [];

    separationDimension : null;

    separationLeader : null;

    setInterpolationTypeAtKey : Function;

    setRovingAtKey : Function;

    setSelectedAtKey : Function;

    setSpatialAutoBezierAtKey : Function;

    setSpatialContinuousAtKey : Function;

    setSpatialTangentsAtKey : Function;

    setTemporalAutoBezierAtKey : Function;

    setTemporalContinuousAtKey : Function;

    setTemporalEaseAtKey : Function;

    setValue : Function;

    setValueAtKey : Function;

    setValueAtTime : Function;

    setValuesAtTimes : Function;

    unitsText : null;

    value : null;

    valueAtTime : Function;
}
