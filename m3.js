export const m3 = (()=>{

    function multiplyTwoMatrices(b, a) {
     
        return [
            b[0 * 3 + 0] * a[0 * 3 + 0] + b[0 * 3 + 1] * a[1 * 3 + 0] + b[0 * 3 + 2] * a[2 * 3 + 0],
            b[0 * 3 + 0] * a[0 * 3 + 1] + b[0 * 3 + 1] * a[1 * 3 + 1] + b[0 * 3 + 2] * a[2 * 3 + 1],
            b[0 * 3 + 0] * a[0 * 3 + 2] + b[0 * 3 + 1] * a[1 * 3 + 2] + b[0 * 3 + 2] * a[2 * 3 + 2],
            b[1 * 3 + 0] * a[0 * 3 + 0] + b[1 * 3 + 1] * a[1 * 3 + 0] + b[1 * 3 + 2] * a[2 * 3 + 0],
            b[1 * 3 + 0] * a[0 * 3 + 1] + b[1 * 3 + 1] * a[1 * 3 + 1] + b[1 * 3 + 2] * a[2 * 3 + 1],
            b[1 * 3 + 0] * a[0 * 3 + 2] + b[1 * 3 + 1] * a[1 * 3 + 2] + b[1 * 3 + 2] * a[2 * 3 + 2],
            b[2 * 3 + 0] * a[0 * 3 + 0] + b[2 * 3 + 1] * a[1 * 3 + 0] + b[2 * 3 + 2] * a[2 * 3 + 0],
            b[2 * 3 + 0] * a[0 * 3 + 1] + b[2 * 3 + 1] * a[1 * 3 + 1] + b[2 * 3 + 2] * a[2 * 3 + 1],
            b[2 * 3 + 0] * a[0 * 3 + 2] + b[2 * 3 + 1] * a[1 * 3 + 2] + b[2 * 3 + 2] * a[2 * 3 + 2],
        ];
    }

    function multiplyMatrices(matrices) {
        
        return matrices.reduce((acc, value) => {

            return multiplyTwoMatrices(acc, value);
        }, getIdentityMatrix());
    }

    function getIdentityMatrix() {

        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]
    }

    function getTranslationMatrix(tx, ty) {

        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    }
     
    function getOriginRotationMatrix(angleInRadians) {

        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    }
     
    function getScalingMatrix(sx, sy) {

        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    }

    function getPointRotationMatrix(angleInRadians, pointX, pointY) {

        return multiplyMatrices([
            getTranslationMatrix(-pointX, -pointY),
            getOriginRotationMatrix(angleInRadians),
            getTranslationMatrix(pointX, pointY)
        ]);
    }

    function getComponentTransformationsMatrix(transformationObject) {

        return multiplyMatrices([

            getOriginRotationMatrix(transformationObject.rotation.angle),
            getScalingMatrix(transformationObject.scaling.x, transformationObject.scaling.y),
            getTranslationMatrix(transformationObject.translation.x, transformationObject.translation.y),
            transformationObject.currentMatrix,
        ]);
        
    }

    return {
        getIdentityMatrix,
        getScalingMatrix,
        getPointRotationMatrix,
        getTranslationMatrix,
        multiplyTwoMatrices,
        multiplyMatrices,
        getComponentTransformationsMatrix
    }
})()