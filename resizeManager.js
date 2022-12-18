export const resizeManager = (()=>{

    let canvas;
    let gl;

    function initialize(data) {

        canvas = data.canvas;
        gl = data.gl;

        window.addEventListener('resize', canvasResizeCallback);
        canvasResizeCallback();
    }

    function canvasResizeCallback() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    }

    function getCanvasSize() {

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