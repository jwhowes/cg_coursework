function initConeVertexBuffers(gl){
    var vertices = new Float32Array([
      0, 1, 0,
      0.5, 0, 0,
      0.433, 0, 0.25,
      0.25, 0, 0.433,
      0, 0, 0.5,
      -0.25, 0, 0.433,
      -0.433, 0, 0.25,
      -0.5, 0, 0,
      -0.433, 0, -0.25,
      -0.25, 0, -0.433,
      0, 0, -0.5,
      0.25, 0, -0.433,
      0.433, 0, -0.25,
      0.5, 0, 0
    ]);
  
    var colors = new Float32Array([
      1, 0, 0, 1,
      0, 1, 0, 1,
      0, 0, 1, 1,
      1, 0, 0, 1,
      0, 1, 0, 1,
      0, 0, 1, 1,
      1, 0, 0, 1, 
      0, 1, 0, 1,
      0, 0, 1, 1,
      1, 0, 0, 1,
      0, 1, 0, 1
    ]);
  
    var normals = vertices
  
    // Indices of the vertices
    var indices = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  
    // Write the vertex property to buffers (coordinates, colors and normals)
    if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;
    if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;
  
    // Write the indices to the buffer object
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) {
      console.log('Failed to create the buffer object');
      return false;
    }
  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  
    return indices.length;
  }

function drawCone(gl, u_ModelMatrix, u_NormalMatrix, n){ // Right now it uses the drawbox function but in future it shouldn't.
  pushMatrix(modelMatrix);
    // Pass the model matrix to the uniform variable
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Calculate the normal transformation matrix and pass it to u_NormalMatrix
    g_normalMatrix.setInverseOf(modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);

    // Draw the cube
    gl.drawElements(gl.TRIANGLE_FAN, n, gl.UNSIGNED_BYTE, 0);
  modelMatrix = popMatrix();
}