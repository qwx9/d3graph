class BppOptElem{
	readonly option: BppOpt;
	readonly div: HTMLDivElement;
	readonly datdiv: HTMLDivElement;
	readonly label: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	readonly add: HTMLButtonElement;

	constructor(option: BppOpt){
		this.option = option;
		this.div = newelement("div") as HTMLDivElement;
		document.getElementsByTagName("body")[0].appendChild(this.div);
		this.label = addspan(this.div, option.name);
		this.select = addselect(this.div, option.rlist, "label", false, null);
		option.rlist.forEach((r) => {
			addoption(this.select, r.label);
		});
		this.select.options[0].selected = true;
		this.select.options[0].defaultSelected = true;
		this.add = addbutton(this.div, "+", () => {
			this.push();
		});
		this.datdiv = adddiv(this.div);
		this.div.appendChild(newelement("br"));
	}
	push(){
		this.option.set(this.select.selectedIndex);
	}
}
