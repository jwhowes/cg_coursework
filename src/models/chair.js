function drawChair(gl, u_ModelMatrix, u_NormalMatrix, n){
  // Model the chair seat
  pushMatrix(modelMatrix);
    modelMatrix.scale(0.75, 0.75, 0.75);
    pushMatrix(modelMatrix);
        modelMatrix.scale(2.0, 0.5, 2.0); // Scale
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();

    pushMatrix(modelMatrix);
      modelMatrix.scale(2.0, 0.5, 0.5);
      modelMatrix.translate(0, 1, -1.5);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
      modelMatrix.translate(0, 3, 0);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();

    pushMatrix(modelMatrix);
      modelMatrix.scale(0.5, 2.0, 0.5);
      modelMatrix.translate(-1.5, 0.5, -1.5);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
      modelMatrix.translate(3, 0, 0);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();

    // Model the legs
    pushMatrix(modelMatrix);
      modelMatrix.scale(0.5, 2.5, 0.5);
      modelMatrix.translate(-1.5, -0.5, -1.5);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
      modelMatrix.translate(3, 0, 0);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
      modelMatrix.translate(0, 0, 3);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
      modelMatrix.translate(-3, 0, 0);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();

    // Model the spokes on top
    pushMatrix(modelMatrix);
      modelMatrix.scale(0.5, 0.5, 0.5);
      modelMatrix.translate(-1.5, 5, -1.5);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
      modelMatrix.translate(3, 0, 0);
      drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();
  modelMatrix = popMatrix();
}