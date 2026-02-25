import { sizeType } from "../types/globalTypes.js";

export const resizeManager = (()=>{

    let canvas: HTMLCanvasElement;
    let gl: WebGL2RenderingContext;

    function initialize(data: {canvas:  HTMLCanvasElement, gl: WebGL2RenderingContext}): void {

        canvas = data.canvas;
        gl = data.gl;

        window.addEventListener('resize', canvasResizeCallback);
        canvasResizeCallback();
    }

    function canvasResizeCallback(): void {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    function getCanvasSize(): sizeType {

        return {
            width: canvas.width,
            height: canvas.height,
        }
    }

    return {

        initialize,
        getCanvasSize
    }
})();