var VSHADER_SOURCE =
    "attribute vec2 aVertexPosition; \
    uniform mat4 uModelViewMatrix; \
    uniform mat4 uProjectionMatrix; \
    void main(){ \
        gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 0, 1); \
    }";

var FSHADER_SOURCE = 
    "precision highp float; \
    uniform vec4 uColor; \
    void main(){ \
        gl_FragColor = uColor; \
    }";

function square(gl){
    var vertices = [
        0.5, 0.5, 0,
        -0.5, 0.5, 0,
        0.5, -0.5, 0,
        -0.5, -0.5, 0
    ];
    return createObj(gl, vertices, 3, 4, gl.TRIANGLE_STRIP);
}

function triangle(gl){
    var vertices = [
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
    ];
    return createObj(gl, vertices, 3, 3, gl.TRIANGLES);
}

function createObj(gl, vertices, vertSize, nVerts, primtype){
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    var obj = {buffer:vertexBuffer, vertSize:vertSize, nVerts:nVerts, primtype:primtype}
    return obj;
}

function draw(gl, obj){
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    var uColor = gl.getUniformLocation(gl.program, 'uColor');
    gl.uniform4fv(uColor, [1, 0, 0, 1]);
    var aVertexPosition = gl.getAttribLocation(gl.program, 'aVertexPosition');
    gl.enableVertexAttribArray(aVertexPosition);
    var uModelViewMatrix = gl.getUniformLocation(gl.program, 'uModelViewMatrix');
    var uProjectionMatrix = gl.getUniformLocation(gl.program, 'uProjectionMatrix');
    gl.vertexAttribPointer(aVertexPosition, obj.vertSize, gl.FLOAT, false, 0, 0);
    gl.uniformMatrix4fv(uModelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
    gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

function main(){
    canvas = document.getElementById("webgl");
    gl = getWebGLContext(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var i = 0;
    modelViewMatrix = new Float32Array(
        [1, 0, 1, 0,
         0, 1, 0, 0,
         0, 0, 1, 0,
         0, 0, -3.333, 1]);
    projectionMatrix = new Float32Array(
        [2.41421, 0, 0, 0,
            0, 2.41421, 0, 0,
            0, 0, -1.002002, -1,
            0, 0, -0.2002002, 0]);
    draw(gl, square(gl));
}