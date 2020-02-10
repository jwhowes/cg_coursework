var VSHADER_SOURCE =
    "attribute vec4 a_Position;\n\
    attribute vec4 a_Color;\n\
    attribute vec4 a_Normal;\n\
    uniform mat4 u_ModelMatrix;\n\
    uniform mat4 u_NormalMatrix;\n\
    uniform mat4 u_ViewMatrix;\n\
    uniform mat4 u_ProjMatrix;\n\
    uniform vec3 u_LightColor;\n\
    uniform vec3 u_LightDirection;\n\
    varying vec4 v_Color;\n\
    void main(){\n\
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n\
        vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n\
        float nDotL = max(dot(normal, u_LightDirection), 0.0);\n\
        vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n\
        v_Color = vec4(diffuse, a_Color.a);\n\
    }";

var FSHADER_SOURCE =
    "#ifdef GL_ES\n\
    precision mediump float;\n\
    #endif\n\
    varying vec4 v_Color;\n\
    void main() {\n\
      gl_FragColor = v_Color;\n\
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
    var u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
    var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
    var u_LightDirection = gl.getUniformLocation(gl.program, "u_LightDirection");

    // Set lighting info (white light coming from a bit to the right and above the camera (behind it too)):
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    var lightDir = new Vector3([0.5, 0.3, 4.0]);
    lightDir.normalize();
    gl.uniform3fv(u_LightDirection, lightDir.elements);

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
    drawLamp(gl, u_ModelMatrix, u_NormalMatrix, n);
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