type matrixType = [
    number, number, number,
    number, number, number,
    number, number, number,
];

type transformationObjectType = {

    scaling: {
        x: number,
        y: number
    }
    rotation: {
        angle: number
    },
    translation: {
        x: number,
        y: number
    },
    currentMatrix: matrixType
};


export const m3 = (()=>{

    function multiplyTwoMatrices(b: matrixType, a: matrixType): matrixType {
     
        return [
            b[0 * 3 + 0]! * a[0 * 3 + 0]! + b[0 * 3 + 1]! * a[1 * 3 + 0]! + b[0 * 3 + 2]! * a[2 * 3 + 0]!,
            b[0 * 3 + 0]! * a[0 * 3 + 1]! + b[0 * 3 + 1]! * a[1 * 3 + 1]! + b[0 * 3 + 2]! * a[2 * 3 + 1]!,
            b[0 * 3 + 0]! * a[0 * 3 + 2]! + b[0 * 3 + 1]! * a[1 * 3 + 2]! + b[0 * 3 + 2]! * a[2 * 3 + 2]!,
            b[1 * 3 + 0]! * a[0 * 3 + 0]! + b[1 * 3 + 1]! * a[1 * 3 + 0]! + b[1 * 3 + 2]! * a[2 * 3 + 0]!,
            b[1 * 3 + 0]! * a[0 * 3 + 1]! + b[1 * 3 + 1]! * a[1 * 3 + 1]! + b[1 * 3 + 2]! * a[2 * 3 + 1]!,
            b[1 * 3 + 0]! * a[0 * 3 + 2]! + b[1 * 3 + 1]! * a[1 * 3 + 2]! + b[1 * 3 + 2]! * a[2 * 3 + 2]!,
            b[2 * 3 + 0]! * a[0 * 3 + 0]! + b[2 * 3 + 1]! * a[1 * 3 + 0]! + b[2 * 3 + 2]! * a[2 * 3 + 0]!,
            b[2 * 3 + 0]! * a[0 * 3 + 1]! + b[2 * 3 + 1]! * a[1 * 3 + 1]! + b[2 * 3 + 2]! * a[2 * 3 + 1]!,
            b[2 * 3 + 0]! * a[0 * 3 + 2]! + b[2 * 3 + 1]! * a[1 * 3 + 2]! + b[2 * 3 + 2]! * a[2 * 3 + 2]!,
        ];
    }

    function multiplyMatrices(matrices: matrixType[]): matrixType {
        
        return matrices.reduce((acc, value) => {

            return multiplyTwoMatrices(acc, value);
        }, getIdentityMatrix());
    }

    function getIdentityMatrix(): matrixType {

        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ]
    }

    function getTranslationMatrix(tx: number, ty: number): matrixType {

        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    }
     
    function getOriginRotationMatrix(angleInRadians: number): matrixType {

        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        return [
            c,-s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    }
     
    function getScalingMatrix(sx: number, sy: number): matrixType {

        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    }

    function getPointRotationMatrix(angleInRadians: number, pointX: number, pointY: number) {

        return multiplyMatrices([
            getTranslationMatrix(-pointX, -pointY),
            getOriginRotationMatrix(angleInRadians),
            getTranslationMatrix(pointX, pointY)
        ]);
    }

    function getComponentTransformationsMatrix(transformationObject: transformationObjectType) {

        return multiplyMatrices([

            getScalingMatrix(transformationObject.scaling.x, transformationObject.scaling.y),
            getOriginRotationMatrix(transformationObject.rotation.angle/360*2*Math.PI),
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