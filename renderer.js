import { utils } from './utils.js';
import { m3 } from './m3.js';
import { assetsManager } from "./assetsManager.js";
import { gameState } from './gameState.js';
import { componentsManager } from './componentsManager.js';

export const renderer = (()=>{

    let gl;
    let matrixLocation;
    let textureLocation;
    let root;
    let textureInfo;
    let matrixStack = [];

    function initialize(data) {

        gl = data.gl;
        setupProgram();
        textureInfo = assetsManager.getAssetDataByName('test');
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

        out vec4 outColor;

        void main() {
            outColor = texture(u_texture, v_texcoord);
        }
        `;

        const program = utils.createProgramFromShaders(gl, vertexShaderSource, fragmentShaderSource);

        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        const texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

        matrixLocation = gl.getUniformLocation(program, "u_matrix");
        textureLocation = gl.getUniformLocation(program, "u_texture");

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        const texcoords = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texcoordAttributeLocation);
        gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, true, 0, 0);
    }

    function recursiveDrawComponent(component) {

        const componentTransformationsMatrix = m3.getComponentTransformationsMatrix({

            currentMatrix: matrixStack[matrixStack.length - 1],

            translation: {

                x: component.x,
                y: component.y,
            },

            scaling: {

                x: component.scale,
                y: component.scale,
            },

            rotation: {

                angle: component.rotation
            }
        });

        if (component.type == 'sprite') {

            let textureInfo = assetsManager.getAssetDataByName(component.assets[0]);

            const textureUnit = 0;
            gl.uniform1i(textureLocation, textureUnit);

            gl.activeTexture(gl.TEXTURE0 + textureUnit);
            gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);


            gl.uniformMatrix3fv(matrixLocation, false, m3.multiplyMatrices([
                m3.getScalingMatrix(textureInfo.width, textureInfo.height), 
                componentTransformationsMatrix,
                m3.multiplyTwoMatrices(m3.getScalingMatrix(2/2000, 2/2000),m3.getTranslationMatrix(-1,-1)),
            ]));
            // if (Math.random()>0.995) {
            //     console.log(`
            //         element ${component.id}
            //         width: ${textureInfo.width}
            //         height: ${textureInfo.height}
            //     `);

            //     console.log(m3.multiplyTwoMatrices(m3.getScalingMatrix(2/2000, 2/2000),m3.getTranslationMatrix(-1,-1)))
            //     console.log(componentTransformationsMatrix)
            // }

            const offset = 0;
            const count = 6;
            gl.drawArrays(gl.TRIANGLES, offset, count);
        }

        matrixStack.push(componentTransformationsMatrix);

        component?.children?.forEach(children => {

            recursiveDrawComponent(children);
        });

        matrixStack.pop();
    }

    function render(time) {

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        componentsManager.getComponentById('fish1').rotation+=0.004
        componentsManager.getComponentById('fish2').rotation-=0.04
        componentsManager.getComponentById('fish3').scale+=0.001
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