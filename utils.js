import { m3 } from './m3.js'

export const utils = (()=>{

    function createShader(gl, type, source) {

        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) return shader;
       
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
    
    function createProgram(gl, vertexShader, fragmentShader) {
    
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
    
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) return program;
       
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    function createProgramFromShaders(gl, vertexShaderSource, fragmentShaderSource){

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = createProgram(gl, vertexShader, fragmentShader);

        return program;
    }

    return {
        createProgramFromShaders
    }
})();