export const componentCreator = (()=>{

    function newContainer(componentData, parentArg) {

        let x = componentData?.x ?? 0;
        let y = componentData?.y ?? 0;
        let scaleX = componentData?.scaleX ?? componentData?.scale ?? 1;
        let scaleY = componentData?.scaleY ?? componentData?.scale ?? 1;
        let rotation = (componentData?.rotation ?? 0)/360*2*Math.PI;
        let alpha = componentData?.alpha ?? 1;
        let maskOn = componentData?.mask !== undefined ? true : false;
        let mask = componentData?.mask ?? {x:0,y:0,width:0,height:0}
        mask.maskOn = maskOn;

        let parent = parentArg;
        let children = componentData?.children ?? [];
        let id = componentData.id;

        function getX() {

            return x;
        }

        function setX(value) {

            x = value;
        }

        function getY() {

            return y;
        }

        function setY(value) {

            y = value;
        }

        function getScale() {

            return {x: scaleX, y: scaleY};
        }

        function setScaleXY(x, y) {

            scaleX = x;
            scaleY = y;
        }

        function getRotation() {

            return rotation/(2*Math.PI)*360;
        }

        function setRotation(value) {

            rotation = value/360*2*Math.PI;
        }

        function getAlpha() {

            return alpha;
        }

        function setAlpha(value) {

            alpha = value;
        }

        function getParent() {

            return parent;
        }

        function getTotalAlpha() {

            const parentTotalAlpha = getParent()?.getAlpha?.() ?? 1;
            const p = getParent();
            const a = p.getAlpha?.();

            return getAlpha()*parentTotalAlpha;
        }

        function getOwnMask() {

            return mask;
        }

        function getMask() {

            return getParent().getOwnMask();
        }

        return {

            getX,
            setX,
            getY,
            setY,
            getScale,
            setScaleXY,
            getRotation,
            setRotation,
            getAlpha,
            setAlpha,
            getParent,
            getTotalAlpha,
            getMask,
            getOwnMask,

            id,
            type: 'container',
            children
        }
    }

    function newSprite(componentData, parent) {

        const baseObject = newContainer(componentData, parent);

        const assets = componentData?.assets ?? [];
        const curretAssetIndex = componentData?.assetIndex ?? 0;

        function getCurrentAssetName() {

            return assets[curretAssetIndex];
        }

        function setAssetIndex(value) {

            curretAssetIndex = value;
        }

        return {

            ...baseObject,

            type: 'sprite',

            getCurrentAssetName,
            setAssetIndex
        }
    }

    return {

        newContainer,
        newSprite
    }
})();