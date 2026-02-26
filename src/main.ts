import { assetsManager } from './managers/assetsManager.js';
import { componentsManager } from './managers/componentsManager.js';
import { gameState } from './managers/gameState.js';
import { renderer } from './managers/renderer.js';
import { resizeManager } from './managers/resizeManager.js';
import { glassConfig } from './configs/glassConfig.js';
import { eventsManager } from './managers/eventsManager.js';
import { assetsManagerEventsData } from './eventsData/assetsManagerEventsData.js';
import { anyComponentInitDataType } from './types/componentCreationTypes.js';

export { eventsManager } from './managers/eventsManager.js';
export { rendererEventsData } from './eventsData/rendererEventsData.js';
export type { anyComponentInitDataType } from './types/componentCreationTypes.js';
/** description */

type assetsConfigType = {

    commonPath: string,
    assetsList: {

        name: string,
        path: string,
    }[],
    spritesheetsList: {

        spritesheetPath: string,  spritesheetJsonPath:  string
    }[]
};

type layoutConfigType = anyComponentInitDataType[];

type glassInitDataType = {
    canvas: HTMLCanvasElement, 
    gl: WebGL2RenderingContext, 
    gameData: {
        width: number, 
        height: number
    },
    layoutData: layoutConfigType,
    assetsData: assetsConfigType
};

function initialize(initData:  glassInitDataType) {

    const canvas = initData.canvas;
    const gl = initData.gl;
    const config = glassConfig
    if (!gl) {
        return;
    }

    resizeManager.initialize({canvas, gl})
    gameState.initialize(initData.gameData);
    componentsManager.initialize(initData.layoutData);
    assetsManager.initialize({gl, assetsData: initData.assetsData});
    renderer.initialize({gl});

    eventsManager.addEventListener(assetsManagerEventsData.allAssetsLoaded.name, () => {

        renderer.startRendering();

    }, {oneTime: true});

    if (config.exposeGlassAppInConsole === true) {

        //@ts-ignore //? [DEV-ONLY]
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
