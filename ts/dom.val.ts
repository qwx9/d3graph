class VBoolElem{
	readonly val: VBool;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly check: HTMLInputElement;

	contructor(sym: Sym){
		this.val = sym.val as VBool;
		this.sym = sym;
		this.span = addspan(sym.value, "span");
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

	contructor(sym: Sym){
		this.val = sym.val as VInteger;
		this.sym = sym;
		this.span = addspan(sym.value, "span");
		this.text = addtext(this.span, this.val.val, () => {
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

	contructor(sym: Sym){
		this.val = sym.val as VPropor;
		this.sym = sym;
		this.span = addspan(sym.value, "span");
		this.text = addtext(this.span, this.val.val, () => {
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

	contructor(sym: Sym){
		this.val = sym.val as VFloat;
		this.sym = sym;
		this.span = addspan(sym.value, "span");
		this.text = addtext(this.span, this.val.val, () => {
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

	contructor(sym: Sym){
		this.val = sym.val as VString;
		this.sym = sym;
		this.span = addspan(sym.value, "span");
		this.text = addtext(this.span, this.val.val, () => {
			if(this.val.set(this.text.value))
				this.text.value = this.val.val;
		});
	}
	pop(){
		this.span.remove();
	}
}
class VObjElem{
	readonly val: VObj;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	commas: { [name: string]: HTMLSpanElement; };

	contructor(sym: Sym){
		this.val = sym.val as VObj;
		this.sym = sym;
		this.span = addspan(sym.value, "span");
		this.commas = [];
		this.select = addselectfn(this.span, this.val.parms, (e) => {
			addoption(e, " -- ", true, true);
			for(let k in this.val.parms)
				addoption(e, this.val.parms[k].rule.sym);
		}, () => {
			if(this.val.set(this.select.selectedIndex - 1)){
				this.select.selectedOptions[0].disabled = true;
				this.select.selectedIndex = 0;
			}
			if(objlength(this.val.parms) > 1)
				this.commas[sym.rule.sym] = addspan(this.span, ", ");
		});
	}
	popchild(ref: string){
		if(ref in this.commas){
			this.commas[ref].remove();
			delete commas[ref];
		}
	}
	pop(){
		this.span.remove();
	}
}
class VFileObjElem{
	readonly val: VObj;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	commas: { [name: string]: HTMLSpanElement; };

	contructor(sym: Sym){
		this.val = sym.val as VObj;
		this.sym = sym;
		this.span = addspan(sym.value, "span");
		this.commas = [];
		this.select = addselectfn(this.span, this.val.parms, (e) => {
			addoption(e, " -- ", true, true);
			for(let k in this.val.parms)
				addoption(e, this.val.parms[k].rule.sym);
		}, () => {
			if(this.val.set(this.select.selectedIndex - 1)){
				this.select.selectedOptions[0].disabled = true;
				this.select.selectedIndex = 0;
			}
			if(objlength(this.val.parms) > 1)
				this.commas[sym.rule.sym] = addspan(this.span, ", ");
		});
	}
	popchild(ref: string){
		if(ref in this.commas){
			this.commas[ref].remove();
			delete commas[ref];
		}
	}
	pop(){
		this.span.remove();
	}
}
class VAliasElem{

}
