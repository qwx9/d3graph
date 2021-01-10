/* body of html document contains a few root divs, containing respectively
 * the input and visualization of the state of the current model,
 * a strip with buttons, and the compilation result. */

/* show compilation errors in results div element */
function showerrors(){
	/* sanity check */
	if(errors.length < 1)
		return;
	/* retrieve results div and clear it */
	const r = document.getElementById("result") as HTMLDivElement;
	r.innerHTML = "";
	/* add a title span with bold text and line break */
	addspan(r, "Compilation error:").style.fontWeight = "bold";
	addbr(r);
	/* paste each error on its own line (div) */
	errors.forEach((e) => {
		const d = adddiv(r);
		addspan(d, e.err);
		(e.val);	/* add to error string? */
	});
}
/* compile model and show result */
function showcompiled(){
	/* compile the model from the state graph */
	const s = compile();
	/* stop on empty graph or errors */
	if(s === "" || errors.length > 0){
		showerrors();
		return "";
	}
	/* get and clear result root div and clear */
	const r = document.getElementById("result") as HTMLDivElement;
	r.innerHTML = "";
	/* add a title span with bold text */
	addspan(r, "Compilation successful:").style.fontWeight = "bold";
	const d = adddiv(r);
	/* paste compilation result, replacing all newlines with html line breaks,
	 * newlines will not render */
	d.innerHTML = s.replace(/\n/g, "<br>");
	return s;
}
/* compilation model and send to server */
function submit(){
	/* create a new form to fill and get compilation result */
	const fd = new FormData();
	const s = showcompiled();
	/* stop on error */
	if(s === "")
		return;
	/* append compilation result as a form element named bpp,
	 * for retrieval by the server */
	fd.append("bpp", s);
	/* append files to form, renaming them to the name of the symbol in the model
	 * for safety */
	for(let k in files)
		fd.append(k, files[k].files![0], k);

	/* create an http request and send to the site's submit page */
	const xhr = new XMLHttpRequest();

	/* debugging: submission success, server reply
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
/* add compilation and submissal buttons to the html body */
function registersubmit(){
	/* get the appropriate container div */
	const b = document.getElementById("buttons") as HTMLElement;
	/* add buttons and register for event handlers the functions above;
	 * simultaneously set css class for pretty buttons */
	addbutton(b, "Compile", () => {
		showcompiled();
	}).classList.add("primary");
	addbutton(b, "Submit", () => {
		submit();
	}).classList.add("primary");
}
