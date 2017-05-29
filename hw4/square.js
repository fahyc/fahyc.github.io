
var gl;
var points;

var vertices = [];
var canvas;
var program;

window.onload = function init()
{
	//This file loading is based on code by w3schools: http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			load(this.responseText);
			//console.log(this.responsetext)
		}
	};
	xhttp.open("GET", "ncc1701b.data", true);
	xhttp.send();
};

changeSlider = function (){
	var x =document.getElementById('xSlider').value;
	var y =document.getElementById('ySlider').value;
	var z =document.getElementById('zSlider').value;
	//console.log("(" + x + "," + y + "," + z + ")");
	
	document.getElementById('xtext').value = x;
	document.getElementById('ytext').value = y;
	document.getElementById('ztext').value = z;
	
	var mx = M.xAngleToMatrix(x);
	var my = M.yAngleToMatrix(y);
	var mz = M.zAngleToMatrix(z);
	var mxy = M.mMultiply(mx,my);
	var mxyz = M.mMultiply(mxy,mz);
	//console.log("mxy: " + mxy + " mxyz " + mxyz);
	updateScene(mxyz);
	
}

var scalar = .2;
var vertices = [];

var load = function(dataset){
	canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }
	var t = dataset.replace(/\r\n|\r|\n/g," ");
	var pointarr = t.split(" ");
	for(var i = 0; i < pointarr.length; i+=3){
		vertices[i/3] = vec3(pointarr[i] * scalar,pointarr[i+1] * scalar,pointarr[i+2] * scalar);
	}
	drawShip();
}

var updateScene = function(matrix){
	
	var shipPosition = gl.getUniformLocation(program,"ShipPosition");
	
	gl.uniformMatrix4fv(shipPosition,false,matrix);
	render();
}

 var drawShip = function(){//matrix=M.Identity()){ 
	//var tVerts = [];
	//for(var i = 0; i < vertices.length; i++){
	//	tVerts[i] = M.transform(vertices[i], matrix);
	//}
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	
	//Load shaders and initialize attribute buffers
	
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
	
	// Load the data into the GPU
	
	//console.log(shipPosition);
	//shipPosition = matrix;
	//mat4 = new J3DIMatrix4();
	
	
	//mat4.setUniform(gl,shipPosition,false);
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	// Associate out shader variables with our data buffer
	
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	updateScene(M.Identity())
	//console.log(matrix);
	render();
};


function render() {
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.drawArrays( gl.TRIANGLES, 0,vertices.length );
}
