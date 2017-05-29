
var gl;
var points;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // Four Vertices
    
    var vertices = [
        vec2( -0.5, -0.5 ),
        vec2(  -0.5,  0.5 ),
        vec2(  0.5, 0.5 ),
        vec2( 0.5, -0.5)
    ];
	
	/*
	var vertices = [
        vec2( -0.5, -0.5 ),
        vec2(  -0.5,  0.5 ),
        vec2(  0.5, 0.5 ),
        vec2( 0.5, -0.5)
    ];
	var vertices = [
		vec2(.151,.288),// 	Ctl
		vec2(.423,.288),//	CTR
		vec2(.151,.307),//	Ctl2
		vec2(.423,.307),//	CTR2
	
		vec2(.151,.688),// 	CBl2
		vec2(.423,.688),//	CBR2
		vec2(.151,.707),//	Cbl
		vec2(.423,.707),//	CbR
	
	
		vec2(.174,.288),//	cli1
		vec2(.174,.688),//	cli2
	
	
		vec2(.551,.288),// 	Ftl
		vec2(.923,.288),//	fTR
		vec2(.551,.307),//	ftl2
		vec2(.923,.307),//	fTR2
		
		vec2(.551,.438),// 	Fml
		vec2(.923,.438),//	fmR
		vec2(.551,.457),//	fml2
		vec2(.923,.457),//	fmR2
		
		vec2(.574,.288),//	Fli1
		vec2(.574,.688),//	Fli2
		
		vec2(.551,.707),//	Fbl
	]
	*/
	var vertices = [
		vec2(.151,1-.288),// 	Ctl
		vec2(.423,1-.288),//	CTR
		vec2(.151,1-.307),//	Ctl2
		
		vec2(.423,1-.288),//	CTR
		vec2(.151,1-.307),//	Ctl2
		vec2(.423,1-.307),//	CTR2

		vec2(.151,1-.288),// 	Ctl
		vec2(.174,1-.288),//	cli1
		vec2(.174,1-.688),//	cli2
		
		vec2(.151,1-.288),// 	Ctl
		vec2(.174,1-.688),//	cli2
		vec2(.151,1-.707),//	Cbl
		
		vec2(.151,1-.688),// 	CBl2
		vec2(.423,1-.688),//	CBR2
		vec2(.151,1-.707),//	Cbl
		
		vec2(.151,1-.707),//	Cbl
		vec2(.423,1-.688),//	CBR2
		vec2(.423,1-.707),//	CbR
		
		vec2(.551,1-.288),// 	Ftl
		vec2(.923,1-.288),//	fTR
		vec2(.551,1-.307),//	ftl2
		
		vec2(.923,1-.288),//	fTR
		vec2(.551,1-.307),//	ftl2
		vec2(.923,1-.307),//	fTR2
		
		vec2(.551,1-.438),// 	Fml
		vec2(.923,1-.438),//	fmR
		vec2(.551,1-.457),//	fml2
		
		vec2(.923,1-.438),//	fmR
		vec2(.551,1-.457),//	fml2
		vec2(.923,1-.457),//	fmR2
		
		
		vec2(.574,1-.288),//	Fli1
		vec2(.574,1-.688),//	Fli2
		vec2(.551,1-.288),// 	Ftl
		
		
		vec2(.551,1-.288),// 	Ftl
		vec2(.574,1-.688),//	Fli2
		vec2(.551,1-.707),//	Fbl
	]
    //
    //  Configure WebGL
    //
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
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0,36 );
}
