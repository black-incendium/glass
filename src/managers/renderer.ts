import { rendererUtils } from '../utils/rendererUtils.js';
import { m3 } from '../utils/m3.js';
import { assetsManager } from "./assetsManager.js";
import { gameState } from './gameState.js';
import { componentsManager } from './componentsManager.js';
import { resizeManager } from './resizeManager.js';
import { progressorsManager } from './progressorsManager.js';
import { eventsManager } from './eventsManager.js';
import { rendererEventsData } from '../eventsData/rendererEventsData.js';
import { CoordinatesType, sizeType } from '../types/globalTypes.js';
import { anyComponentType, containerType } from '../types/componentCreationTypes.js';

type rendererMatrix = [
   number, number, number, 
   number, number, number, 
   number, number, number 
];

export const renderer = (()=>{

    let gl: WebGL2RenderingContext;
    let matrixLocation: WebGLUniformLocation;
    let opacityLocation: WebGLUniformLocation;
    let textureLocation: WebGLUniformLocation;
    let textureMatrixLocation: WebGLUniformLocation;
    let root: containerType;
    let gameSize: sizeType;
    let gameToClipSpaceScaleData: CoordinatesType;
    let texcoordBuffer: WebGLBuffer;
    let matrixStack: rendererMatrix[] = [];
    let previousRenderTime: number;

    function initialize(initData: {gl: WebGL2RenderingContext}) {

        gl = initData.gl;
        setupProgram();
    }

    function setupProgram(): void {

        const vertexShaderSource = `#version 300 es

        in vec2 a_position;
        in vec2 a_texcoord;

        uniform mat3 u_matrix;
        uniform mat3 u_textureMatrix;

        out vec2 v_texcoord;

        void main() {

            vec2 position = (u_matrix * vec3(a_position, 1.0)).xy;

            gl_Position = vec4(position.x, -position.y, 0.0, 1.0);

            v_texcoord = (u_textureMatrix * vec3(a_texcoord, 1.0)).xy;
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

        const program = rendererUtils.createProgramFromShaders(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(program);

        if (program === null) {

            console.log(`renderer: created program  is null!`);
            return
        }

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

        const matrixLocationRaw = gl.getUniformLocation(program, "u_matrix");
        const opacityLocationRaw = gl.getUniformLocation(program, "u_opacity");
        const textureLocationRaw = gl.getUniformLocation(program, "u_texture");
        const textureMatrixLocationRaw = gl.getUniformLocation(program, "u_textureMatrix");

        if (matrixLocationRaw !== null) matrixLocation = matrixLocationRaw;
        if (opacityLocationRaw !== null) opacityLocation = opacityLocationRaw;
        if (textureLocationRaw !== null) textureLocation = textureLocationRaw;
        if (textureMatrixLocationRaw !== null) textureMatrixLocation = textureMatrixLocationRaw;

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

        texcoordBuffer = gl.createBuffer();
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

    function recursiveDrawComponent(component: anyComponentType) {

        const componentParentMask = component.parent?.mask ?? {x: 0, y: 0, isOn: false, width: 0, height: 0};

        const componentTransformationsMatrix = m3.getComponentTransformationsMatrix({

            currentMatrix: matrixStack[matrixStack.length - 1]!,

            translation: {
                x: component.x,
                y: component.y
            },

            pivotPoint:{
                x: component.pivotPointX,
                y: component.pivotPointY
            },

            scaling: {
                x: component.scaleX,
                y: component.scaleY,
            },

            rotation: {

                angle: component.rotation
            }
        });

        const componentMaskTransformationsMatrix = m3.getComponentTransformationsMatrix({

            currentMatrix: matrixStack[matrixStack.length - 1]!,

            translation: {

                x: componentParentMask.x,
                y: componentParentMask.y,
            },

            pivotPoint:{
                x: 0,
                y: 0
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

            if (componentParentMask.isOn === true) {

                gl.enable(gl.STENCIL_TEST);

                gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

                gl.stencilFunc(gl.ALWAYS, 1, 0xff);
                gl.stencilMask(0xff);
                // gl.depthMask(false);
                gl.colorMask(false, false, false, false);

                const textureInfo = assetsManager.getAssetDataByName('maskAsset');

                const textureUnit = 0;
                gl.uniform1i(textureLocation, textureUnit);

                gl.activeTexture(gl.TEXTURE0 + textureUnit);
                gl.bindTexture(gl.TEXTURE_2D, textureInfo!.texture);

                gl.uniform1f(opacityLocation, 1.0);

                gl.uniformMatrix3fv(matrixLocation, false, m3.multiplyMatrices([
                    m3.getScalingMatrix(componentParentMask.width, componentParentMask.height), 
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

            const textureInfo = assetsManager.getAssetDataByName(component.getCurrentAssetName());

            if (textureInfo === null) {

                console.log(`renderer: texture info of the asset named: ${component.getCurrentAssetName()} is null!`);
                return;
            }

            const textureMatricesData = textureInfo.sourceTextureMatricesData

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

            gl.uniformMatrix3fv(textureMatrixLocation, false, m3.multiplyTwoMatrices(
                m3.getScalingMatrix(textureMatricesData.scale.x, textureMatricesData.scale.y),
                m3.getTranslationMatrix(textureMatricesData.translation.x, textureMatricesData.translation.y)
            ));

            const offset = 0;
            const count = 4;
            gl.drawArrays(gl.TRIANGLE_FAN, offset, count);

            gl.disable(gl.STENCIL_TEST);
        }

        matrixStack.push(componentTransformationsMatrix);

        component?.children?.forEach(child => {

            recursiveDrawComponent(child);
        });

        matrixStack.pop();
    }

    function render(time: number): void {

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

        progressorsManager.updateProgressors(time - previousRenderTime);

        root.children?.forEach(children => {
            
            recursiveDrawComponent(children);
        });

        requestAnimationFrame(render);

        previousRenderTime = time;
    }

    function startRendering() {

        root = componentsManager.getComponentsTreeRoot();

        matrixStack[0] = m3.getIdentityMatrix();

        previousRenderTime = 0;
        
        eventsManager.fireEvent(rendererEventsData.renderingStarted);

        requestAnimationFrame(render);
    }

    return {

        initialize,
        startRendering
    }
})();