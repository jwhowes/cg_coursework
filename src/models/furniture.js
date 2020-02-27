function drawChair(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n){
	var colors = new Float32Array([	// Colors
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v0-v1-v2-v3 front
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v0-v3-v4-v5 right
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v0-v5-v6-v1 up
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v1-v6-v7-v2 left
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v7-v4-v3-v2 down
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1　	// v4-v7-v6-v5 back
	]);
	initArrayBuffer(gl, 'a_Color', colors, 4, gl.FLOAT);
	// Model the chair seat
	pushMatrix(modelMatrix);
	  modelMatrix.scale(0.75, 0.75, 0.75);
	  pushMatrix(modelMatrix);
		  modelMatrix.scale(2.0, 0.5, 2.0); // Scale
		  drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	  modelMatrix = popMatrix();
  
	  pushMatrix(modelMatrix);
		modelMatrix.scale(2.0, 0.5, 0.5);
		modelMatrix.translate(0, 1, -1.5);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 3, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	  modelMatrix = popMatrix();
  
	  pushMatrix(modelMatrix);
		modelMatrix.scale(0.5, 2.0, 0.5);
		modelMatrix.translate(-1.5, 0.5, -1.5);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(3, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	  modelMatrix = popMatrix();
  
	  // Model the legs
	  pushMatrix(modelMatrix);
		modelMatrix.scale(0.5, 2.5, 0.5);
		modelMatrix.translate(-1.5, -0.5, -1.5);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(3, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 0, 3);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(-3, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	  modelMatrix = popMatrix();
  
	  // Model the spokes on top
	  pushMatrix(modelMatrix);
		modelMatrix.scale(0.5, 0.5, 0.5);
		modelMatrix.translate(-1.5, 5, -1.5);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(3, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	  modelMatrix = popMatrix();
	modelMatrix = popMatrix();
  }

function drawTableAndChairs(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n){
	pushMatrix(modelMatrix);
		modelMatrix.translate(0, -0.5, -1.25);
		drawChair(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 0, 2.5);
		modelMatrix.rotate(180, 0, 1, 0);
		drawChair(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();
	pushMatrix(modelMatrix);
		modelMatrix.rotate(90, 0, 1, 0);
		modelMatrix.translate(0, -0.5, -2.45);
		drawChair(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.rotate(180, 0, 1, 0);
		modelMatrix.translate(0, 0, -4.7);
		drawChair(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();
	drawTable(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
}

function drawShelves(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n){
	var colors = new Float32Array([	// Colors
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v0-v1-v2-v3 front
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v0-v3-v4-v5 right
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v0-v5-v6-v1 up
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v1-v6-v7-v2 left
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1,	 // v7-v4-v3-v2 down
		0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,   0.8314, 0.6157, 0.2980, 1,  0.8314, 0.6157, 0.2980, 1　	// v4-v7-v6-v5 back
	]);
	initArrayBuffer(gl, 'a_Color', colors, 4, gl.FLOAT);
	pushMatrix(modelMatrix);
		modelMatrix.scale(3, 5, 0.15);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();

	pushMatrix(modelMatrix);
		modelMatrix.scale(0.1, 5, 0.75);
		modelMatrix.translate(-14.5, 0, 0.5);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(29, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();

	pushMatrix(modelMatrix);
		modelMatrix.scale(3, 0.1, 0.75);
		modelMatrix.translate(0, -24.5, 0.5);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 12.5, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 12.5, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 12.5, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 11.5, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();

	pushMatrix(modelMatrix);
		modelMatrix.scale(0.1, 1.25, 0.75);
		modelMatrix.translate(0, 0.5, 0.5);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();
}

function drawTable(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n){
	pushMatrix(modelMatrix);
		modelMatrix.scale(5, 0.25, 3);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();

	pushMatrix(modelMatrix);
		modelMatrix.scale(0.25, 2.5, 0.25);
		modelMatrix.translate(-9, -0.5, -5);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(18, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 0, 10);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(-18, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();
}

function drawTV(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n){
	var colors = new Float32Array([	// Colors
		0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,  0.4118, 0.3843, 0.3451, 1,	 // v0-v1-v2-v3 front
		0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,  0.4118, 0.3843, 0.3451, 1,	 // v0-v3-v4-v5 right
		0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,  0.4118, 0.3843, 0.3451, 1,	 // v0-v5-v6-v1 up
		0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,  0.4118, 0.3843, 0.3451, 1,	 // v1-v6-v7-v2 left
		0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,  0.4118, 0.3843, 0.3451, 1,	 // v7-v4-v3-v2 down
		0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,   0.4118, 0.3843, 0.3451, 1,  0.4118, 0.3843, 0.3451, 1　	// v4-v7-v6-v5 back
	]);
	initArrayBuffer(gl, 'a_Color', colors, 4, gl.FLOAT);
	pushMatrix(modelMatrix);
		modelMatrix.scale(5, 2.8125, 0.1);
		gl.uniform1i(u_UseTextures, 1);
		drawBoxWithTexture(gl, u_ModelMatrix, u_NormalMatrix, n);
	modelMatrix = popMatrix();

	pushMatrix(modelMatrix);
		modelMatrix.scale(0.25, 2.8125, 0.1);
		modelMatrix.translate(-9.5, 0, 1);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(19, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();

	pushMatrix(modelMatrix);
		modelMatrix.scale(5, 0.25, 0.1);
		modelMatrix.translate(0, -5.125, 1);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 10.25, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();

	var colors = new Float32Array([	// Colors
		0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,  0.2510, 0.2510, 0.2510, 1,	 // v0-v1-v2-v3 front
		0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,  0.2510, 0.2510, 0.2510, 1,	 // v0-v3-v4-v5 right
		0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,  0.2510, 0.2510, 0.2510, 1,	 // v0-v5-v6-v1 up
		0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,  0.2510, 0.2510, 0.2510, 1,	 // v1-v6-v7-v2 left
		0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,  0.2510, 0.2510, 0.2510, 1,	 // v7-v4-v3-v2 down
		0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,   0.2510, 0.2510, 0.2510, 1,  0.2510, 0.2510, 0.2510, 1　	// v4-v7-v6-v5 back
	]);
	initArrayBuffer(gl, 'a_Color', colors, 4, gl.FLOAT);
	pushMatrix(modelMatrix);
		modelMatrix.scale(0.1, 0.1, 0.2);
		modelMatrix.translate(20, -13, 0.5);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(-2, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(-2, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();
}

function drawCoffeeTable(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures){
	pushMatrix(modelMatrix);
		modelMatrix.scale(1.5, 0.2, 1.5);
		drawSolidCylinder(gl, u_ModelMatrix, u_NormalMatrix);
	modelMatrix = popMatrix();

	var n = initVertexBuffers(gl, u_ModelMatrix, u_NormalMatrix);
	var colors = new Float32Array([	// Colors
		0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,  0.396, 0.263, 0.129, 1,	 // v0-v1-v2-v3 front
		0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,  0.396, 0.263, 0.129, 1,	 // v0-v3-v4-v5 right
		0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,  0.396, 0.263, 0.129, 1,	 // v0-v5-v6-v1 up
		0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,  0.396, 0.263, 0.129, 1,	 // v1-v6-v7-v2 left
		0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,  0.396, 0.263, 0.129, 1,	 // v7-v4-v3-v2 down
		0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,   0.396, 0.263, 0.129, 1,  0.396, 0.263, 0.129, 1　	// v4-v7-v6-v5 back
	]);
	initArrayBuffer(gl, 'a_Color', colors, 4, gl.FLOAT);
	pushMatrix(modelMatrix);
		modelMatrix.scale(0.25, 2, 0.25);
		modelMatrix.translate(-3, -0.5, -4);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(6, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 0, 8);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(-6, 0, 0);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();

	pushMatrix(modelMatrix);
		modelMatrix.scale(1.25, 0.25, 0.25);
		modelMatrix.translate(0, -3.5, -4);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix.translate(0, 0, 8);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();
}

function drawLamp(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures){
	var n = initVertexBuffers(gl);
	pushMatrix(modelMatrix);
	  modelMatrix.scale(0.5, 1, 0.5);
	  modelMatrix.translate(0, -0.5, 0);
	  drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();
	var n = initCylinderVertexBuffers(gl, 1.3, true);
	pushMatrix(modelMatrix);
	  modelMatrix.scale(0.5625, 0.9375, 0.5625);
	  modelMatrix.translate(0, 0.5, 0);
	  drawCylinder(gl, u_ModelMatrix, u_NormalMatrix, n);
	modelMatrix = popMatrix();
}

function drawGround(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n){
	pushMatrix(modelMatrix);
		modelMatrix.scale(50, 0.1, 50);
		gl.uniform1i(u_UseTextures, 2);
		drawBoxWithTexture(gl, u_ModelMatrix, u_NormalMatrix, n);
	modelMatrix = popMatrix();
}

function drawHangingLight(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures){
	var n = initVertexBuffers(gl);
	pushMatrix(modelMatrix);
		modelMatrix.translate(0, -1.25, 0);
		modelMatrix.scale(0.1, 2.5, 0.1);
		drawbox(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
	modelMatrix = popMatrix();
	var n = initCylinderVertexBuffers(gl, 1.4, true);
	pushMatrix(modelMatrix);
		modelMatrix.translate(0, -3.25, 0);
		modelMatrix.scale(1, 1.5, 1);
		drawCylinder(gl, u_ModelMatrix, u_NormalMatrix, n);
	modelMatrix = popMatrix();
}