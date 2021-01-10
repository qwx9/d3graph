/* BppOpt node, associated DOM element */
class BppOptElem{
	readonly option: BppOpt;	/* parent BppOpt node */
	readonly value: HTMLDivElement;	/* container div for child elements */

	constructor(option: BppOpt){
		/* save BppOpt pointer and create a new div container */
		this.option = option;
		this.value = adddiv(document.getElementById("root") as HTMLDivElement);
	}
}
