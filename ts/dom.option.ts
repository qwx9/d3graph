class BppOptElem{
	readonly option: BppOpt;
	readonly div: HTMLDivElement;
	readonly value: HTMLDivElement;
	readonly label: HTMLSpanElement;
	readonly select: HTMLSelectElement;

	constructor(option: BppOpt){
		this.option = option;
		this.div = newelement("div") as HTMLDivElement;
		document.getElementById("root").appendChild(this.div);
		this.label = addspan(this.div, option.name);
		this.select = addselect(this.div, option.rlist, "label", false, null);
		if(option.rlist.length > 0){
			this.select.options[0].selected = true;
			this.select.options[0].defaultSelected = true;
			if(option.rule.val instanceof RSelect)
				addbutton(this.div, "set", () => {
					this.set();
				});
			else
				addbutton(this.div, "+", () => {
					this.push();
				});
		}
		this.value = adddiv(this.div);
	}
	push(){
		this.option.push(this.select.selectedIndex);
	}
	set(){
		this.option.set(this.select.selectedIndex);
	}
}
