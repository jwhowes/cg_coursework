//TODO: Implement normal map for the brick wall (have to load it into TEXTURE1 and put that into u_Sampler_normal as a uniform).
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
    uniform vec3 u_s_LightPosition;\n\
    uniform vec3 u_d_LightPosition;\n\
	uniform bool u_UseTextures;\n\
	uniform bool u_UseNormalMap;\n\
	uniform vec3 u_AmbientLight;\n\
	uniform sampler2D u_Sampler;\n\
	uniform sampler2D u_Sampler_normal;\n\
	varying vec4 v_Color;\n\
	varying vec3 v_Position;\n\
	varying vec3 v_Normal;\n\
	varying vec2 v_TexCoords;\n\
	void main() {\n\
		vec3 normal;\n\
		if(u_UseNormalMap){\n\
			normal = normalize(texture2D(u_Sampler_normal, v_TexCoords).rgb);\n\
		}else{\n\
			normal = normalize(v_Normal);\n\
		}\n\
		vec3 s_lightDirection = normalize(u_s_LightPosition - v_Position);\n\
        float s_nDotL = max(dot(normal, s_lightDirection), 0.0);\n\
        vec3 d_lightDirection = normalize(u_d_LightPosition - v_Position);\n\
        float d_nDotL = max(dot(normal, d_lightDirection), 0.0);\n\
        vec3 s_diffuse;\n\
        vec3 d_diffuse;\n\
		vec4 TexColor;\n\
		vec3 ambient;\n\
		if(u_UseTextures){\n\
			vec4 TexColor = texture2D(u_Sampler, v_TexCoords);\n\
            s_diffuse = u_LightColor * TexColor.rgb * s_nDotL;\n\
            d_diffuse = u_LightColor * TexColor.rgb * d_nDotL;\n\
			ambient = 0.25 * u_AmbientLight * TexColor.rgb;\n\
			gl_FragColor = vec4(ambient + 0.5*(s_diffuse + d_diffuse), TexColor.a);\n\
		}else{\n\
            s_diffuse = u_LightColor * v_Color.rgb * s_nDotL;\n\
            d_diffuse = u_LightColor * v_Color.rgb * d_nDotL;\n\
			ambient = 0.25 * u_AmbientLight * v_Color.rgb;\n\
			gl_FragColor = vec4(ambient + 0.5*(s_diffuse + 0.5*d_diffuse), v_Color.a);\n\
		}\n\
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
var sky_channel = true;
var table_rotate = 0.0;
var chairs_moving = false;
var chair_move_amount = 0.0;

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
    var u_s_LightPosition = gl.getUniformLocation(gl.program, "u_s_LightPosition");
    var u_d_LightPosition = gl.getUniformLocation(gl.program, "u_d_LightPosition");
	var u_AmbientLight = gl.getUniformLocation(gl.program, "u_AmbientLight");
	var u_Sampler = gl.getUniformLocation(gl.program, "u_Sampler");
	var u_Sampler_normal = gl.getUniformLocation(gl.program, "u_Sampler_normal")
	var u_UseTextures = gl.getUniformLocation(gl.program, "u_UseTextures");
	var u_UseNormalMap = gl.getUniformLocation(gl.program, "u_UseNormalMap");

	gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0, 1.0);

    var s_LightPos = new Vector3([-3.25 - camera_x, 1 - camera_y, -19.5 - camera_z]);
    var d_LightPos = new Vector3([-camera_x, 8.5-camera_y, -5-camera_z]);
    gl.uniform3fv(u_s_LightPosition, s_LightPos.elements);
    gl.uniform3fv(u_d_LightPosition, d_LightPos.elements);
	var ambientLight = new Vector3([1, 1, 1, 1]);
	ambientLight.normalize();
	gl.uniform3fv(u_AmbientLight, ambientLight.elements);

	viewMatrix.setLookAt(0, 0, 0, 0, 0, 0, 0, 1, 0);
	projMatrix.setPerspective(30, canvas.width/canvas.clientHeight, 1, 100);
	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
	document.onkeydown = function(ev){
		keydown(ev);
	};
	SkyTexture = gl.createTexture();
	SkyTexture.image = new Image();
	SkyTexture.image.src = "../resources/sky.jpg";
	
	LenaTexture = gl.createTexture();
	LenaTexture.image = new Image();
	LenaTexture.image.src = "../resources/lena.jpg";

	WoodTexture = gl.createTexture();
	WoodTexture.image = new Image();
	WoodTexture.image.src = "../resources/wood.jpg";

	WoodNormal = gl.createTexture();
	WoodNormal.image = new Image();
	WoodNormal.image.src = "../resources/wood_normal.jpg";

	BrickTexture = gl.createTexture();
	BrickTexture.image = new Image();
	BrickTexture.image.src = "../resources/brick.jpg";

	BrickNormal = gl.createTexture();
	BrickNormal.image = new Image();
	BrickNormal.image.src = "../resources/brick_normal.jpg"

	PaintingTexture = gl.createTexture();
	PaintingTexture.image = new Image();
	PaintingTexture.image.src = "../resources/painting.jpg";
	requestAnimationFrame(draw(gl, u_ModelMatrix, u_NormalMatrix, u_ViewMatrix, u_s_LightPosition, u_d_LightPosition, u_UseTextures, u_Sampler, u_Sampler_normal, u_UseNormalMap));
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
			chairs_moving = false;
			chair_move_amount = 0;
			table_rotate = 0;
			sky_channel = true;
			break;
		case 32: // space key
			sky_channel = !sky_channel
			break;
		case 74: // 'j' key
			table_rotate -= 0.4;
			break;
		case 76: // 'l' key
			table_rotate += 0.4;
			break;
		case 17: // Left control
			chairs_moving = !chairs_moving;
			if(!chairs_moving){
				chair_move_amount = 0;
			}
			break;
	}
}

