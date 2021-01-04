function pusherror(e: string, v: Value | BppOpt){
	errors.push({err:e, val:v});
}
function compile(){
	errors = [];
	files = {};
	let s: string = "";
	for(let k in options)
		s += options[k].compile().replace(/\$/g, "");
	return s;
}
