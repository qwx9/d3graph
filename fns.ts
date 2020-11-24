function fatal(err: string){
	console.log(err);
	throw new Error(err);
}
