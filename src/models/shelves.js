function drawShelves(gl, u_ModelMatrix, u_NormalMatrix, n){
    pushMatrix(modelMatrix);
    modelMatrix.scale(3, 5, 0.15);
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();

  pushMatrix(modelMatrix);
    modelMatrix.scale(0.1, 5, 0.75);
    modelMatrix.translate(-14.5, 0, 0.5);
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix.translate(29, 0, 0);
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();

  pushMatrix(modelMatrix);
    modelMatrix.scale(3, 0.1, 0.75);
    modelMatrix.translate(0, -24.5, 0.5);
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix.translate(0, 12.5, 0);
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix.translate(0, 12.5, 0);
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix.translate(0, 12.5, 0);
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix.translate(0, 11.5, 0);
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();

  pushMatrix(modelMatrix);
    modelMatrix.scale(0.1, 1.25, 0.75);
    modelMatrix.translate(0, 0.5, 0.5);
    drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
  modelMatrix = popMatrix();
}