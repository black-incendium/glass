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

        componentData?.children?.forEach?.(child => {

            for (let key of Object.getOwnPropertyNames(componentData?.childrenCommonProperties ?? {})) {
                child[key] = child[key] ?? componentData?.childrenCommonProperties[key];
            }
        });

        const object = createComponent(componentData);

        if (parent != undefined) object.setParent(parent);

        object.children = object.children.map(child => recursiveSetupComponent(child, object));
        
        return object;
    }

    function createComponent(componentData) {

        let component;

        if (componentData.type == 'sprite') component = componentCreator.newSprite(componentData);
        if (componentData.type == 'container' || componentData.type == undefined) component = componentCreator.newContainer(componentData);

        Object.defineProperty(component, 'type', {
            
            writable: false
        });
        
        if (components[component.id] !== undefined) {

            console.warn(`component with id ${component.id} already exists!`);
        }

        if (component.id === "tile0x0") window.c = components;
        components[component.id] = component;

        return component
    }

    function getComponentsTreeRoot() {

        return gameContainer;
    }

    function getComponentById(id) {

        return components[id];
    }

    function getComponents() {

        return components;
    }

    return {

        initialize,
        getComponentsTreeRoot,
        getComponentById,
        getComponents,
        createComponent
    }
})();