function draw(gl, u_ModelMatrix, u_NormalMatrix, u_ViewMatrix, u_s_LightPosition, u_d_LightPosition, u_UseTextures, u_Sampler, u_Sampler_normal, u_UseNormalMap){
	return function(timestamp){
		if(chairs_moving){
			chair_move_amount += 0.1;
		}
		viewMatrix.setLookAt(0, 0, 0, Math.cos(camera_rotate), 0, Math.sin(camera_rotate), 0, 1, 0);
		gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
		light_r += 2*Math.PI/120;
		modelMatrix.setTranslate(-camera_x, -camera_y, -camera_z);
        var s_LightPos = new Vector3([-6.5 - camera_x, 1 - camera_y, -10 - camera_z]);
        var d_LightPos = new Vector3([-camera_x, 8.5-camera_y, -5-camera_z]);

        gl.uniform3fv(u_s_LightPosition, s_LightPos.elements);
        gl.uniform3fv(u_d_LightPosition, d_LightPos.elements);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, 8.5, -5);
			modelMatrix.rotate(45*Math.sin(light_r), 0, 0, 1);
			drawHangingLight(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(-6.5, 0, -10);
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
			modelMatrix.rotate(table_rotate, 0, 1, 0);
			drawTableAndChairs(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix = popMatrix();
		pushMatrix(modelMatrix);
			modelMatrix.translate(-7, 1.25, -19.5);
			modelMatrix.scale(1.5, 1.5, 1.5);
			drawShelves(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix = popMatrix();
		if(sky_channel){
			loadTexture(gl, SkyTexture, u_Sampler);
		}else{
			loadTexture(gl, LenaTexture, u_Sampler);
		}
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, 2.5, -19.5);
			modelMatrix.scale(1.25, 1.25, 1.25);
			drawTV(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix = popMatrix();
		gl.uniform1i(u_UseNormalMap, true);
		loadTexture(gl, WoodTexture, u_Sampler);
		loadNormalMap(gl, WoodNormal, u_Sampler_normal);
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, -2.5, 0);
			drawGround(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix = popMatrix();
		loadTexture(gl, BrickTexture, u_Sampler);
		loadNormalMap(gl, BrickNormal, u_Sampler_normal);
		pushMatrix(modelMatrix);
			modelMatrix.translate(0, 0, -20);
			modelMatrix.rotate(90, 1, 0, 0);
			modelMatrix.rotate(90, 0, 1, 0);
			drawGround(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix = popMatrix();
		gl.uniform1i(u_UseNormalMap, false);
		loadTexture(gl, PaintingTexture, u_Sampler);
		pushMatrix(modelMatrix);
			modelMatrix.translate(7.5, 3.5, -19.5);
			drawPainting(gl, u_ModelMatrix, u_NormalMatrix, u_UseTextures, n);
		modelMatrix = popMatrix();
		requestAnimationFrame(draw(gl, u_ModelMatrix, u_NormalMatrix, u_ViewMatrix, u_s_LightPosition, u_d_LightPosition, u_UseTextures, u_Sampler, u_Sampler_normal, u_UseNormalMap));
	}
}

function initArrayBuffer(gl, attribute, data, num, type){  // Assigns atttribute to the array buffer containing data with vSize n and type type
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	gl.vertexAttribPointer(a_attribute, num, type, false, data.BYTES_PER_ELEMENT * num, 0);
	gl.enableVertexAttribArray(a_attribute);
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