
var gl;
var points;

window.onload = function init()
{
	//This file loading is based on code by w3schools: http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			setup(this.responseText);
			//console.log(this.responsetext)
		}
	};
	xhttp.open("GET", "ncc1701b.data", true);
	xhttp.send();
};
	
var scalar = .2;
var vertices = [];
	
 var setup = function(dataset){   
	
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
	var t = dataset.replace(/\r\n|\r|\n/g," ");
    var pointarr = t.split(" ");
	for(var i = 0; i < pointarr.length; i+=3){
		vertices[i/3] = vec3(pointarr[i] * scalar,pointarr[i+1] * scalar,pointarr[i+2] * scalar);
	}

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0,vertices.length );
}
