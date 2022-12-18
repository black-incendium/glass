import { gameState } from "./gameState.js";

export const componentsManager = (()=>{

    let gameContainer = {id:"gameContainer"};
    let components = {};

    function initialize(layoutData) {

        gameContainer.children = [];

        gameContainer.children = layoutData;

        recursiveParseComponentsTreeNode(gameContainer);
        gameContainer = recursiveSetupComponent(gameContainer);
    }

    function recursiveParseComponentsTreeNode(parentNode) {

        if (parentNode.children == undefined) parentNode.children = {};

        const children = [];

        for (let elementName of Object.getOwnPropertyNames(parentNode.children)) {

            if (components[elementName] != undefined) return; //! warn

            components[elementName] = parentNode.children[elementName];
            children.push(parentNode.children[elementName]);
            parentNode.children[elementName].parent = parentNode;
            parentNode.children[elementName].id = elementName;
            parentNode.children[elementName].type ??= 'container'

            recursiveParseComponentsTreeNode(parentNode.children[elementName]);
        }

        parentNode.children = children;
    }

    function recursiveSetupComponent(componentData) {

        let object = newContainer(componentData);

        if (object.type == 'sprite') object = newSprite(object, componentData);

        Object.defineProperty(object, 'type', {

            writable: false
        });

        object.children = object.children.map(child => recursiveSetupComponent(child));
        
        return object;
    }

    function newContainer(componentData) {

        let x = componentData?.x ?? 0;
        let y = componentData?.y ?? 0;
        let scaleX = componentData?.scaleX ?? componentData?.scale ?? 1;
        let scaleY = componentData?.scaleY ?? componentData?.scale ?? 1;
        let rotation = componentData?.rotation ?? 0;
        let assets = componentData?.assets ?? [];
        let type = componentData?.type ?? 'container';
        let children = componentData.children ?? [];

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

    function getComponentsTreeRoot() {

        return gameContainer;
    }

    function getComponentById(id) {

        return components[id];
    }

    return {

        initialize,
        getComponentsTreeRoot,
        getComponentById
    }
})();