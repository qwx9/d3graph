function compile(){
	let s: string = "";
	for(let k in options)
		s += options[k].compile();
	return s;
}
