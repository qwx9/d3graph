function showerrors(){
	//document.getElementById("errors")!.textContent = "No errors.";
}
function showcompiled(){
	const r = document.getElementById("result") as HTMLDivElement;
	r.innerHTML = "";
	files = {};
	const s = compile();
	showerrors();
	s.forEach((e) => {
		r.innerHTML += e + "<br>";
	});
	r.innerHTML += "<br>Files:<br>";
	for(let k in files)
		r.innerHTML += k + ": " + files[k].files![0].name + "<br>";
	return s;
}
function submit(){
	const fd = new FormData();
	const s = showcompiled();
	fd.append("bpp", s.join("\n"));
	for(let k in files)
		fd.append(k, files[k].files![0], k);

	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if(xhr.readyState === XMLHttpRequest.DONE)
			document.getElementById("response")!.innerHTML = xhr.responseText;
	}
	/*
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
	const b = document.getElementsByTagName("body")[0];
	addbutton(b, "Compile", () => {
		showcompiled();
	});
	addbutton(b, "Submit", () => {
		submit();
	});
}
