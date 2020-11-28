function compile(){
	let s = [];
	for(let k in options)
		s = [...s, ...options[k].compile()];
	return s;
}
