import { gameState } from "./gameState.js";
import { componentCreator } from "./componentCreator.js";

export const componentsManager = (()=>{

    let gameContainer = {id:"gameContainer", type:'container'};
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

            children.push(parentNode.children[elementName]);
            parentNode.children[elementName].parent = parentNode;
            parentNode.children[elementName].id = elementName;

            recursiveParseComponentsTreeNode(parentNode.children[elementName]);
        }

        parentNode.children = children;
    }

    function recursiveSetupComponent(componentData, parent) {

        let object;

        componentData?.children?.forEach?.(child => {

            for (let key of Object.getOwnPropertyNames(componentData?.childrenCommonProperties ?? {})) {
                child[key] = child[key] ?? componentData?.childrenCommonProperties[key];
            }
        });

        if (componentData.type == 'sprite') object = componentCreator.newSprite(componentData, parent);
        if (componentData.type == 'container' || componentData.type == undefined) object = componentCreator.newContainer(componentData, parent);

        Object.defineProperty(object, 'type', {

            writable: false
        });

        object.children = object.children.map(child => recursiveSetupComponent(child, object));

        components[object.id] = object;
        
        return object;
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