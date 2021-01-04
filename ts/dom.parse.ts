function showerrors(){
	if(errors.length < 1)
		return;
	const r = document.getElementById("result") as HTMLDivElement;
	r.innerHTML = "";
	//r.className = "card error fluid";
	addspan(r, "Compilation error:").style.fontWeight = "bold";
	addbr(r);
	errors.forEach((e) => {
		const d = adddiv(r);
		//d.className = "row";
		addspan(d, e.err);
		(e.val);
	});
}
function showcompiled(){
	const s = compile();
	if(s === "" || errors.length > 0){
		showerrors();
		return "";
	}
	const r = document.getElementById("result") as HTMLDivElement;
	r.innerHTML = "";
	addspan(r, "Compilation successful:").style.fontWeight = "bold";
	//addbr(r);
	const d = adddiv(r);
	d.innerHTML = s.replace(/\n/g, "<br>");
	/*
	d.innerHTML += "<br>Files:<br>";
	for(let k in files)
		d.innerHTML += k + ": " + files[k].files![0].name + "<br>";
	*/
	return s;
}
function submit(){
	const fd = new FormData();
	const s = showcompiled();
	if(s === "")
		return;
	fd.append("bpp", s);
	for(let k in files)
		fd.append(k, files[k].files![0], k);

	const xhr = new XMLHttpRequest();
	/*
	xhr.onreadystatechange = () => {
		if(xhr.readyState === XMLHttpRequest.DONE)
			document.getElementById("response")!.innerHTML = xhr.responseText;
	}
	xhr.addEventListener("load", (e: Event) => {
		(e);
		window.location.reload();
	});
	xhr.addEventListener("error", (e: Event) => {
		(e);
		alert("error");
	});
	*/
	xhr.open("POST", "submit", true);
	xhr.send(fd);
}
function registersubmit(){
	//const b = document.getElementsByTagName("body")[0];
	const b = document.getElementById("buttons") as HTMLElement;
	addbutton(b, "Compile", () => {
		showcompiled();
	}).classList.add("primary");
	addbutton(b, "Submit", () => {
		submit();
	}).classList.add("primary");
}
