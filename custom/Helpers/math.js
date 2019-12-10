
/**
 * Calculate the curve of a quadratic bezier.
 * @param {point}       p0
 * @param {point}       p1
 * @param {point}       p2
 * @param {float[0-1]}  t
 * @returns {{x: number, y: number}}
 */
var QuadraticBezier = function(p0, p1, p2, t) {
    return new Point(
        Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x,
        Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y
    );
}

/**
 * Returns a Cubic Bezier
 * @param p0
 * @param p1
 * @param t
 * @returns {{x: *, y: *}}
 * @constructor
 */
var CubicBezier = function(p0, p1, p2, p3, t) {
    return new Point(
        Math.pow(1 - t, 3) * p0.x + Math.pow(1 - t, 2) * 3 * t * p1.x + (1 - t) * 3 * t * t * p2.x + t * t * t * p3.x,
        Math.pow(1 - t, 3) * p0.y + Math.pow(1 - t, 2) * 3 * t * p1.y + (1 - t) * 3 * t * t * p2.y + t * t * t * p3.y
    );
}

/**
 * @param {float} t   Time
 * @param {float} B   Begin
 * @param {float} c   Change
 * @param {float} d   Duration
 */
var PennersFormula = function(t, b, c, d) {
    return b + c * ((t /= d) * t * t * t * t);
}

/**
 * This is specifically for AfterEffects and translating easing to cubic beziers.
 * @type {{easeInQuad: (function(*, *, *, *): *), easeInOutSine: (function(*, *, *, *): *)}}
 */
var Penner = {
    easeInQuad : function (t, b, c, d) {
        return c * (t /= d) * t + b;
    },

    easeInOutSine : function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
}