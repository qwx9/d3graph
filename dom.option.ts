class OptionElem{
	readonly option: Option;
	readonly DDiv;
	readonly DLabel;
	readonly DSelect;
	readonly DButton;
	readonly curfn: (() => void) | null;
	cur: number;

	constructor(option: Option, curfn: (() => void) | null){
		this.option = option;
		this.curfn = curfn;
		/* FIXME
		this.rules.forEach((v) => {
			this.addoption(v.label);
		});
		*/
	}
}
