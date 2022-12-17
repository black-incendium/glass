import { assetsManager } from './assetsManager.js';
import { componentsManager } from './componentsManager.js';
import { gameState } from './gameState.js';
import { renderer } from './renderer.js';

/** description */

function initialize(data) {

    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameState.initialize(data.gameData);
    componentsManager.initialize(data.layoutData);
    assetsManager.initialize({gl, assetsData: data.assetsData});
    renderer.initialize({gl});
    renderer.startRendering();
}

export const glass = {
    initialize
}