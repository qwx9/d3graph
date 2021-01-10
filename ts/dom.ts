/* common DOM functions. each new element function appends to a parent element
 * and returns the new element, allowing for rudimentary chaining. */

/* create and return a new html element of type *type*; if a parent is specified,
 * append to it.
 * document is the root DOM element which always exists, and the rest are API
 * functions. */
function newelement(type: string, parent: HTMLDivElement | null = null){
	const e = document.createElement(type);
	if(e === null)
		fatal("newelement: couldn't create new element");
	if(parent !== null)
		parent.appendChild(e);
	return e;
}

/* append a new div element to a parent (of any type, usually div or span) */
function adddiv(parent: HTMLElement){
	const e = newelement("div") as HTMLDivElement;
	parent.appendChild(e);
	return e;
}

/* append a new span element to a parent (of any type, usually div or span),
 * and place text inside if one is provided */
function addspan(parent: HTMLElement, text: string | null = null){
	const e = newelement("span") as HTMLSpanElement;
	if(text !== null)
		e.textContent = text;
	parent.appendChild(e);
	return e;
}

/* append a line break to a parent element */
function addbr(parent: HTMLElement){
	parent.appendChild(newelement("br"));
}

/* insert a span right before the last of parent's children, and paste text
 * inside if provided */
function addspanbeforelast(parent: HTMLElement, text: string | null = null){
	const e = newelement("span") as HTMLSpanElement;
	if(text !== null)
		e.textContent = text;
	parent.insertBefore(e, parent.children[parent.childElementCount-1]);
	return e;
}

/* add a new option to a select element with label *val*. it can be disabled
 * directly and/or selected by default. this allows for unselectable empty
 * options, both as a default state for a select, and to allow actions on
 * selecting any element, by always reseting to this option. */
function addoption(sel: HTMLSelectElement, val: string, disabled: boolean = false, selected: boolean = false){
	const e = newelement("option") as HTMLOptionElement;
	/* both value and label are set to the same thing */
	e.value = val;
	e.textContent = val;
	if(disabled)
		e.disabled = true;
	if(selected){
		e.selected = true;
		e.defaultSelected = true;
	}
	/* need API function to append the option to the select */
	sel.add(e);
	return e;
}

/* append a select element to a parent div. *array* is an array of option
 * labels. options can be disabled by default. *action* is the select's
 * event handler, called any time an option is selected. */
function addselect(parent: HTMLDivElement, array: any[], attr: string, disable: boolean, action: (() => void) | null){
	const e = newelement("select") as HTMLSelectElement;
	array.forEach((v) => {
		addoption(e, v[attr], disable);
	});
	if(action !== null)
		e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}

/* same as addselect, but calls a function *fn* onto the new select to
 * populate it, just to encapsulate arbitrary option placement. *action* is
 * the select's handler for selection events. */
function addselectfn(parent: HTMLElement, fn: (a: HTMLSelectElement) => void, action: () => void){
	const e = newelement("select") as HTMLSelectElement;
	fn(e);
	if(action !== null)
		e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}

/* append a button to a parent element (div or span), with a text *label*,
 * and set *action* event handler for clicks. */
function addbutton(parent: HTMLDivElement | HTMLSpanElement, label: string, action: () => void){
	const e = newelement("button") as HTMLButtonElement;
	e.textContent = label;
	e.addEventListener("click", action);
	parent.appendChild(e);
	return e;
}

/* append a checkbox to a parent element, with *checked* its default value,
 * and *action* the event handler for clicks. */
function addcheckbox(parent: HTMLElement, checked: boolean, action: () => void){
	const e = newelement("input") as HTMLInputElement;
	e.setAttribute("type", "checkbox");
	e.checked = checked;
	e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}

/* append a text area element to a parent element, with *text* the box's
 * default content and action an event handler for confirming a new text
 * value. */
function addtext(parent: HTMLElement, text: string | null, action: () => void){
	const e = newelement("input") as HTMLInputElement;
	e.setAttribute("type", "text");
	if(text !== null)
		e.value = text;
	e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}

/* append a file dialogue to parent element, with *action* the event
 * handler after file selection. */
function addfile(parent: HTMLElement, action: () => void){
	const e = newelement("input") as HTMLInputElement;
	e.setAttribute("type", "file");
	e.style.display = "inline";
	e.addEventListener("change", action);
	parent.appendChild(e);
	return e;
}
