function initCylinderVertexBuffers(gl){
    var step = 6;
    var vertices = [];
    var colors = [];
    var indices = [];
    for(var i = 0; i <= 720 + step; i += step){
        vertices.push(Math.cos(i*Math.PI/180)); vertices.push(-0.5); vertices.push(Math.sin(i*Math.PI/180));
        vertices.push(Math.cos(i*Math.PI/180)); vertices.push(0.5); vertices.push(Math.sin(i*Math.PI/180));
        indices.push(i/step);
        colors.push(1); colors.push(0); colors.push(0);
    }
    vertices = new Float32Array(vertices);
    colors = new Float32Array(colors);
    indices = new Uint8Array(indices);
    var normals = vertices;
    if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function drawCylinder(gl, u_ModelMatrix, u_NormalMatrix, n){
    pushMatrix(modelMatrix);
        gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
        g_normalMatrix.setInverseOf(modelMatrix);
        g_normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
        gl.drawElements(gl.TRIANGLE_STRIP, n, gl.UNSIGNED_BYTE, 0);
    modelMatrix = popMatrix();
}

function initCircleVertexBuffers(gl){
    var vertices = [0, 0, 0];
    var colors = [1, 0, 0, 1]
    var indices = [0]
    for(var i = 0; i <= 360; i += 20){
        vertices.push(Math.cos(i*Math.PI/180)); vertices.push(0); vertices.push(Math.sin(i*Math.PI/180));
        colors.push(1); colors.push(0); colors.push(0); colors.push(1);
        indices.push(i/20 + 1);
    }
    vertices = new Float32Array(vertices);
    colors = new Float32Array(colors);
    indices = new Uint8Array(indices);
    var normals = vertices;
    if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;

    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
}

function drawCircle(gl, u_ModelMatrix, u_NormalMatrix, n) {
    pushMatrix(modelMatrix);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    g_normalMatrix.setInverseOf(modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    gl.drawElements(gl.TRIANGLE_FAN, n, gl.UNSIGNED_BYTE, 0);
    modelMatrix = popMatrix();
}

function drawSolidCylinder(gl, u_ModelMatrix, u_NormalMatrix){
    n = initCircleVertexBuffers(gl);
    pushMatrix(modelMatrix);
        modelMatrix.translate(0, 0.5, 0);
        drawCircle(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.translate(0, -1, 0);
        drawCircle(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();
    n = initCylinderVertexBuffers(gl);
    drawCylinder(gl, u_ModelMatrix, u_NormalMatrix, n);
}