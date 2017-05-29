function processRequest(obj){
	var ret;
	console.log(obj);
	if(typeof(obj) == "string"){
		ret = JSON.parse(obj);
	}else{
		ret = obj;
	}
	if(ret === undefined || ret === null){
		console.log("error no data recieved.");
		return null;
	}
	if(ret.errorMessage != undefined){
		alert(ret.errorMessage);
		if(!ret.continueAnyway){
			return null;
		}
	}
	if(ret.token != undefined){
		setCookie("token",ret.token,14);
	}
	return ret;
}

function createRequest(obj){
	obj.Passcode = getCookie("token");
	obj.Username = getCookie("Username");
	return JSON.stringify(obj);
}


function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}