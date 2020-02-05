var VSHADER_SOURCE =
  "attribute vec4 vertexPos; \
  uniform mat4 u_modelViewMatrix; \
  void main(){ \
      gl_Position = u_modelViewMatrix * vertexPos; \
  }";

var FSHADER_SOURCE =
  "void main() { \
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); \
  }";

function draw(gl, obj){
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var vertexPos = gl.getAttribLocation(gl.program, 'vertexPos');
    gl.vertexAttribPointer(vertexPos, obj.vertSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    gl.uniformMatrix4fv(u_modelViewMatrix, false, modelViewMatrix);
    gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

function createSquare(gl){
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var verts = [
        .5,     .5,     0,
        -.5,    .5,     0,
        .5,     -.5,    0,
        -.5,    -.5,    0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    var square = {buffer:vertexBuffer, vertSize:3, nVerts:4, primtype:gl.TRIANGLE_STRIP};
    return square;
}

function main(){
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);
    gl.viewport(0, 0, canvas.clientWidth, canvas.height);
    modelViewMatrix = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -3.333, 1]);
    projectionMatrix = new Float32Array([
        2.41421, 0, 0, 0,
        0, 2.41421, 0, 0,
        0, 0, -1.002002, -1,
        0, 0, -0.2002002, 0]);
    draw(gl, createSquare(gl));
}