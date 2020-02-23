function initCylinderVertexBuffers(gl, ratio, isLampShade){
	var step = 6;
	var vertices = [];
	var colors = [];
	var normals = [];
	var indices = [];
	for(var i = 0; i <= 720 + step; i += step){
		vertices.push(ratio*Math.cos(i*Math.PI/180)); vertices.push(-0.5); vertices.push(ratio*Math.sin(i*Math.PI/180));
		vertices.push(Math.cos(i*Math.PI/180)); vertices.push(0.5); vertices.push(Math.sin(i*Math.PI/180));
		indices.push(i/step);
		colors.push(1); colors.push(0); colors.push(0); colors.push((isLampShade) ? 0.5 : 1);
		normals.push(Math.cos(i*Math.PI/180)); normals.push(0); normals.push(Math.sin(i*Math.PI/180));
		normals.push(Math.cos(i*Math.PI/180)); normals.push(0); normals.push(Math.sin(i*Math.PI/180));
	}
	vertices = new Float32Array(vertices);
	colors = new Float32Array(colors);
	normals = new Float32Array(normals);
	indices = new Uint8Array(indices);
	if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
	if (!initArrayBuffer(gl, 'a_Color', colors, 4, gl.FLOAT)) return -1;
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
	var step = 6;
	var vertices = [0, 0, 0];
	var colors = [1, 0, 0, 1];
	var normals = [0, 1, 0];
	var indices = [0];
	for(var i = 0; i <= 360; i += step){
		vertices.push(Math.cos(i*Math.PI/180)); vertices.push(0); vertices.push(Math.sin(i*Math.PI/180));
		colors.push(1); colors.push(0); colors.push(0); colors.push(1);
		normals.push(0); normals.push(1); normals.push(0);
		indices.push(i/step + 1);
	}
	vertices = new Float32Array(vertices);
	colors = new Float32Array(colors);
	normals = new Float32Array(normals);
	indices = new Uint8Array(indices);
	if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;
	if (!initArrayBuffer(gl, 'a_Color', colors, 4, gl.FLOAT)) return -1;
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
		modelMatrix.rotate(180, 1, 0, 0);
		drawCircle(gl, u_ModelMatrix, u_NormalMatrix, n);
	modelMatrix = popMatrix();
	n = initCylinderVertexBuffers(gl, 1);
	drawCylinder(gl, u_ModelMatrix, u_NormalMatrix, n);
}

function initVertexBuffers(gl){
	// Create a cube
	//	v6----- v5
	//   /|	  /|
	//  v1------v0|
	//  | |	 | |
	//  | |v7---|-|v4
	//  |/	  |/
	//  v2------v3
	var vertices = new Float32Array([   // Coordinates
		0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5, // v0-v1-v2-v3 front
		0.5, 0.5, 0.5,   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.5,-0.5, // v0-v3-v4-v5 right
		0.5, 0.5, 0.5,   0.5, 0.5,-0.5,  -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5, // v0-v5-v6-v1 up
		-0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5, // v1-v6-v7-v2 left
		-0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5, // v7-v4-v3-v2 down
		0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5  // v4-v7-v6-v5 back
	]);
	var colors = new Float32Array([	// Colors
		1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,  1, 0, 0, 1,	 // v0-v1-v2-v3 front
		1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,  1, 0, 0, 1,	 // v0-v3-v4-v5 right
		1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,  1, 0, 0, 1,	 // v0-v5-v6-v1 up
		1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,  1, 0, 0, 1,	 // v1-v6-v7-v2 left
		1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,  1, 0, 0, 1,	 // v7-v4-v3-v2 down
		1, 0, 0, 1,   1, 0, 0, 1,   1, 0, 0, 1,  1, 0, 0, 1　	// v4-v7-v6-v5 back
	]);
	var normals = new Float32Array([	// Normal
		0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
		1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
		0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
		-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
		0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
		0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
	]);
	// Indices of the vertices
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3,	// front
		4, 5, 6,   4, 6, 7,	// right
		8, 9,10,   8,10,11,	// up
		12,13,14,  12,14,15,	// left
		16,17,18,  16,18,19,	// down
		20,21,22,  20,22,23	 // back
	]);
	initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
	initArrayBuffer(gl, 'a_Color', colors, 4, gl.FLOAT);
	initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT);
	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	return indices.length;
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