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
class VVerbatimElem{
	readonly val: VVerbatim;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;

	constructor(val: VVerbatim){
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
class VFileElem{
	readonly val: VFile;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly file: HTMLInputElement;

	constructor(val: VFile){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.file = addfile(this.sym.parent.el.value, () => {
			this.val.set(this.file.files![0].name);
		});
	}
	getfile(){
		return this.file;
	}
	pop(){
		this.span.remove();
	}
}

class VRefElem{
	readonly val: VRef;
	readonly sym: Sym;
	readonly refeltab: VRefElem[];
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;

	constructor(val: VRef){
		this.val = val;
		this.sym = val.sym;
		if(!refeltab.hasOwnProperty(val.refidx))
			refeltab[val.refidx] = [];
		this.refeltab = refeltab[val.refidx];
		this.refeltab.push(this);
		this.span = addspan(val.sym.el.value);
		this.select = addselectfn(this.span, (e) => {
			addoption(e, " -- ", true, true);
			addoption(e, " new value ");
			this.val.reftab.forEach((s) => {
				addoption(e, s!.ref());
			});
		}, () => {
			this.sel();
		});
	}
	sel(){
		const i = this.select.selectedIndex;
		if(i == 1){
			this.val.set(null);
			this.update(false);
		/* val.set calls this.popchild→this.update itself */
		}else
			this.val.set(i - 2);
	}
	update(fixidx: boolean){
		const sym = this.val.val as Sym;
		const reftab = this.val.reftab;
		for(let i=0; i<this.refeltab.length; i++){
			let e = this.refeltab[i];
			if(e !== this)
				continue;
			if(fixidx){
				for(let i=0, opi=2; i<reftab.length; i++){
					if(reftab[i] === this.val.sym){
						e.select.options[opi].remove();
						if(e.select.selectedIndex == opi){
							e.val.val = null;
							e.select.selectedIndex = 0;
						}else if(e.select.selectedIndex > opi)
							e.select.selectedIndex--;
					}else if(reftab[i] !== e.val.sym){
						const ref = e.val.sym!.ref();
						e.select.options[opi].value = ref;
						e.select.options[opi].textContent = ref;
						opi++;
					}
				}
			}else
				addoption(e.select, sym.ref());
		}
	}
	pop(){
		/* val.pop calls this.popchild→this.update itself */
		for(let i=0; i<this.refeltab.length; i++)
			if(this.refeltab[i] == this){
				this.refeltab.splice(i, 1);
				break;
			}
		this.span.remove();
	}
	popchild(){
		this.update(true);
	}
};

abstract class VMultiElem{
	readonly val: VMulti;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select!: HTMLSelectElement;
	parms: { [name: string]: HTMLOptionElement; };

	constructor(val: VMulti){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.parms = {};
		/* domvis-specific: must avoid duplicating control for root element
		 * here its value */
		if(this.sym.parent instanceof Expr)
			return this;
		if(val.rules.length > 0){
			this.select = addselectfn(this.span, (e) => {
				addoption(e, " -- ", true, true);
				this.val.rules.forEach((r) => {
					addoption(e, r.label);
				});
			}, () => {
				this.sel(this);
			});
		}
	}
	abstract sel(v: VMultiElem): void;
	seldefault(){
		const i = this.select.selectedIndex;
		if(this.val.set(i - 1)){
			this.select.options[i].disabled = true;
			this.select.selectedIndex = 0;
			if(Object.keys(this.val.parms).length > 1)
				addspanbeforelast(this.sym.el.value, ", ");
			this.parms[this.val.rules[i - 1].sym] = this.select.options[i];
		}
	}
	popchild(ref: string){
		if(this.parms.hasOwnProperty(ref)){
			this.parms[ref].disabled = false;
			const spar = this.sym.el.value;
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
class VSelectElem extends VMultiElem{
	constructor(val: VSelect){
		super(val);
	}
	sel(v: VSelectElem){
		const i = v.select.selectedIndex;
		if(v.val.set(i - 1))
			v.parms[v.val.rules[i - 1].sym] = v.select.options[i];
	}
}
/*
class VAliasElem{
}
*/
