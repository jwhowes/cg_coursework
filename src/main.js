var VSHADER_SOURCE =
	"attribute vec4 a_Position;\n\
	attribute vec4 a_Color;\n\
    attribute vec4 a_Normal;\n\
    attribute vec2 a_TexCoords;\n\
	uniform mat4 u_ModelMatrix;\n\
	uniform mat4 u_NormalMatrix;\n\
	uniform mat4 u_ViewMatrix;\n\
	uniform mat4 u_ProjMatrix;\n\
	varying vec4 v_Color;\n\
	varying vec3 v_Position;\n\
    varying vec3 v_Normal;\n\
    varying vec2 v_TexCoords;\n\
	void main(){\n\
		gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n\
		v_Position = vec3(u_ModelMatrix * a_Position);\n\
		v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n\
        v_Color = a_Color;\n\
        v_TexCoords = a_TexCoords;\n\
	}";

var FSHADER_SOURCE =
	"#ifdef GL_ES\n\
	precision mediump float;\n\
	#endif\n\
	uniform vec3 u_LightColor;\n\
    uniform vec3 u_S_LightPosition;\n\
    uniform bool u_UseTextures;\n\
    uniform vec3 u_AmbientLight;\n\
    uniform sampler2D u_Sampler;\n\
	varying vec4 v_Color;\n\
	varying vec3 v_Position;\n\
    varying vec3 v_Normal;\n\
    varying vec2 v_TexCoords;\n\
	void main() {\n\
		vec3 normal = normalize(v_Normal);\n\
		vec3 s_lightDirection = normalize(u_S_LightPosition - v_Position);\n\
		float s_nDotL = max(dot(s_lightDirection, normal), 0.0);\n\
        vec3 s_diffuse;\n\
        if(u_UseTextures){\n\
            vec4 TexColor = texture2D(u_Sampler, v_TexCoords);\n\
            s_diffuse = u_LightColor * TexColor.rgb * s_nDotL;\n\
        }else{\n\
            s_diffuse = u_LightColor * v_Color.rgb * s_nDotL;\n\
        }\n\
		vec3 ambient = 0.25 * u_AmbientLight * v_Color.rgb;\n\
		gl_FragColor = vec4(s_diffuse + ambient, v_Color.a);\n\
	}";

var modelMatrix = new Matrix4();
var viewMatrix = new Matrix4();
var projMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();
var light_r = 0;
var camera_x = 0.0;
var camera_y = 2.5;
var camera_z = 25.0;
var camera_rotate = 4.71239;

function wait(ms){
	var d = new Date();
	var d2 = null;
	do { d2 = new Date(); }
	while(d2-d < ms);
}

function main(){
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
    var u_S_LightPosition = gl.getUniformLocation(gl.program, "u_S_LightPosition");
    var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");
    var u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
    var u_UseTextures = gl.getUniformLocation(gl.program, "u_UseTextures");

	gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

	var s_lightPos = new Vector3([-5 - camera_x, 1 - camera_y, -10 - camera_z]);
    gl.uniform3fv(u_S_LightPosition, s_lightPos.elements);
	var ambientLight = new Vector3([1, 1, 1]);
	ambientLight.normalize();
	gl.uniform3fv(u_AmbientLight, ambientLight.elements);

	viewMatrix.setLookAt(0, 0, 0, 0, 0, 0, 0, 1, 0);
	projMatrix.setPerspective(30, canvas.width/canvas.clientHeight, 1, 100);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
	document.onkeydown = function(ev){
		keydown(ev);
	};
	requestAnimationFrame(draw(gl, u_ModelMatrix, u_NormalMatrix, u_ViewMatrix, u_S_LightPosition, u_Sampler, u_UseTextures));
}

function keydown(ev){
	switch(ev.keyCode){
		case 87: // 'w' key
			camera_z -= 0.5;
			break;
		case 65: // 'a' key
			camera_x -= 0.5;
			break;
		case 83: // 's' key
			camera_z += 0.5;
			break;
		case 68: // 'd' key
			camera_x += 0.5;
			break;
		case 37: // left arrow key
			camera_rotate -= 0.01;
			break;
		case 39: // right arrow key
			camera_rotate += 0.01;
			break;
		case 82: // 'r' key (reset camera)
			camera_x = 0.0;
			camera_y = 2.5;
			camera_z = 25.0;
			camera_rotate = 4.71239;
			break;
	}
}

function draw(gl, u_ModelMatrix, u_NormalMatrix, u_ViewMatrix, u_S_LightPosition, u_D_LightPosition, u_Sampler, u_UseTextures){
	return function(timestamp){
		viewMatrix.setLookAt(0, 0, 0, Math.cos(camera_rotate), 0, Math.sin(camera_rotate), 0, 1, 0);
		gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
        light_r += 0.1;
        modelMatrix.setTranslate(-camera_x, -camera_y, -camera_z);
        var s_lightPos = new Vector3([-5 - camera_x, 1 - camera_y, -10 - camera_z]);
        gl.uniform3fv(u_S_LightPosition, s_lightPos.elements);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, 7.5, -5);
			modelMatrix.rotate(45*Math.sin(light_r), 0, 0, 1);
			drawHangingLight(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(-5, 0, -10);
			drawLamp(gl, u_ModelMatrix, u_NormalMatrix);
			pushMatrix(modelMatrix);
				modelMatrix.translate(0, -1, 0);
				drawCoffeeTable(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures);
			modelMatrix = popMatrix();
		modelMatrix = popMatrix();
		var n = initVertexBuffers(gl);
		pushMatrix(modelMatrix);
			modelMatrix.translate(5, 0, -5);
			modelMatrix.rotate(90, 0, 1, 0);
			drawTableAndChairs(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(-5, 0, -15);
			drawShelves(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, 1.5, -10);
			drawTV(gl, u_ModelMatrix, u_NormalMatrix, u_Sampler, u_UseTextures,  u_UseTextures, n);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, -2.5, 0);
			drawGround(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, 0, -15.5);
			modelMatrix.rotate(90, 1, 0, 0);
			drawGround(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelmatrix = popMatrix();
		requestAnimationFrame(draw(gl, u_ModelMatrix, u_NormalMatrix, u_ViewMatrix, u_S_LightPosition, u_Sampler, u_UseTextures));
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