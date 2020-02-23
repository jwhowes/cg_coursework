var VSHADER_SOURCE =
	"attribute vec4 a_Position;\n\
	attribute vec4 a_Color;\n\
	attribute vec4 a_Normal;\n\
	uniform mat4 u_ModelMatrix;\n\
	uniform mat4 u_NormalMatrix;\n\
	uniform mat4 u_ViewMatrix;\n\
	uniform mat4 u_ProjMatrix;\n\
	varying vec4 v_Color;\n\
	varying vec3 v_Position;\n\
	varying vec3 v_Normal;\n\
	void main(){\n\
		gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n\
		v_Position = vec3(u_ModelMatrix * a_Position);\n\
		v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n\
		v_Color = a_Color;\n\
	}";

var FSHADER_SOURCE =
	"#ifdef GL_ES\n\
	precision mediump float;\n\
	#endif\n\
	uniform vec3 u_LightColor;\n\
	uniform vec3 u_LightPosition;\n\
	uniform vec3 u_AmbientLight;\n\
	varying vec4 v_Color;\n\
	varying vec3 v_Position;\n\
	varying vec3 v_Normal;\n\
	void main() {\n\
		vec3 normal = normalize(v_Normal);\n\
		vec3 lightDirection = normalize(u_LightPosition - v_Position);\n\
		float nDotL = max(dot(lightDirection, normal), 0.0);\n\
		vec3 diffuse = 0.85 * u_LightColor * v_Color.rgb * nDotL;\n\
		vec3 ambient = 0.15 * u_AmbientLight * v_Color.rgb;\n\
		gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n\
	}";

var modelMatrix = new Matrix4();
var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();
var light_rotation = [-45];
var light_r_i = 0;

function wait(ms){
	var d = new Date();
	var d2 = null;
	do { d2 = new Date(); }
	while(d2-d < ms);
}

function main(){
	var light_r_step = 2;
	var i = 0;
	while(light_rotation[i] < 45){
		light_rotation.push(light_rotation[i] + light_r_step);
		i += 1;
	}
	while(light_rotation[i] > -45){
		light_rotation.push(light_rotation[i] - light_r_step);
		i += 1;
	}
	var canvas = document.getElementById("webgl");
	var gl = getWebGLContext(canvas);
	if(!gl){
		console.log("Failed to get rendering context.");
		return;
	}
	if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
		console.log("Failed to initialise shaders.");
		return;
	}
	gl.clearColor(0, 0, 0, 1);
	gl.enable(gl.DEPTH_TEST);

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
	var u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
	var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
	var u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
	var u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
	var u_LightPosition = gl.getUniformLocation(gl.program, "u_LightPosition");
	var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");

	// Set lighting info (white light coming from a bit to the right and above the camera (behind it too)):
	gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

	var lightPos = new Vector3([0, 1, 0]);
	lightPos.normalize();
	gl.uniform3fv(u_LightPosition, lightPos.elements);

	var ambientLight = new Vector3([1, 1, 1]);
	ambientLight.normalize();
	gl.uniform3fv(u_AmbientLight, ambientLight.elements);

	viewMatrix.setLookAt(0, 5, 25, 0, 0, 0, 0, 1, 0);
	projMatrix.setPerspective(30, canvas.width/canvas.clientHeight, 1, 100);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
	requestAnimationFrame(draw(gl, u_ModelMatrix, u_NormalMatrix))
}

function draw(gl, u_ModelMatrix, u_NormalMatrix){
	return function(timestamp){
		light_r_i = (light_r_i + 1) % light_rotation.length;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		modelMatrix.setTranslate(0, 0, 0);
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, 6, -5);
			modelMatrix.rotate(light_rotation[light_r_i], 0, 0, 1);
			drawHangingLight(gl, u_ModelMatrix, u_NormalMatrix);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(-5, 0, -10);
			drawLamp(gl, u_ModelMatrix, u_NormalMatrix);
			pushMatrix(modelMatrix);
				modelMatrix.translate(0, -1, 0);
				drawCoffeeTable(gl, u_ModelMatrix, u_NormalMatrix);
			modelMatrix = popMatrix();
		modelMatrix = popMatrix();
		var n = initVertexBuffers(gl);
		pushMatrix(modelMatrix);
			modelMatrix.translate(5, 0, -5);
			modelMatrix.rotate(90, 0, 1, 0);
			drawTableAndChairs(gl, u_ModelMatrix, u_NormalMatrix, n);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(-5, 0, -15);
			drawShelves(gl, u_ModelMatrix, u_NormalMatrix, n);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, 1.5, -15);
			drawTV(gl, u_ModelMatrix, u_NormalMatrix, n);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, -2.5, 0)
			drawGround(gl, u_ModelMatrix, u_NormalMatrix, n);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, 0, -20);
			modelMatrix.rotate(90, 1, 0, 0);
			drawGround(gl, u_ModelMatrix, u_NormalMatrix, n);
		modelmatrix = popMatrix();
		requestAnimationFrame(draw(gl, u_ModelMatrix, u_NormalMatrix));
	}
}

function initArrayBuffer(gl, attribute, data, num, type){  // Assigns atttribute to the array buffer containing data with vSize n and type type
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	gl.enableVertexAttribArray(a_attribute);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	return true;
}

var g_matrixStack = [];
function pushMatrix(m){
	var m2 = new Matrix4(m);
	g_matrixStack.push(m2);
}

function popMatrix(){
	return g_matrixStack.pop();
}