function showerrors(){
	document.getElementById("errors").textContent = "No errors.";
}
function showcompiled(){
	const r = document.getElementById("result");
	r.innerHTML = "";
	const s = compile();
	showerrors();
	s.forEach((e) => {
		addspan(r, e);
		addbr(r);
	});
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
