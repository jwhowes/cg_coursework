var VSHADER_SOURCE =
    "attribute vec4 a_Position;\n \
    attribute vec4 a_Color;\n \
    attribute vec4 a_Normal;\n \
    uniform mat4 u_ModelMatrix;\n \
    uniform mat4 u_NormalMatrix;\n \
    uniform mat4 u_ViewMatrix;\n \
    uniform mat4 u_ProjMatrix;\n \
    varying vec4 v_Color;\n \
    void main(){\n \
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n \
        v_Color = a_Color;\n \
    }";

var FSHADER_SOURCE =
    "#ifdef GL_ES\n \
    precision mediump float;\n \
    #endif\n \
    varying vec4 v_Color;\n \
    void main() {\n \
      gl_FragColor = v_Color;\n \
    }";

var modelMatrix = new Matrix4();
var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();

function main(){
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);
    if(!gl){
        console.log("Failed to get rendering context.");
        return;
    }
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log("Failed to initialise shaders.");
        return;
    }
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
    var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    var u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");  // TODO: Assert existance of uniforms.

    viewMatrix.setLookAt(0, 0, 15, 0, 0, 0, 0, 1, 0);
    projMatrix.setPerspective(30, canvas.width/canvas.clientHeight, 1, 100);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    draw(gl, u_ModelMatrix, u_NormalMatrix);
}

function draw(gl, u_ModelMatrix, u_NormalMatrix){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var n = initVertexBuffers(gl);
    modelMatrix.setTranslate(0, 0, 0);
    drawCoffeeTable(gl, u_ModelMatrix, u_NormalMatrix);
}

function drawbox(gl, u_ModelMatrix, u_NormalMatrix, n) {
    pushMatrix(modelMatrix);

        // Pass the model matrix to the uniform variable
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

        // Calculate the normal transformation matrix and pass it to u_NormalMatrix
        g_normalMatrix.setInverseOf(modelMatrix);
        g_normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

        // Draw the cube
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    modelMatrix = popMatrix();
}

function initVertexBuffers(gl){
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    var vertices = new Float32Array([   // Coordinates
        0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5, // v0-v1-v2-v3 front
        0.5, 0.5, 0.5,   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.5,-0.5, // v0-v3-v4-v5 right
        0.5, 0.5, 0.5,   0.5, 0.5,-0.5,  -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5, // v0-v5-v6-v1 up
        -0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5, // v1-v6-v7-v2 left
        -0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5, // v7-v4-v3-v2 down
        0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5  // v4-v7-v6-v5 back
    ]);
    var colors = new Float32Array([    // Colors
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);
    var normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
    ]);
    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);
    initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
    initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT);
    initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT);
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    return indices.length;
}

function initArrayBuffer(gl, attribute, data, num, type){  // Assigns atttribute to the array buffer containing data with vSize n and type type
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return true;
}

var g_matrixStack = [];
function pushMatrix(m){
    var m2 = new Matrix4(m);
    g_matrixStack.push(m2);
}

function popMatrix(){
    return g_matrixStack.pop();
}