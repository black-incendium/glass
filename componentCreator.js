export const componentCreator = (()=>{

    function newContainer(componentData) {

        let x = componentData?.x ?? 0;
        let y = componentData?.y ?? 0;
        let scaleX = componentData?.scaleX ?? componentData?.scale ?? 1;
        let scaleY = componentData?.scaleY ?? componentData?.scale ?? 1;
        let rotation = (componentData?.rotation ?? 0)/360*2*Math.PI;
        let assets = componentData?.assets ?? [];
        let type = componentData?.type ?? 'container';
        let children = componentData.children ?? [];
        let id = componentData.id;

        return {

            get x() {
                return x;
            },

            set x(value) {
                x = value;
            },

            get y() {
                return y;
            },

            set y(value) {
                y = value;
            },

            get scale() {
                return {x: scaleX, y: scaleY};
            },

            setScaleXY(x, y) {
                scaleX = x;
                scaleY = y;
            },

            get rotation() {
                return rotation/(2*Math.PI)*360;
            },

            set rotation(value) {
                rotation = value/360*2*Math.PI;
            },

            get id() {
                return id
            },

            type,

            children
        }
    }

    function newSprite(baseObject, componentData) {

        const assets = componentData.assets;

        return {

            ...baseObject,

            type: 'sprite',

            get assets() {
                return assets;
            },
        }
    }
    
    return {

        newContainer,
        newSprite
    }
})();