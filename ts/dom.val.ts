class VBoolElem{
	readonly val: VBool;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly check: HTMLInputElement;

	constructor(val: VBool){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.check = addcheckbox(this.span, this.val.val, () => {
			this.val.set(this.check.checked);
		});
	}
	pop(){
		this.span.remove();
	}
}
class VIntegerElem{
	readonly val: VInteger;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;

	constructor(val: VInteger){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.text = addtext(this.span, this.val.val.toString(), () => {
			if(this.val.set(parseInt(this.text.value)))
				this.text.value = this.val.val.toString();
		});
	}
	pop(){
		this.span.remove();
	}
}
class VProporElem{
	readonly val: VPropor;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;

	constructor(val: VPropor){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.text = addtext(this.span, this.val.val.toString(), () => {
			if(this.val.set(parseFloat(this.text.value)))
				this.text.value = this.val.val.toString();
		});
	}
	pop(){
		this.span.remove();
	}
}
class VFloatElem{
	readonly val: VFloat;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;

	constructor(val: VFloat){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.text = addtext(this.span, this.val.val.toString(), () => {
			if(this.val.set(parseFloat(this.text.value)))
				this.text.value = this.val.val.toString();
		});
	}
	pop(){
		this.span.remove();
	}
}
class VStringElem{
	readonly val: VString;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;

	constructor(val: VString){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.text = addtext(this.span, this.val.val.toString(), () => {
			if(this.val.set(this.text.value))
				this.text.value = this.val.val;
		});
	}
	pop(){
		this.span.remove();
	}
}

abstract class VMultiElem{
	readonly val: VMulti;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	parms: { [name: string]: HTMLOptionElement; };

	constructor(val: VMulti){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.parms = {};
		if(val.rules.length > 0){
			this.select = addselectfn(this.span, (e) => {
				addoption(e, " -- ", true, true);
				this.val.rules.forEach((r) => {
					addoption(e, r.sym);
				});
			}, () => {
				this.sel(this);
			});
		}
	}
	abstract sel(VMultiElem): void;
	seldefault(){
		const i = this.select.selectedIndex;
		if(this.val.set(i - 1)){
			this.select.options[i].disabled = true;
			this.select.selectedIndex = 0;
			if(Object.keys(this.val.parms).length > 1)
				addspanbeforelast(this.val.sym.el.value, ", ");
			this.parms[this.val.rules[i - 1].sym] = this.select.options[i];
		}
	}
	popchild(ref: string){
		if(this.parms.hasOwnProperty(ref)){
			this.parms[ref].disabled = false;
			const spar = this.val.sym.el.value;
			let s = spar.children[spar.childElementCount-1];
			if(s.textContent === ", ")
				s.remove();
			s = spar.children[0];
			if(s.textContent === ", ")
				s.remove();
			delete this.parms[ref];
		}
	}
	pop(){
		this.span.remove();
	}
};
class VObjElem extends VMultiElem{
	constructor(val: VObj){
		super(val);
	}
	sel(v: VObjElem){
		v.seldefault();
	}
}
class VFileObjElem extends VMultiElem{
	constructor(val: VFileObj){
		super(val);
	}
	sel(v: VFileObjElem){
		this.seldefault();
	}
}
class VSelectElem extends VMultiElem{
	constructor(val: VSelect){
		super(val);
	}
	sel(v: VSelectElem){
		const i = this.select.selectedIndex;
		if(this.val.set(i - 1))
			this.parms[this.val.rules[i - 1].sym] = this.select.options[i];
	}
}
/*
class VAliasElem{
}
*/
