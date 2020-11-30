function compile(){
	let s: string[] = [];
	for(let k in options)
		s = [...s, ...options[k].compile()];
	return s;
}
