class VBoolElem{
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly check: HTMLInputElement;
	val: VBool;

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
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;
	val: VInteger;

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
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;
	val: VPropor;

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
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;
	val: VFloat;

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
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;
	val: VString;

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
class VObjElem{
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	parms: { [name: string]: HTMLOptionElement; };
	val: VObj;

	constructor(val: VObj){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.parms = {};
		if(val.robj.rules.length > 0){
			this.select = addselectfn(this.span, (e) => {
				addoption(e, " -- ", true, true);
				this.val.robj.rules.forEach((r) => {
					addoption(e, r.sym);
				});
			}, () => {
				const i = this.select.selectedIndex;
				if(this.val.set(i - 1)){
					this.select.options[i].disabled = true;
					this.select.selectedIndex = 0;
					if(Object.keys(this.val.parms).length > 1)
						addspanbeforelast(val.sym.el.value, ", ");
					this.parms[this.val.robj.rules[i - 1].sym] = this.select.options[i];
				}
			});
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
}
class VFileObjElem{
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	parms: { [name: string]: HTMLOptionElement; };
	val: VFileObj;

	constructor(val: VFileObj){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.parms = {};
		if(val.rfobj.rules.length > 0){
			this.select = addselectfn(this.span, (e) => {
				addoption(e, " -- ", true, true);
				this.val.rfobj.rules.forEach((r) => {
					addoption(e, r.sym);
				});
			}, () => {
				const i = this.select.selectedIndex;
				if(this.val.set(i - 1)){
					this.select.options[i].disabled = true;
					this.select.selectedIndex = 0;
					if(Object.keys(this.val.parms).length > 1)
						addspanbeforelast(val.sym.el.value, ", ");
					this.parms[this.val.rfobj.rules[i - 1].sym] = this.select.options[i];
				}
			});
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
}
/*
class VAliasElem{
}
*/
