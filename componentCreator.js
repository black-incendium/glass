export const componentCreator = (()=>{

    function newContainer(componentData) {

        let x = componentData?.x ?? 0;
        let y = componentData?.y ?? 0;
        let scaleX = componentData?.scaleX ?? componentData?.scale ?? 1;
        let scaleY = componentData?.scaleY ?? componentData?.scale ?? 1;
        let rotation = (componentData?.rotation ?? 0)/360*2*Math.PI;
        let alpha = componentData?.alpha ?? 1;
        let maskOn = componentData?.mask !== undefined ? true : false;
        let mask = componentData?.mask ?? {x:0,y:0,width:0,height:0}
        mask.maskOn = maskOn;

        let parent = null;
        let children = componentData?.children ?? [];
        let id = componentData.id;

        function getPosition() {

            return {x, y};
        }

        function setPosition(positionObject) {

            if (positionObject.x !== undefined) {

                x = positionObject.x
            }

            if (positionObject.y !== undefined) {

                y = positionObject.y
            }
        }

        function getScale() {

            return {x: scaleX, y: scaleY};
        }

        function setScale(scaleObject) {

            scaleX = scaleObject.x;
            scaleY = scaleObject.y;
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

        function setParent(parentArg) {

            parentArg.children.push(returnObject);
            parent = parentArg
        }

        function getTotalAlpha() {
            
            const parentTotalAlpha = getParent()?.getTotalAlpha?.() ?? 1;

            return getAlpha()*parentTotalAlpha;
            
        }

        function getOwnMask() {

            return mask;
        }

        function getMask() {

            return getParent()?.getOwnMask?.() ?? {x:0,y:0,width:0,height:0,maskOn:false};
        }

        const returnObject = {

            getPosition,
            setPosition,
            getScale,
            setScale,
            getRotation,
            setRotation,
            getAlpha,
            setAlpha,
            getParent,
            setParent,
            getTotalAlpha,
            getMask,
            getOwnMask,

            id,
            type: 'container',
            children
        };

        return returnObject;
    }

    function newSprite(componentData) {

        const baseObject = newContainer(componentData);

        const assets = componentData?.assets ?? [];
        let curretAssetIndex = componentData?.assetIndex ?? 0;

        function getCurrentAssetName() {

            return assets[curretAssetIndex];
        }

        function setAssetIndex(value) {

            curretAssetIndex = value;
        }

        const returnObject = {

            ...baseObject,

            type: 'sprite',

            getCurrentAssetName,
            setAssetIndex,
        }

        return returnObject;
    }

    return {

        newContainer,
        newSprite
    }
})();