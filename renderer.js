import { utils } from './utils.js';
import { m3 } from './m3.js';
import { assetsManager } from "./assetsManager.js";
import { gameState } from './gameState.js';
import { componentsManager } from './componentsManager.js';
import { resizeManager } from './resizeManager.js';

export const renderer = (()=>{

    let gl;
    let matrixLocation;
    let opacityLocation;
    let textureLocation;
    let root;
    let gameSize;
    let gameToClipSpaceScaleData;
    let matrixStack = [];

    function initialize(data) {

        gl = data.gl;
        setupProgram();
    }

    function setupProgram() {

        const vertexShaderSource = `#version 300 es

        in vec2 a_position;
        in vec2 a_texcoord;

        uniform mat3 u_matrix;

        out vec2 v_texcoord;

        void main() {

            vec2 position = (u_matrix * vec3(a_position, 1.0)).xy;

            gl_Position = vec4(position.x, -position.y, 0.0, 1.0);

            v_texcoord = a_texcoord;
        }
        `;

        const fragmentShaderSource = `#version 300 es

        precision highp float;

        in vec2 v_texcoord;

        uniform sampler2D u_texture;
        uniform float u_opacity;

        out vec4 outColor;

        void main() {
            outColor = vec4(texture(u_texture, v_texcoord).xyz, u_opacity);
        }
        `;

        const program = utils.createProgramFromShaders(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

        matrixLocation = gl.getUniformLocation(program, "u_matrix");
        opacityLocation = gl.getUniformLocation(program, "u_opacity");
        textureLocation = gl.getUniformLocation(program, "u_texture");

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            0, 0,
            0, 1,
            1, 1,
            1, 0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        const texcoords = [
            0, 0,
            0, 1,
            1, 1,
            1, 0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texcoordAttributeLocation);
        gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, true, 0, 0);

        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
    }

    function recursiveDrawComponent(component) {

        const componentTransformationsMatrix = m3.getComponentTransformationsMatrix({

            currentMatrix: matrixStack[matrixStack.length - 1],

            translation: {

                x: component.getX(),
                y: component.getY(),
            },

            scaling: {

                x: component.getScale().x,
                y: component.getScale().y,
            },

            rotation: {

                angle: component.getRotation()
            }
        });

        const componentMaskTransformationsMatrix = m3.getComponentTransformationsMatrix({

            currentMatrix: matrixStack[matrixStack.length - 1],

            translation: {

                x: component.getMask().x,
                y: component.getMask().y,
            },

            scaling: {

                x: 1,
                y: 1,
            },

            rotation: {

                angle: 0
            }
        });

        if (component.type == 'sprite') {

            if (component.getMask().maskOn === true) {

                gl.enable(gl.STENCIL_TEST);

                gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

                gl.stencilFunc(gl.ALWAYS, 1, 0xff);
                gl.stencilMask(0xff);
                // gl.depthMask(false);
                gl.colorMask(false, false, false, false);

                let textureInfo = assetsManager.getAssetDataByName('maskAsset');

                const textureUnit = 0;
                gl.uniform1i(textureLocation, textureUnit);

                gl.activeTexture(gl.TEXTURE0 + textureUnit);
                gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);

                gl.uniform1f(opacityLocation, 1.0);

                gl.uniformMatrix3fv(matrixLocation, false, m3.multiplyMatrices([
                    m3.getScalingMatrix(component.getMask().width, component.getMask().height), 
                    componentMaskTransformationsMatrix,
                    m3.getTranslationMatrix(-gameSize.width/2,-gameSize.height/2),
                    m3.getScalingMatrix(gameToClipSpaceScaleData.x, gameToClipSpaceScaleData.y)
                ]));

                const offset = 0;
                const count = 4;
                gl.drawArrays(gl.TRIANGLE_FAN, offset, count);
                // gl.depthMask(true);
                gl.colorMask(true, true, true, true);
            }

            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            gl.stencilFunc(gl.EQUAL, 1, 0xff);
            gl.stencilMask(0x00);

            let textureInfo = assetsManager.getAssetDataByName(component.getCurrentAssetName());

            const textureUnit = 0;
            gl.uniform1i(textureLocation, textureUnit);

            gl.activeTexture(gl.TEXTURE0 + textureUnit);
            gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);

            gl.uniform1f(opacityLocation, component.getTotalAlpha());

            gl.uniformMatrix3fv(matrixLocation, false, m3.multiplyMatrices([
                m3.getScalingMatrix(textureInfo.width, textureInfo.height), 
                componentTransformationsMatrix,
                m3.getTranslationMatrix(-gameSize.width/2,-gameSize.height/2),
                m3.getScalingMatrix(gameToClipSpaceScaleData.x, gameToClipSpaceScaleData.y)
            ]));

            const offset = 0;
            const count = 4;
            gl.drawArrays(gl.TRIANGLE_FAN, offset, count);

            gl.disable(gl.STENCIL_TEST);
        }

        matrixStack.push(componentTransformationsMatrix);

        component?.children?.forEach(children => {

            recursiveDrawComponent(children);
        });

        matrixStack.pop();
    }

    function render(time) {

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

        const canvasSize = resizeManager.getCanvasSize();
        gameSize = gameState.getGameSize();
        gameToClipSpaceScaleData = canvasSize.width/canvasSize.height < gameSize.width/gameSize.height ? {

            x: 2/gameSize.width,
            y: 2/gameSize.width * canvasSize.width/canvasSize.height
        } : {

            x: 2/gameSize.height * canvasSize.height/canvasSize.width,
            y: 2/gameSize.height
        };

        root.children?.forEach(children => {
            
            recursiveDrawComponent(children);
        });

        requestAnimationFrame(render);
    }

    function startRendering() {

        root = componentsManager.getComponentsTreeRoot();

        matrixStack[0] = m3.getIdentityMatrix();
        
        requestAnimationFrame(render);
    }

    return {

        initialize,
        startRendering
    }
})();