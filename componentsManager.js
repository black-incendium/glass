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
            parentNode.children[elementName].type ??= 'container'

            recursiveParseComponentsTreeNode(parentNode.children[elementName]);
        }

        parentNode.children = children;
    }

    function recursiveSetupComponent(componentData) {

        let object;
        if (componentData.type == 'container') object = componentCreator.newContainer(componentData);
        if (componentData.type == 'sprite') object = componentCreator.newSprite(componentData);

        Object.defineProperty(object, 'type', {

            writable: false
        });

        object.children = object.children.map(child => recursiveSetupComponent(child));

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