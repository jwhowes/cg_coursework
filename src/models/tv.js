function drawTV(gl, u_ModelMatrix, u_NormalMatrix, n){
    pushMatrix(modelMatrix);
        modelMatrix.scale(5, 2.8125, 0.1);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();

    pushMatrix(modelMatrix);
        modelMatrix.scale(0.25, 2.8125, 0.1);
        modelMatrix.translate(-9.5, 0, 1);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.translate(19, 0, 0);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();

    pushMatrix(modelMatrix);
        modelMatrix.scale(5, 0.25, 0.1);
        modelMatrix.translate(0, -5.125, 1);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.translate(0, 10.25, 0);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();

    pushMatrix(modelMatrix);
        modelMatrix.scale(0.1, 0.1, 0.2);
        modelMatrix.translate(20, -13, 0.5);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.translate(-2, 0, 0);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
        modelMatrix.translate(-2, 0, 0);
        drawbox(gl, u_ModelMatrix, u_NormalMatrix, n);
    modelMatrix = popMatrix();
}