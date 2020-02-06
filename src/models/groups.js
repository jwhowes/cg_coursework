function drawTableAndChairs(gl, u_ModelMatrix, u_NormalMatrix, n){
    pushMatrix(modelMatrix);
        modelMatrix.translate(0, -0.5, -1.25);
        drawChair(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.translate(0, 0, 2.5);
        modelMatrix.rotate(180, 0, 1, 0);
        drawChair(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
        modelMatrix.rotate(90, 0, 1, 0);
        modelMatrix.translate(0, -0.5, -2.45);
        drawChair(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.rotate(180, 0, 1, 0);
        modelMatrix.translate(0, 0, -4.7);
        drawChair(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();
    drawTable(gl, u_ModelMatrix, u_NormalMatrix, n);
}