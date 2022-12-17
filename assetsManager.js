export const assetsManager = (()=>{

    let gl;
    let loadedAssetsNumber;
    let assets = {};

    function initialize(data) {

        gl = data.gl;

        data.assetsData.assetsList.forEach(el => {

            loadAsset(el.name, data.assetsData.commonPath + el.path);
        });

        loadedAssetsNumber = 0;
    }

    function loadAsset(assetName, url) {

        if (assets[assetName] != undefined) return //? --- warn

        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);

        const textureInfo = {
            width: 1,
            height: 1,
            texture
        };

        const img = new Image();
        img.addEventListener('load', function() {
            textureInfo.width = img.width;
            textureInfo.height = img.height;

            gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);

            loadedAssetsNumber++;
        });
        img.src = url;

        assets[assetName] = textureInfo;
    }

    function getAssetDataByName(assetName) {

        return assets[assetName];
    }

    return {

        initialize,
        getAssetDataByName
    }
})();