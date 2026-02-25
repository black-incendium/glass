import { assetsManager } from './managers/assetsManager.js';
import { componentsManager } from './managers/componentsManager.js';
import { gameState } from './managers/gameState.js';
import { renderer } from './managers/renderer.js';
import { resizeManager } from './managers/resizeManager.js';
import { glassConfig } from './configs/glassConfig.js';
import { eventsManager } from './managers/eventsManager.js';
import { assetsManagerEventsData } from './eventsData/assetsManagerEventsData.js';

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

type layoutConfigType = anyLayoutNodeType;

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

type layoutContainerType = {

    type?: 'container'
    x?: number, y?: number,
    rotation?: number,
    scale?: number,
    mask?: {
        x?: number, y?: number,
        width?: number, height?: 0,
    },
    scaleX?: number, scaleY?: number,
    alpha?: number,
    children?:  Record<string, anyLayoutNodeType>
};

type layoutSpriteType = layoutContainerType &  {

    type: 'sprite',
    assets?: string[],
};

type anyLayoutNodeType = layoutContainerType | layoutSpriteType;

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