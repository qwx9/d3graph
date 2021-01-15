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
class VPercentElem{
	readonly val: VPercent;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly text: HTMLInputElement;

	constructor(val: VPercent){
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
/*
class VVectorElem{
	readonly val: VVector;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	text: HTMLInputElement[];

	constructor(val: VVector){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value, val.dim > 1 ? "=(" : "=");
		this.text = [];
		for(let i=0; i<val.dim; i++){
			this.text[i] = addtext(this.span, "", () => {
				let a = [];
				if(this.text.value !== ""){
					a = this.text.value.split(",").map(x => parseInt(x, 10));
					for(let k=0; k<a.length; k++)
						if(isNaN(a[k])){
							const s = this.text[i].value;
							this.text[i].value = "";
							this.val[i] = [];
							fatal(this.sym.ref() + ": invalid number string: " + s);
						}
				}
				if(this.val.set(i, a))
					this.text[i].value = this.val[i].toString();
			});		
		}
		if(val.dim > 1)
			addspan(val.sym.el.value, ")");
	}
	pop(){
		this.span.remove();
	}
}
*/
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
	readonly ref: Ref;
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	opts: {s:Sym, o:HTMLOptionElement}[];

	constructor(val: VRef){
		this.val = val;
		this.sym = val.sym;
		this.ref = val.rref.ref;
		this.span = addspan(val.sym.el.value);
		this.opts = [];
		this.select = addselectfn(this.span, (e) => {
			addoption(e, " -- ", true, true);
			addoption(e, " new value ");
			this.val.rref.ref.syms.forEach((s) => {
				if(s !== this.sym){
					const o = addoption(e, s.ref());
					this.opts.push({s:s, o:o});
				}
			});
		}, () => {
			this.sel(this.select.selectedIndex);
		});
	}
	sel(i: number){
		if(i == 0)
			this.val.nuke();
		else if(i == 1)
			this.val.pushval();
		else
			this.val.set(this.opts[i-2].s);
	}
	addsymref(sym: Sym){
		const o = addoption(this.select, sym.ref());
		this.opts.push({s:sym, o:o});
	}
	removesymref(sym: Sym){
		let i;
		for(i=0; i<this.opts.length; i++)
			if(this.opts[i].s == sym)
				break;
		if(i === this.opts.length)
			fatal(this.sym.ref() + ".removesymref: phase error: remove sym not found");
		this.opts[i].o.remove();
		this.opts.splice(i, 1);
		const s = this.select;
		if(s.selectedIndex === i){
			this.val.nuke();
			s.selectedIndex = 0;
		}else if(s.selectedIndex > i)
			s.selectedIndex--;
		this.opts.forEach((o) => {
			const sref = o.s.ref();
			o.o.textContent = sref;
			o.o.value = sref;
		});
	}
	popchild(sym: Sym){
		(sym);
	}
	pop(){
		this.span.remove();
	}
};
class VAnyRefElem{
	readonly val: VAnyRef;
	readonly sym: Sym;
	readonly span: HTMLSpanElement;
	readonly select: HTMLSelectElement;
	opts: {s:Sym, o:HTMLOptionElement}[];

	constructor(val: VAnyRef){
		this.val = val;
		this.sym = val.sym;
		this.span = addspan(val.sym.el.value);
		this.opts = [];
		this.select = addselectfn(this.span, (e) => {
			addoption(e, " -- ", true, true);
			this.val.rref.ref.syms.forEach((s) => {
				if(s !== this.sym){
					const o = addoption(e, s.ref());
					this.opts.push({s:s, o:o});
				}
			});
		}, () => {
			this.sel(this.select.selectedIndex);
		});
	}
	sel(i: number){
		this.val.set(this.opts[i-1].s);
	}
	addsymref(sym: Sym){
		const o = addoption(this.select, sym.ref());
		this.opts.push({s:sym, o:o});
	}
	removesymref(sym: Sym){
		let i;
		for(i=0; i<this.opts.length; i++)
			if(this.opts[i].s == sym)
				break;
		if(i === this.opts.length)
			fatal(this.sym.ref() + ".removesymref: phase error: remove sym not found");
		this.opts[i].o.remove();
		this.opts.splice(i, 1);
		const s = this.select;
		if(s.selectedIndex === i){
			this.val.nuke();
			s.selectedIndex = 0;
		}else if(s.selectedIndex > i)
			s.selectedIndex--;
		this.opts.forEach((o) => {
			const sref = o.s.ref();
			o.o.textContent = sref;
			o.o.value = sref;
		});
	}
	popchild(sym: Sym){
		(sym);
	}
	pop(){
		this.span.remove();
	}
}
