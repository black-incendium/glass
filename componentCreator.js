export const componentCreator = (()=>{

    function newContainer(componentData) {

        if (componentData == undefined) debugger

        let x = componentData?.x ?? 0;
        let y = componentData?.y ?? 0;
        let scaleX = componentData?.scaleX ?? componentData?.scale ?? 1;
        let scaleY = componentData?.scaleY ?? componentData?.scale ?? 1;
        let rotation = (componentData?.rotation ?? 0)/360*2*Math.PI;
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

        return {

            getX,
            setX,
            getY,
            setY,
            getScale,
            setScaleXY,
            getRotation,
            setRotation,
            
            id,
            type: 'container',
            children
        }
    }

    function newSprite(componentData) {

        const baseObject = newContainer(componentData);

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