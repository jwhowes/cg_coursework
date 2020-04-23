
// Initialises circle buffers
function initCircleVertexBuffers(gl){
	var step = 6;
	var vertices = [0, 0, 0];
	var colors = [0, 0.5, 1, 1];
	var normals = [0, 1, 0];
	var indices = [0];
	// Initialises vertices based on polar equation for a circle
	for(var i = 0; i <= 360; i += step){
		vertices.push(Math.cos(i*Math.PI/180)); vertices.push(0); vertices.push(Math.sin(i*Math.PI/180));
		colors.push(0); colors.push(0.5); colors.push(1); colors.push(1);
		normals.push(0); normals.push(1); normals.push(0);
		indices.push(i/step + 1);
	}

	// Initialise buffers and set values
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

// Initialises cylinder buffers
function initCylinderVertexBuffers(gl, ratio, isLampShade){
	var step = 6;
	var vertices = [];
	var colors = [];
	var normals = [];
	var indices = [];
	// Draws a cylinder by creating alternating vertices between two circles at different heights
	for(var i = 0; i <= 720 + step; i += step){
		vertices.push(ratio*Math.cos(i*Math.PI/180)); vertices.push(-0.5); vertices.push(ratio*Math.sin(i*Math.PI/180));
		vertices.push(Math.cos(i*Math.PI/180)); vertices.push(0.5); vertices.push(Math.sin(i*Math.PI/180));
		indices.push(i/step);
		colors.push(0); colors.push(0.5); colors.push(1); colors.push((isLampShade) ? 0.5 : 1);
		normals.push(Math.cos(i*Math.PI/180)); normals.push(0); normals.push(Math.sin(i*Math.PI/180));
		normals.push(Math.cos(i*Math.PI/180)); normals.push(0); normals.push(Math.sin(i*Math.PI/180));
	}

	// Initialise buffers and set values
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

// Draws a cylinder (after buffers have been initialised)
function drawCylinder(gl, u_ModelMatrix, u_NormalMatrix, n){
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	g_normalMatrix.setInverseOf(modelMatrix);
	g_normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
	gl.drawElements(gl.TRIANGLE_STRIP, n, gl.UNSIGNED_BYTE, 0);
}

// Draws a circle (after buffers have been intialised)
function drawCircle(gl, u_ModelMatrix, u_NormalMatrix, n) {
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	g_normalMatrix.setInverseOf(modelMatrix);
	g_normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
	gl.drawElements(gl.TRIANGLE_FAN, n, gl.UNSIGNED_BYTE, 0);
}

// Draws a solid cylinder
function drawSolidCylinder(gl, u_ModelMatrix, u_NormalMatrix){
	// Draw top and bottom circles
	n = initCircleVertexBuffers(gl);
	pushMatrix(modelMatrix);
		modelMatrix.translate(0, 0.5, 0);
		drawCircle(gl, u_ModelMatrix, u_NormalMatrix, n);
		modelMatrix.translate(0, -1, 0);
		modelMatrix.rotate(180, 1, 0, 0);  // Need to flip as normals only point up by default
		drawCircle(gl, u_ModelMatrix, u_NormalMatrix, n);
	modelMatrix = popMatrix();
	n = initCylinderVertexBuffers(gl, 1);
	drawCylinder(gl, u_ModelMatrix, u_NormalMatrix, n);
}

// Initialises cube vertex buffers
function initVertexBuffers(gl){
	var vertices = new Float32Array([
		0.5, 0.5, 0.5,  -0.5, 0.5, 0.5,  -0.5,-0.5, 0.5,   0.5,-0.5, 0.5,
		0.5, 0.5, 0.5,   0.5,-0.5, 0.5,   0.5,-0.5,-0.5,   0.5, 0.5,-0.5,
		0.5, 0.5, 0.5,   0.5, 0.5,-0.5,  -0.5, 0.5,-0.5,  -0.5, 0.5, 0.5,
		-0.5, 0.5, 0.5,  -0.5, 0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5,-0.5, 0.5,
		-0.5,-0.5,-0.5,   0.5,-0.5,-0.5,   0.5,-0.5, 0.5,  -0.5,-0.5, 0.5,
		0.5,-0.5,-0.5,  -0.5,-0.5,-0.5,  -0.5, 0.5,-0.5,   0.5, 0.5,-0.5
	]);
	var normals = new Float32Array([
		0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
		1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
		0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
		-1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
		0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,
		0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0
    ]);
    var texCoords = new Float32Array([
        1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
        1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
        1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
        1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
        1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0,
        1.0, 1.0,    0.0, 1.0,   0.0, 0.0,   1.0, 0.0
      ]);
	var indices = new Uint8Array([
		0, 1, 2,   0, 2, 3,
		4, 5, 6,   4, 6, 7,
		8, 9,10,   8,10,11,
		12,13,14,  12,14,15,
		16,17,18,  16,18,19,
		20,21,22,  20,22,23
	]);
	// Initialise buffers and set values
	initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT);
    initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT);
	initArrayBuffer(gl, 'a_TexCoords', texCoords, 2, gl.FLOAT);

	var indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	return indices.length;
}

// Draws a box (after buffers have been initialised)
function drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n) {
	gl.uniform1i(u_UseTextures, false);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	g_normalMatrix.setInverseOf(modelMatrix);
	g_normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

// Draws a box current loaded texture
function drawBoxWithTexture(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n){
	gl.uniform1i(u_UseTextures, true);
	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
	g_normalMatrix.setInverseOf(modelMatrix);
	g_normalMatrix.transpose();
	gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
	gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

// Loads a texture into sampler 0
function loadTexture(gl, texture, sampler){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.uniform1i(sampler, 0);
}

// Loads a normal map into sampler 1
function loadNormalMap(gl, texture, sampler){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.uniform1i(sampler, 1);
}