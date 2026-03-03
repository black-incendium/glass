export const mathUtils = (() => {

    function getRadiansFromDegrees(degrees: number): number {

        return degrees * (Math.PI / 180);
    }

    function getPointByRatioBetweenTwoPoints(point1: {x: number, y: number}, point2: {x: number, y: number}, ratio: number): {x: number, y: number} {
        return {
            x: point1.x * (1 - ratio) + point2.x * ratio,
            y: point1.y * (1 - ratio) + point2.y * ratio,
        }
    }

    return {

        getRadiansFromDegrees,
        getPointByRatioBetweenTwoPoints
    }
})();