function pushfile(sym: Sym, file: HTMLInputElement){
	files[sym.parent.ref()] = file;
}
function showerrors(){
	document.getElementById("errors")!.textContent = "No errors.";
}
function showcompiled(){
	const r = document.getElementById("result") as HTMLDivElement;
	r.innerHTML = "";
	const s = compile();
	showerrors();
	s.forEach((e) => {
		r.innerHTML += e + "<br>";
	});
	r.innerHTML += "<br>Files:<br>";
	for(let k in files)
		r.innerHTML += k + ": " + files[k].files![0].name + "<br>";
}
function submit(){

}
function registersubmit(){
	const b = document.getElementsByTagName("body")[0];
	addbutton(b, "Compile", () => {
		showcompiled();
	});
	addbutton(b, "Submit", () => {
		submit();
	});
}
