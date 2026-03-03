import { assetsManagerEventsData } from "../eventsData/assetsManagerEventsData.js";
import { mathUtils } from "../utils/mathUtils.js";
import { eventsManager } from "./eventsManager.js";

export type assetType = {
    texture:WebGLTexture,
    width: number,
    height: number,
    sourceTextureMatricesData: {
        translation: {
            x: number,
            y: number
        },
        scale: {
            x: number,
            y: number
        },
        rotation: number,
        rotationCalculationTranslation: {
            x: number,
            y: number
        }
    }
};

export type assetsManagerInitDataType = {

    gl: WebGL2RenderingContext,
    assetsData: {
        commonPath: string,
        spritesheetsList: {
            spritesheetPath: string,
            spritesheetJsonPath: string,
        }[],
        assetsList: {
            name: string,
            path: string,
        }[]
    }
};

export type spritesheetDataType = {

    sprites: {

        name:string,
        width:number,
        height:number,
        x:number,
        y:number
        rotation: number
    }[]
};

export const assetsManager = (() => {

    let gl: WebGL2RenderingContext;
    let loadedAssetsNumber: number;
    let totalAssetsToLoadNumber: number;
    let fetchedSpritesheetJsonsNumber: number;
    let totalSpritesheetJsonsToFetchNumber: number;
    let assets = {} as Record<string, assetType>;
    let managerInitialized = false;

    function initialize(initData: assetsManagerInitDataType): void {

        gl = initData.gl;
        loadedAssetsNumber = 0;
        fetchedSpritesheetJsonsNumber = 0;
        totalSpritesheetJsonsToFetchNumber = initData.assetsData.spritesheetsList.length;
        totalAssetsToLoadNumber = initData.assetsData.assetsList.length; // doesn't include all assets as long as all spritesheets are not fetched
        
        initData.assetsData.assetsList.forEach(el => {

            loadSingularAsset(el.name, initData.assetsData.commonPath + el.path);
        });

        initData.assetsData.spritesheetsList.forEach(el => {

            loadSpritesheetAsset(initData.assetsData.commonPath + el.spritesheetPath, initData.assetsData.commonPath + el.spritesheetJsonPath);
        });

        managerInitialized = true;
    }

    function loadSingularAsset(assetName: string, url: string): void {

        if (assets[assetName] !== undefined) {
        
            console.log(`assetsManager: asset with the name: ${assetName} already exists!`);
            return;
        }

        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const img = new Image();
        img.addEventListener('load', function() {

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            assets[assetName] = {
                texture,
                width: img.width,
                height: img.height,
                sourceTextureMatricesData: {
                    translation: {
                        x: 0,
                        y: 0
                    },
                    scale: {
                        x: 1,
                        y: 1
                    },
                    rotationCalculationTranslation: {
                        x: 0,
                        y: 0
                    },
                    rotation: 0,
                }
            };

            incrementNumberOfLoadedAssets();
        });

        img.src = url;
    }

    function loadSpritesheetAsset(spritesheetUrl: string, spritesheetJsonUrl: string): void {

        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
                        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const img = new Image();    
        img.addEventListener('load', function() {

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            fetch(spritesheetJsonUrl)
                .then(response => response.json())
                .then((spritesheetData: spritesheetDataType) => {

                    totalAssetsToLoadNumber += spritesheetData.sprites.length;
                    incrementNumberOfFetchedSpritesheetJsons();

                    spritesheetData.sprites.forEach(spriteData => {
                        
                        if (assets[spriteData.name] !== undefined) return //? --- warn

                        assets[spriteData.name] = {
                            texture,
                            width: spriteData.width,
                            height: spriteData.height,
                            sourceTextureMatricesData: {
                                translation: {
                                    x: spriteData.x / img.width,
                                    y: spriteData.y / img.height
                                },
                                scale: {
                                    x: (spriteData.width - 0.01) / img.width,
                                    y: (spriteData.height - 0.01) / img.height
                                },
                                rotationCalculationTranslation:  {
                                    x: (spriteData.width / 2) / img.width,
                                    y: (spriteData.height / 2) / img.height
                                },
                                rotation: mathUtils.getRadiansFromDegrees(spriteData.rotation ?? 0)
                            }
                        };

                        incrementNumberOfLoadedAssets();
                    })
                })
                .catch(err  => {

                    console.error(`Error loading JSON for spritesheet: `, err);
                });
        });

        img.src = spritesheetUrl;
    }

    function getAssetDataByName(assetName: string): assetType | null {

        return assets[assetName] ?? null;
    }

    function incrementNumberOfFetchedSpritesheetJsons(): void {

        if (managerInitialized === false) {

            console.error(`assetsManager: incrementNumberOfFetchedSpritesheetJsons called before manager initialization!`);
            return
        }

        fetchedSpritesheetJsonsNumber++;
    }

    function incrementNumberOfLoadedAssets(): void {

        if (managerInitialized === false) {

            console.error(`assetsManager: incrementNumberOfLoadedAssets called before manager initialization!`);
            return
        }

        loadedAssetsNumber++;

        if (fetchedSpritesheetJsonsNumber === totalSpritesheetJsonsToFetchNumber && loadedAssetsNumber === totalAssetsToLoadNumber) {

            eventsManager.fireEvent(assetsManagerEventsData.allAssetsLoaded);
        }
    }

    return {

        initialize,
        getAssetDataByName
    }
})();