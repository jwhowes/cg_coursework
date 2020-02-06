function drawTable(gl, u_ModelMatrix, u_NormalMatrix, n){
    pushMatrix(modelMatrix);
        modelMatrix.scale(5, 0.25, 3);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();

    pushMatrix(modelMatrix);
        modelMatrix.scale(0.25, 2.5, 0.25);
        modelMatrix.translate(-9, -0.5, -5);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.translate(18, 0, 0);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.translate(0, 0, 10);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.translate(-18, 0, 0);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();
}