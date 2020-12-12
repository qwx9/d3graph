class BppOptElem{
	readonly option: BppOpt;
	readonly value: HTMLDivElement;

	constructor(option: BppOpt){
		this.option = option;
		this.value = adddiv(document.getElementById("root") as HTMLDivElement);
	}
}
