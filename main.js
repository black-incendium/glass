import { assetsManager } from './assetsManager.js';
import { componentsManager } from './componentsManager.js';
import { gameState } from './gameState.js';
import { renderer } from './renderer.js';
import { resizeManager } from './resizeManager.js';

/** description */

function initialize(data) {

    const canvas = data.canvas;
    const gl = data.gl;
    if (!gl) {
        return;
    }

    resizeManager.initialize({canvas, gl})
    gameState.initialize(data.gameData);
    componentsManager.initialize(data.layoutData);
    assetsManager.initialize({gl, assetsData: data.assetsData});
    renderer.initialize({gl});
    renderer.startRendering();
}

export const glass = {
    initialize
}