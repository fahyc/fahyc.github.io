var M = {};


M.transform = function(p, m) {//transforms a point by matrix m
	return [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
			m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
			m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]];
}

M.xAngleToMatrix = function(a){
	return [1,0,0,0, 0,Math.cos(a),Math.sin(a),0, 0,-Math.sin(a),Math.cos(a),0, 0,0,0,1];
}
M.yAngleToMatrix = function(a){
	return [Math.cos(a),0,-Math.sin(a),0, 0,1,0,0, Math.sin(a),0,Math.cos(a),0, 0,0,0,1];
}
M.zAngleToMatrix = function(a){
	return [Math.cos(a),-Math.sin(a),0,0, Math.sin(a),Math.cos(a),0,0, 0,0,1,0, 0,0,0,1];
}

M.mMultiply = function(a,b){
//multiplies two 4x4 matricies.
	var out = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
	var dim = 4;
	for(var i = 0; i < dim*dim; i++){
		var x1 = 0; 
		var y1 = i%dim; 
		var x2 = Math.floor(i/4);
		var y2 = 0;
		for(var j = 0; j < dim; j++){
			out[i] += a[x1 * dim + y1] * b[x2 * dim + y2];
			x1++;
			y2++;
		}
	}
	return out;
}

M.Identity = function(){
	return [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0, 1];
}
