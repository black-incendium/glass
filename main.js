import { assetsManager } from './assetsManager.js';
import { componentsManager } from './componentsManager.js';
import { gameState } from './gameState.js';
import { renderer } from './renderer.js';
import { resizeManager } from './resizeManager.js';
import { glassConfig } from './glassConfig.js';
import { eventsManager } from './eventsManager.js';
import { assetsManagerEventsData } from './eventsData/assetsManagerEventsData.js';

/** description */

function initialize(data) {

    const canvas = data.canvas;
    const gl = data.gl;
    const config = glassConfig
    if (!gl) {
        return;
    }

    resizeManager.initialize({canvas, gl})
    gameState.initialize(data.gameData);
    componentsManager.initialize(data.layoutData);
    assetsManager.initialize({gl, assetsData: data.assetsData});
    renderer.initialize({gl});

    eventsManager.addEventListener(assetsManagerEventsData.allAssetsLoaded.id, () => {

        renderer.startRendering();

    }, {oneTimeEvent: true});

    if (config.exposeGlassAppInConsole) {

        window.glassApp = Object.freeze({
            assetsManager,
            resizeManager,
            componentsManager,
            gameState,
            renderer,
            canvas,
            gl,
            config
        });
    }
}

export const glass = {
    initialize
}