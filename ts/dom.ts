function newelement(type: string, parent: HTMLDivElement | null = null){
	const e = document.createElement(type);
	if(e === null)
		fatal("newelement: couldn't create new element");
	if(parent !== null)
		parent.appendChild(e);
	return e;
}

function adddiv(parent: HTMLDivElement){
	const e = newelement("div") as HTMLDivElement;
	parent.appendChild(e);
	return e;
}

function addspan(parent: HTMLElement, text: string | null = null){
	const e = newelement("span") as HTMLSpanElement;
	if(text !== null)
		e.textContent = text;
	parent.appendChild(e);
	return e;
}

function addbr(parent: HTMLElement){
	parent.appendChild(newelement("br"));
}

function addspanbeforelast(parent: HTMLElement, text: string | null = null){
	const e = newelement("span") as HTMLSpanElement;
	if(text !== null)
		e.textContent = text;
	parent.insertBefore(e, parent.children[parent.childElementCount-1]);
	return e;
}

function addoption(sel: HTMLSelectElement, val: string, disabled: boolean = false, selected: boolean = false){
	const e = newelement("option") as HTMLOptionElement;
	e.value = val;
	e.textContent = val;
	if(disabled)
		e.disabled = true;
	if(selected){
		e.selected = true;
		e.defaultSelected = true;
	}
	sel.add(e);
	return e;
}

function addselect(parent: HTMLDivElement, array: any[], attr: string, disable: boolean, action: () => void){
	const e = newelement("select") as HTMLSelectElement;
	array.forEach((v) => {
		addoption(e, v[attr], disable);
	});
	if(action !== null)
		e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}

function addselectfn(parent: HTMLElement, fn: (HTMLSelectElemen) => void, action: () => void){
	const e = newelement("select") as HTMLSelectElement;
	fn(e);
	if(action !== null)
		e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}

function addbutton(parent: HTMLDivElement | HTMLSpanElement, label: string, action: () => void){
	const e = newelement("button") as HTMLButtonElement;
	e.textContent = label;
	e.addEventListener("click", action);
	parent.appendChild(e);
	return e;
}

function addcheckbox(parent: HTMLElement, checked: boolean, action: () => void){
	const e = newelement("input") as HTMLInputElement;
	e.setAttribute("type", "checkbox");
	e.checked = checked;
	e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}

function addtext(parent: HTMLElement, text: string | null, action: () => void){
	const e = newelement("input") as HTMLInputElement;
	e.setAttribute("type", "text");
	if(text !== null)
		e.value = text;
	e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}

function addfile(parent: HTMLElement, action: () => void){
	const e = newelement("input") as HTMLInputElement;
	e.setAttribute("type", "file");
	e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}
