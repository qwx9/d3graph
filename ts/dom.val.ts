class VBoolElem{
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly check: HTMLInputElement;
	val: VBool;

	constructor(val: Value){
		this.val = val.sym.val as VBool;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, "span");
		this.check = addcheckbox(this.span, this.val.val, () => {
			this.val.set(this.check.checked);
		});
	}
	pop(){
		this.span.remove();
	}
}
class VIntegerElem{
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;
	val: VInteger;

	constructor(val: Value){
		this.val = val.sym.val as VInteger;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, "span");
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
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;
	val: VPropor;

	constructor(val: Value){
		this.val = val.sym.val as VPropor;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, "span");
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
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;
	val: VFloat;

	constructor(val: Value){
		this.val = val.sym.val as VFloat;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, "span");
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
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;
	val: VString;

	constructor(val: Value){
		this.val = val.sym.val as VString;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, "span");
		this.text = addtext(this.span, this.val.val.toString(), () => {
			if(this.val.set(this.text.value))
				this.text.value = this.val.val;
		});
	}
	pop(){
		this.span.remove();
	}
}
class VObjElem{
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	commas: { [name: string]: HTMLSpanElement; };
	val: VObj;

	constructor(val: Value){
		this.val = val.sym.val as VObj;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, "span");
		this.commas = {};
		this.select = addselectfn(this.span, (e) => {
			addoption(e, " -- ", true, true);
			for(let k in this.val.parms)
				addoption(e, this.val.parms[k].rule.sym);
		}, () => {
			if(this.val.set(this.select.selectedIndex - 1)){
				this.select.options[0].disabled = true;
				this.select.selectedIndex = 0;
			}
			if(Object.keys(this.val.parms).length > 1)
				this.commas[this.sym.rule.sym] = addspan(this.span, ", ");
		});
	}
	popchild(ref: string){
		if(ref in this.commas){
			this.commas[ref].remove();
			delete this.commas[ref];
		}
	}
	pop(){
		this.span.remove();
	}
}
class VFileObjElem{
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	commas: { [name: string]: HTMLSpanElement; };
	val: VObj;

	constructor(val: Value){
		this.val = val.sym.val as VObj;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, "span");
		this.commas = {};
		this.select = addselectfn(this.span, (e) => {
			addoption(e, " -- ", true, true);
			for(let k in this.val.parms)
				addoption(e, this.val.parms[k].rule.sym);
		}, () => {
			if(this.val.set(this.select.selectedIndex - 1)){
				this.select.options[0].disabled = true;
				this.select.selectedIndex = 0;
			}
			if(Object.keys(this.val.parms).length > 1)
				this.commas[this.sym.rule.sym] = addspan(this.span, ", ");
		});
	}
	popchild(ref: string){
		if(ref in this.commas){
			this.commas[ref].remove();
			delete this.commas[ref];
		}
	}
	pop(){
		this.span.remove();
	}
}
/*
class VAliasElem{
}
*/
