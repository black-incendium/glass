import { gameState } from "./gameState.js";

export const componentsManager = (()=>{

    let gameContainer = {id:"gameContainer"};
    let components = {};

    function initialize(layoutData) {

        gameContainer.children = [];

        for (let elementName of Object.getOwnPropertyNames(layoutData)) {

            gameContainer.children = layoutData;
        }

        recursiveTraverseComponentsTreeNode(gameContainer);
    }

    function recursiveTraverseComponentsTreeNode(parentNode) {

        if (parentNode.children == undefined) return;

        const children = [];

        for (let elementName of Object.getOwnPropertyNames(parentNode.children)) {

            if (components[elementName] != undefined) return; //! warn

            components[elementName] = parentNode.children[elementName];
            children.push(parentNode.children[elementName]);
            parentNode.children[elementName].parent = parentNode;
            parentNode.children[elementName].id = elementName;

            recursiveTraverseComponentsTreeNode(parentNode.children[elementName]);
        }

        parentNode.children = children;
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