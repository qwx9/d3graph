class VBoolElem{
	readonly val: VBool;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly check: HTMLInputElement;

	constructor(val: VBool){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, "=");
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
		this.span = addspan(val.sym.el.value, "=");
		this.text = addtext(this.span, this.val.val === null ? "" : this.val.val.toString(), () => {
			if(this.val.set(parseInt(this.text.value)))
				this.text.value = this.val.val!.toString();
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
		this.span = addspan(val.sym.el.value, "=");
		this.text = addtext(this.span, this.val.val === null ? "" : this.val.val.toString(), () => {
			if(this.val.set(parseFloat(this.text.value)))
				this.text.value = this.val.val!.toString();
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
		this.span = addspan(val.sym.el.value, "=");
		this.text = addtext(this.span, this.val.val === null ? "" : this.val.val.toString(), () => {
			if(this.val.set(parseFloat(this.text.value)))
				this.text.value = this.val.val!.toString();
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
		this.span = addspan(val.sym.el.value, "=");
		this.text = addtext(this.span, this.val.val === null ? "" : this.val.val.toString(), () => {
			if(this.val.set(this.text.value))
				this.text.value = this.val.val!;
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
		this.span = addspan(val.sym.el.value, "=");
		this.text = addtext(this.span, this.val.val === null ? "" : this.val.val.toString(), () => {
			if(this.val.set(this.text.value))
				this.text.value = this.val.val!;
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
		this.span = addspan(val.sym.el.value, "=");
		this.file = addfile(this.span, () => {
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

class VAnyElem{
	readonly val: VAny;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select?: HTMLSelectElement;
	selval: HTMLOptionElement[];

	constructor(val: VAny){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, this.sym.parent instanceof BppOpt ? null : "=");
		this.selval = [];
		if(val.rules.length > 0){
			this.select = addselectfn(this.span, (e) => {
				addoption(e, " -- ", true, true);
				this.val.rules.forEach((r) => {
					addoption(e, r.label);
				});
			}, () => {
				this.sel(this.select!.selectedIndex);
			});
		}
	}
	sel(i: number){
		if(this.val.set(i - 1))
			this.selval.push(this.select!.options[i]);
		this.select!.selectedIndex = 0;
	}
	popchild(i: number){
		this.selval.splice(i, 1);
	}
	pop(){
		this.span.remove();
	}
}
class VOnceElem{
	readonly val: VOnce;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select?: HTMLSelectElement;
	selval: { [name: string]: HTMLOptionElement; };

	constructor(val: VOnce){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, this.sym.parent instanceof BppOpt ? null : "=");
		this.selval = {};
		if(val.rules.length > 0){
			this.select = addselectfn(this.span, (e) => {
				addoption(e, " -- ", true, true);
				this.val.rules.forEach((r) => {
					addoption(e, r.label);
				});
			}, () => {
				this.sel(this.select!.selectedIndex);
			});
		}
	}
	sel(i: number){
		if(this.val.set(i-1)){
			this.select!.options[i].disabled = true;
			this.selval[this.val.rules[i-1].rsym] = this.select!.options[i];
		}
		this.select!.selectedIndex = 0;
	}
	popchild(rsym: string){
		this.selval[rsym].disabled = false;
		delete this.selval[rsym];
	}
	pop(){
		this.span.remove();
	}
}
class VParamElem{
	readonly val: VParam;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select?: HTMLSelectElement;
	selval: {rs:string, o:HTMLOptionElement, com:HTMLSpanElement | null}[];

	constructor(val: VParam){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.selval = [];
		if(val.rules.length > 0){
			this.select = addselectfn(this.span, (e) => {
				addoption(e, " -- ", true, true);
				this.val.rules.forEach((r) => {
					addoption(e, r.label);
				});
			}, () => {
				this.sel(this.select!.selectedIndex);
			});
		}
	}
	sel(i: number){
		let com = null;
		if(this.selval.length > 0)
			com = addspan(this.sym.el.value, ", ");
		if(this.val.set(i-1)){
			this.select!.options[i].disabled = true;
			this.selval.push({
				rs:this.val.rules[i-1].rsym,
				o:this.select!.options[i],
				com:com
			});
		}else if(com !== null)
			com.remove();
		this.select!.selectedIndex = 0;
	}
	popchild(rsym: string){
		for(let i=0; i<this.selval.length; i++){
			const {rs, o, com} = this.selval[i];
			if(rs !== rsym)
				continue;
			o.disabled = false;
			if(com !== null)
				com.remove();
			this.selval.splice(i, 1);
			break;
		}
		if(this.selval.length > 0 && this.selval[0].com !== null){
			this.selval[0].com.remove();
			this.selval[0].com = null;
		}
	}
	pop(){
		this.span.remove();
	}
}
class VOneElem{
	readonly val: VOne;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select?: HTMLSelectElement;
	selval: HTMLOptionElement | null;

	constructor(val: VOne){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, this.sym.parent instanceof BppOpt ? null : "=");
		this.selval = null;
		if(val.rules.length > 0){
			this.select = addselectfn(this.span, (e) => {
				addoption(e, " -- ", true, true);
				this.val.rules.forEach((r) => {
					addoption(e, r.label);
				});
			}, () => {
				this.sel(this.select!.selectedIndex);
			});
		}
	}
	sel(i: number){
		this.val.set(i-1);
		this.selval = this.select!.options[i];
	}
	popchild(){
		this.selval!.disabled = false;
		this.selval = null;
		this.select!.selectedIndex = 0;
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
				this.sel(this.select!.selectedIndex);
		});
	}
	sel(i: number){
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
