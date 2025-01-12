import { assetsManagerEventsData } from "./eventsData/assetsManagerEventsData.js";
import { eventsManager } from "./eventsManager.js";

export const assetsManager = (()=>{

    let gl;
    let loadedAssetsNumber;
    let totalAssetsToLoadNumber;
    let fetchedSpritesheetJsonsNumber;
    let totalSpritesheetJsonsToFetchNumber;
    let assets = {};
    let managerInitialized = false;

    function initialize(data) {

        gl = data.gl;
        loadedAssetsNumber = 0;
        fetchedSpritesheetJsonsNumber = 0;
        totalSpritesheetJsonsToFetchNumber = data.assetsData.spritesheetsList.length;
        totalAssetsToLoadNumber = data.assetsData.assetsList.length; // doesn't include all assets as long as all spritesheets are not fetched
        
        data.assetsData.assetsList.forEach(el => {

            loadSingularAsset(el.name, data.assetsData.commonPath + el.path);
        });

        data.assetsData.spritesheetsList.forEach(el => {


            loadSpritesheetAsset(data.assetsData.commonPath + el.spritesheetPath, data.assetsData.commonPath + el.spritesheetJsonPath);
        });

        managerInitialized = true;
    }

    function loadSingularAsset(assetName, url) {

        if (assets[assetName] !== undefined) return //? --- warn

        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);

        const img = new Image();
        img.addEventListener('load', function() {

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);

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
                }
            };

            incrementNumberOfLoadedAssets();
        });

        img.src = url;
    }

    function loadSpritesheetAsset(spritesheetUrl, spritesheetJsonUrl) {

        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
                        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);

        const img = new Image();    
        img.addEventListener('load', function() {

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);

            fetch(spritesheetJsonUrl)
                .then(response => response.json())
                .then(data => {

                    totalAssetsToLoadNumber += data.sprites.length;
                    incrementNumberOfFetchedSpritesheetJsons();

                    data.sprites.forEach(spriteData => {
                        
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
                                    x: spriteData.width / img.width,
                                    y: spriteData.height / img.height
                                },
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

    function getAssetDataByName(assetName) {

        return assets[assetName];
    }

    function incrementNumberOfFetchedSpritesheetJsons() {

        if (managerInitialized === false) {

            console.error(`incrementNumberOfFetchedSpritesheetJsons called before manager initialization`);
            return
        }

        fetchedSpritesheetJsonsNumber++;
    }

    function incrementNumberOfLoadedAssets() {

        if (managerInitialized === false) {

            console.error(`incrementNumberOfLoadedAssets called before manager initialization`);
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