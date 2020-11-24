class OptionElem{
	readonly option: Option;
	readonly div: HTMLDivElement;
	readonly datdiv: HTMLDivElement;
	readonly label: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	readonly add: HTMLButtonElement;

	constructor(option: Option){
		this.option = option;
		this.div = newelement("div");
		document.getElementByTagName("body")[0].appendChild(this.div);
		this.label = addspan(this.div, option.name);
		this.select = addselect(div, option.rlist, "label", false, null);
		option.rlist.forEach((r) => {
			this.addoption(this.select, r.label);
		});
		this.select.options[0].selected = true;
		this.select.options[0].defaultSelected = true;
		this.add = addbutton(div, "+", () => {
			this.push();
		});
		this.datdiv = adddiv(this.div);
		this.div.appendChild(newelement("br"));
	}
	push(){
		this.set(this.select.selectedIndex);
	}
}
