"use strict";

var points;
var canvas;
var gl;
var program;
var program3;
var normalMatrix, normalMatrixLoc;

var scaleFactor = .1;
var powerLevel = 1;
var mouseX = 0;
var mouseY = 0;

var placedFactories = [[]];
var inputFactory = [];
var resourceGenerators = [[]];


function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  canvas = document.getElementById("canvas");
  webglLessonsHelper.setupLesson(canvas);
  gl = canvas.getContext("webgl");
  if (!gl) {
    webglLessonsHelper.showNeedWebGL(canvas);
    return;
  }
    document.onmousemove = handleMouseMove;
	document.onclick = handleMouseClick;

  // look up the text canvas.
  var textCanvas = document.getElementById("text");

  // make a 2D context for it
  var ctx = textCanvas.getContext("2d");

  // setup GLSL program
  var program2 = webglUtils.createProgramFromScripts(gl, ["3d-vertex-shader", "3d-fragment-shader"]);

  // look up where the vertex data needs to go.
  var positionLocation = gl.getAttribLocation(program2, "a_position");
  var colorLocation = gl.getAttribLocation(program2, "a_color");

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program2, "u_matrix");

  // Create a buffer to put positions in
  var positionBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Put geometry data into buffer
	var obj = new Transform(0,0,0,1,1,1,gl);
  // Create a buffer to put colors in
  var colorBuffer = gl.createBuffer();
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = colorBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // Put geometry data into buffer
  function radToDeg(r) {
    return r * 180 / Math.PI;
  }

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var translation = [0, 30, -360];
  var rotation = [degToRad(190), degToRad(0), degToRad(0)];
  var scale = [1, 1, 1];
  var fieldOfViewRadians = degToRad(60);
  var rotationSpeed = 1.2;

  var then = 0;
	var scalar = 1;
		for(var r = 0; r < 100; r++){
			//pick a random point in 3d space within range
			var x = getRandomArbitrary(-1,1);
			var y = getRandomArbitrary(-1,1);
			var z = getRandomArbitrary(-1,1);
			
			alert(x + " " + y + " " + z);
			
			var inputResource =[
			x,	y+.1*scalar,z+.1*scalar,			x+.1*scalar,y+.1*scalar,z+.1*scalar, 			x+.1*scalar,y+.1*scalar,z+0,
			x,	y+.1*scalar,z+.1*scalar, 		x+0,y+.1*scalar,z+0, 							x+.1*scalar,y+.1*scalar,z+0,
			x,	y+.1*scalar,z+.1*scalar, 		x+0,y+.1*scalar,z+0, 							x+0,y+0,z+.1*scalar,
			x,	y+.1*scalar,z+.1*scalar, 		x+0,y+.1*scalar,z+0, 							x+0,y+0,z+0,
			x+.1*scalar,y+.1*scalar,z+0, 		x+0,y+.1*scalar,z+0, 							x+0,y+0,z+0,
			x+.1*scalar,y+.1*scalar,z+0, 		x+.1*scalar,y+0,z+0, 							x+0,y+0,z+0,
			x+.1*scalar,y+.1*scalar,z+0,		x+.1*scalar,y+0,z+0, 							x+.1*scalar,y+0,z+.1*scalar,
			x+.1*scalar,y+.1*scalar,z+0, 		x+.1*scalar,y+.1*scalar,z+.1*scalar, 			x+.1*scalar,y+0,z+.1*scalar,
			x+.1*scalar,y+.1*scalar,z+0, 		x+0,y+0,z+.1*scalar, 							x+.1*scalar,y+0,z+.1*scalar,
			x,y+.1*scalar,z+.1*scalar,			x+0,y+0,z+.1*scalar, 							x+.1*scalar,y+.1*scalar,z+.1*scalar,
			x,y+0,z+0, 							x+0,y+0,z+.1*scalar, 							x+.1*scalar,y+0,z+0,
			x,y+0,z+.1*scalar, 					x+.1*scalar,y+0,z+.1*scalar, 					x+.1*scalar,y+0,z+0];
			//place a resource generator centered at that point
			
			resourceGenerators.push(inputResource);
		
		}
  
  
  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(clock) {
    // Convert to seconds
    clock *= 0.001;
    // Subtract the previous time from the current time
    var deltaTime = clock - then;
    // Remember the current time for the next frame.
    then = clock;
	
	powerLevel += deltaTime;
	var cameraPosition = [0, 0, 100];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);
    // Every frame increase the rotation a little.

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    webglUtils.resizeCanvasToDisplaySize(ctx.canvas);
	
    // Clear the 2D canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.font = "20px serif";
	ctx.textAlign = "center";
	
	ctx.fillText("Tap or click to place a node.", canvas.width/2,canvas.height *7/8);

	DrawFactories();
	
	obj.draw();
    requestAnimationFrame(drawScene);
	
  }
  
	function getRandomArbitrary(min, max) {
	  return Math.random() * (max - min) + min;
	}
	
	function DrawFactories(){

		
		// Four Vertices
		
		var scalar = scaleFactor * powerLevel;
			
		
		inputFactory = [
			mouseX,	mouseY+.1*scalar,.1*scalar,			mouseX+.1*scalar,mouseY+.1*scalar,.1*scalar, 			mouseX+.1*scalar,mouseY+.1*scalar,0,
			mouseX,	mouseY+.1*scalar,.1*scalar, 		mouseX+0,mouseY+.1*scalar,0, 							mouseX+.1*scalar,mouseY+.1*scalar,0,
			mouseX,	mouseY+.1*scalar,.1*scalar, 		mouseX+0,mouseY+.1*scalar,0, 							mouseX+0,mouseY+0,.1*scalar,
			mouseX,	mouseY+.1*scalar,.1*scalar, 		mouseX+0,mouseY+.1*scalar,0, 							mouseX+0,mouseY+0,0,
			mouseX+.1*scalar,mouseY+.1*scalar,0, 		mouseX+0,mouseY+.1*scalar,0, 							mouseX+0,mouseY+0,0,
			mouseX+.1*scalar,mouseY+.1*scalar,0, 		mouseX+.1*scalar,mouseY+0,0, 							mouseX+0,mouseY+0,0,
			mouseX+.1*scalar,mouseY+.1*scalar,0,		mouseX+.1*scalar,mouseY+0,0, 							mouseX+.1*scalar,mouseY+0,.1*scalar,
			mouseX+.1*scalar,mouseY+.1*scalar,0, 		mouseX+.1*scalar,mouseY+.1*scalar,.1*scalar, 			mouseX+.1*scalar,mouseY+0,.1*scalar,
			mouseX+.1*scalar,mouseY+.1*scalar,0, 		mouseX+0,mouseY+0,.1*scalar, 							mouseX+.1*scalar,mouseY+0,.1*scalar,
			mouseX,mouseY+.1*scalar,.1*scalar,			mouseX+0,mouseY+0,.1*scalar, 							mouseX+.1*scalar,mouseY+.1*scalar,.1*scalar,
			mouseX,mouseY+0,0, 							mouseX+0,mouseY+0,.1*scalar, 							mouseX+.1*scalar,mouseY+0,0,
			mouseX,mouseY+0,.1*scalar, 					mouseX+.1*scalar,mouseY+0,.1*scalar, 					mouseX+.1*scalar,mouseY+0,0
		];
		
		var vertices = [];
		var surfaceNormals = [];
		
		for(let v of placedFactories){
			processVertices(v);
		}
		
		processVertices(inputFactory);

		
		for(let v of resourceGenerators){
			processVertices(v);
		}
		
		
		points = vertices.length;
		//
		//  Configure WebGL
		//
		gl.viewport( 0, 0, canvas.width, canvas.height );
		gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
		
		//  Load shaders and initialize attribute buffers
		
		program = initShaders( gl, "vertex-shader", "fragment-shader" );
		//program3 = initShaders(gl,"vertex-shader-resource-generators", "fragment-shader-resource-generators");
		gl.useProgram( program );
		
		// Load the data into the GPU
		
		var bufferId = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

		// Associate out shader variables with our data buffer
		
		var vPosition = gl.getAttribLocation( program, "vPosition" );
		gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vPosition );
		
		setRotation();
		
		
		var bufferId2 = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferId2 );
		gl.bufferData( gl.ARRAY_BUFFER, flatten(surfaceNormals), gl.STATIC_DRAW );
		
		var vNormals = gl.getAttribLocation( program, "vNormal" );
		gl.vertexAttribPointer( vNormals, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( vNormals );
		
		
		render();
		
		function processVertices(vertexArray){
			for(var i = 0; i < vertexArray.length; i = i + 9){
				
				var a = new vec3((vertexArray[i+0]),vertexArray[i+1],(vertexArray[i+2]));
				var b = new vec3((vertexArray[i+3]),vertexArray[i+4],(vertexArray[i+5]));
				var c = new vec3((vertexArray[i+6]),vertexArray[i+7],(vertexArray[i+8]));

				
				var vectorA = subtract(b,a);
				var vectorB = subtract(c,a);
				
				
				var normal = cross(vectorA,vectorB);
				
				normal[0] += .3;
				normal[1] += .3;
				normal[2] += .3;
				
				normal = normalize(normal);
				normal[3] =  0;
			
				surfaceNormals.push(normal);
				surfaceNormals.push(normal);
				surfaceNormals.push(normal);//cross product of b-a and c-a
				
				//normalize vector
				
				vertices.push(a);
				vertices.push(b);
				vertices.push(c);
				
			}
		}
		
	}

	function cross( a, b){ // [ a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1 ]
		var vec = new vec3(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]);
		return vec;
	}
	var matrix;
	function setRotation(){
		
		
		var x = 0;//document.getElementById("xSlider").value * 360/100;
		var y = 0;//document.getElementById("ySlider").value * 360/100;
		var z = 0;//document.getElementById("zSlider").value * 360/100;
		
		
		matrix = [
			1, 0,  0,  0,
			0, 1,  0,  0,
			0,  0, 1,  0,
			0,  0,  0,  1,
		];
		
		matrix = multiplyMatrix(matrix, rotateAlongX(x));
		matrix = multiplyMatrix(matrix, rotateAlongY(y));
		matrix = multiplyMatrix(matrix, rotateAlongZ(z));	
		
		var rotation = gl.getUniformLocation( program, "rotationMatrix" );
		gl.uniformMatrix4fv(rotation, false, matrix);
		
		gl.vertexAttribPointer( rotation, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( rotation );
	}

	function rotateAll() {	
		setRotation();
		
		var bufferId = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
		render();

		// Set the matrix.
	}

	// returns a new matrix
	function multiplyMatrix(matrixA, matrixB) { 
		var result = [
			0, 0,  0,  0,
			0, 0,  0,  0,
			0,  0, 0,  0,
			0,  0,  0,  0];
			
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				var sum = 0;
				for (var k = 0; k < 4; k++) {
					sum += matrixA[i*4+k] * matrixB[k*4+j];
				}
				result[i * 4 + j] = sum;
			}
		}
		return result; 
	}

	function rotateAlongX(angleInDegrees) {
		var angleInRadians = angleInDegrees * 0.0174533;
		
	  var sine = Math.sin(angleInRadians);
	  var cosine = Math.cos(angleInRadians);

	  return [
		1, 	0, 		0, 0,
		0, 	cosine, sine, 0,
		0, 	-sine, 	cosine, 0,
		0, 	0, 		0, 1
	  ];
	};

	function rotateAlongY(angleInDegrees) {
	  var angleInRadians = angleInDegrees * 0.0174533;
	  var sine = Math.sin(angleInRadians);
	  var cosine = Math.cos(angleInRadians);

	  return [
		cosine, 0, -sine, 0,
		0, 		1, 0, 0,
		sine, 	0, cosine, 0,
		0, 		0, 0, 1
	  ];
	};

	function rotateAlongZ(angleInDegrees) {
	  var angleInRadians = angleInDegrees * 0.0174533;
	  var sine = Math.sin(angleInRadians);
	  var cosine = Math.cos(angleInRadians);
	  return [
		 cosine, 	sine, 0, 0,
		-sine, 		cosine, 0, 0,
		 0, 		0, 1, 0,
		 0, 		0, 0, 1,
	  ];
	}
	
	
	function render() {

		normalMatrix = [
			vec3(matrix[0], matrix[1], matrix[2]),
			vec3(matrix[3], matrix[4], matrix[5]),
			vec3(matrix[6], matrix[7], matrix[8])
		];
		
		gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
		gl.clear( gl.COLOR_BUFFER_BIT );
		gl.drawArrays( gl.TRIANGLES, 0, points );
	}
}
function handleMouseMove(event) {
    var rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left/2,
	mouseX = -.985+ mouseX*4 /800;
    mouseY = -event.clientY - rect.top/2;
	mouseY = 1.15+ mouseY * 4 /600;

}


function handleMouseClick(event) {
    powerLevel = 1;
	placedFactories.push(inputFactory);
}  


main();