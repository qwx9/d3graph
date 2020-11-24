function newelement(type: string){
	const e = document.createElement(type);
	if(e === null)
		fatal("newelement: couldn't create new element");
	return e;
}

function adddiv(parent: HTMLDivElement){
	const d = newelement("div") as HTMLDivElement;
	parent.appendChild(d);
	return d;
}

function addlabel(parent: HTMLDivElement, label: string){
	const lab = newelement("span") as HTMLSpanElement;
	lab.textContent = label;
	parent.appendChild(lab);
}

function addoption(sel: HTMLSelectElement, val: string, disabled: boolean = false, selected: boolean = false){
	const o = newelement("option") as HTMLOptionElement;
	o.value = val;
	o.textContent = val;
	if(disabled)
		o.disabled = true;
	if(selected){
		o.selected = true;
		o.defaultSelected = true;
	}
	sel.add(o);
}

function addbutt(parent: HTMLDivElement, label: string, fn: () => void){
	const but = newelement("button") as HTMLButtonElement;
	but.textContent = label;
	but.addEventListener("click", fn);
	parent.appendChild(but);
}
