import { assetsManager } from './managers/assetsManager.js';
import { componentsManager } from './managers/componentsManager.js';
import { appStateManager } from './managers/appStateManager.js';
import { renderer } from './managers/renderer.js';
import { resizeManager } from './managers/resizeManager.js';
import { glassConfig } from './configs/glassConfig.js';
import { eventsManager } from './managers/eventsManager.js';
import { assetsManagerEventsData } from './eventsData/assetsManagerEventsData.js';
import { anyComponentInitDataType } from './types/componentCreationTypes.js';
import { inputManager } from './managers/inputManager.js';
import { mathUtils } from './utils/mathUtils.js';
import { coordinatesType, sizeType } from './types/globalTypes.js';
export { mathUtils } from './utils/mathUtils.js';
export { assetsManager } from './managers/assetsManager.js';
export { progressorsManager } from './managers/progressorsManager.js';
export { componentsManager } from './managers/componentsManager.js';
export { eventsManager } from './managers/eventsManager.js';
export { inputManager } from './managers/inputManager.js';
export { rendererEventsData } from './eventsData/rendererEventsData.js';
export { inputManagerEventsData } from './eventsData/inputManagerEventsData.js';
export type { anyComponentInitDataType } from './types/componentCreationTypes.js';
export type { eventType } from './managers/eventsManager.js';
export type { coordinatesType, sizeType } from './types/globalTypes.js';
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
    appData: {
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
    appStateManager.initialize(initData.appData);
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
            inputManager,
            eventsManager,
            appStateManager,
            renderer,
            canvas,
            mathUtils,
            gl,
            config
        });
    }
}

export const glass = {
    initialize
}
