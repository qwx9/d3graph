interface Value{
	readonly sym: Sym;
	set(val: any): boolean;
	compile(): string;
	pop(): void;
}

class VBool implements Value{
	readonly el: VBoolElem;
	readonly sym: Sym;
	val: boolean;

	constructor(r: RBool, sym: Sym){
		this.sym = sym;
		this.val = false;
		this.set(r.def);
		this.el = new VBoolElem(this);
	}
	set(val: boolean){
		this.val = val;
		return true;
	}
	compile(){
		return "=" + this.val.toString();
	}
	pop(){
		this.el.pop();
	}
}
class VInteger implements Value{
	readonly el: VIntegerElem;
	readonly sym: Sym;
	val: number;

	constructor(r: RInteger, sym: Sym){
		this.val = 0;
		this.set(r.def);
		this.sym = sym;
		this.el = new VIntegerElem(this);
	}
	set(val: number){
		this.val = Math.floor(val);
		return true;
	}
	compile(){
		return "=" + this.val.toString();
	}
	pop(){
		this.el.pop();
	}
}
class VPropor implements Value{
	readonly el: VProporElem;
	readonly sym: Sym;
	val: number;

	constructor(r: RPropor, sym: Sym){
		this.val = 0;
		this.set(r.def);
		this.sym = sym;
		this.el = new VProporElem(this);
	}
	set(val: number){
		if(isNaN(val) || val <= 0 || val >= 1)
			return false;
		this.val = val;
		return true;
	}
	compile(){
		return "=" + this.val.toString();
	}
	pop(){
		this.el.pop();
	}
}
class VFloat implements Value{
	readonly el: VFloatElem;
	readonly sym: Sym;
	val: number;

	constructor(r: RFloat, sym: Sym){
		this.val = 0;
		this.set(r.def);
		this.sym = sym;
		this.el = new VFloatElem(this);
	}
	set(val: number){
		if(isNaN(val))
			return false;
		this.val = val;
		return true;
	}
	compile(){
		return "=" + this.val.toString();
	}
	pop(){
		this.el.pop();
	}
}
class VString implements Value{
	readonly el: VStringElem;
	readonly sym: Sym;
	val: string;

	constructor(r: RString, sym: Sym){
		this.val = "";
		this.set(r.def);
		this.sym = sym;
		this.el = new VStringElem(this);
	}
	set(val: string){
		this.val = val;
		return true;
	}
	compile(){
		return "=" + this.val;
	}
	pop(){
		this.el.pop();
	}
}
class VFile implements Value{
	readonly el: VFileElem;
	readonly sym: Sym;
	val: string;

	constructor(r: RFile, sym: Sym){
		(r);
		this.val = "";
		this.sym = sym;
		this.el = new VFileElem(this);
	}
	set(val: string){
		this.val = val;
		return true;
	}
	compile(){
		if(this.val !== "")
			files[this.sym.parent.ref()] = this.el.getfile();
		return "=" + this.val;
	}
	pop(){
		if(this.val !== "")
			delete files[this.sym.parent.ref()];
		this.el.pop();
	}
}
class VRef implements Value{
	readonly el: VRefElem;
	readonly sym: Sym;
	readonly rule: Rule;
	readonly refidx: string;
	readonly reftab: Sym[];
	readonly short: boolean;
	val: Sym | null;
	ref: Sym | null;

	constructor(r: RRef, sym: Sym){
		this.sym = sym;
		this.rule = r.rule;
		this.refidx = sym.rule.sym;
		if(!reftab.hasOwnProperty(this.refidx))
			reftab[this.refidx] = [];
		this.reftab = reftab[this.refidx];
		this.short = r.short;
		this.val = null;
		this.ref = null;
		this.el = new VRefElem(this);
	}
	set(val: number | null){
		this.popchild();
		if(val !== null){
			if(val >= this.reftab.length)
				fatal(this.sym.ref() + ".set: index out of bounds: " + val);
			this.ref = this.reftab[val];
		}else{
			this.val = new Sym(this.sym, this.rule, this);
			this.reftab.push(this.val as Sym);
		}
		return true;
	}
	compile(){
		if(this.val !== null)
			return "=" + this.val.compile();
		else if(this.ref !== null){
			if(this.short)
				return "=" + this.ref!.rootid();
			else
				return "=" + this.ref!.ref();
		}else{
			fatal(this.sym.ref() + ": null value");
			return "";
		}
	}
	pop(){
		this.popchild();
		this.el.pop();
	}
	popchild(){
		if(this.val !== null){
			this.val!.pop();
			for(let i=0; i<this.reftab.length; i++)
				if(this.reftab[i] == this.sym){
					this.reftab.splice(i, 1);
					break;
				}
			this.el.popchild();
		}
		this.val = null;
		this.ref = null;
	}
}

abstract class VMulti implements Value{
	readonly el!: VMultiElem;
	readonly sym: Sym;
	readonly rules: Rule[];
	parms: { [name: string]: Sym; };

	constructor(r: Ruleval, sym: Sym){
		this.sym = sym;
		this.rules = r.rules as Rule[];
		this.parms = {};
	}
	compile(): string{
		const k = Object.keys(this.parms);
		/* FIXME: kludge */
		if(this instanceof VSelect || this.sym.parent instanceof Expr){
			if(k.length > 1)
				fatal(this.sym.ref() + ": select instanciated with multiple values");
			return k.length == 0 ? "" : "=" + this.parms[k[0]].compile();
		}
		let s = "(";
		for(let i=0; i<k.length; i++){
			s += this.parms[k[i]].compile();
			if(i < k.length - 1)
				s += ", ";
		}
		return s + ")";
	}
	set(i: number){
		if(i >= this.rules.length)
			fatal(this.sym.ref() + ".set: index out of bounds: " + i);
		const parm = this.rules[i];
		const sym = parm.sym;
		if(this.parms.hasOwnProperty(sym)){
			this.parms[sym].pop();
			delete this.parms[sym];
		}
		this.parms[sym] = new Sym(this.sym, parm, this);
		return true;
	}
	nuke(){
		for(let k in this.parms)
			this.parms[k].pop();
	}
	pop(){
		this.nuke();
		this.el.pop();
	}
	popchild(sym: Sym){
		const ssym = sym.rule.sym;
		if(!this.parms.hasOwnProperty(ssym))
			fatal(this.sym.ref() + ".pop: no such param " + ssym);
		delete this.parms[ssym];
		this.el.popchild(ssym);
	}
}
class VObj extends VMulti{
	readonly el: VObjElem;

	constructor(r: RObj, sym: Sym){
		super(r, sym);
		this.el = new VObjElem(this);
	}
}
type VParentNode = VObj | VRef;

class VSelect extends VMulti{
	readonly el: VSelectElem;

	constructor(r: RSelect, sym: Sym){
		super(r, sym);
		this.el = new VSelectElem(this);
	}
	set(i: number){
		this.nuke();
		return super.set(i);
	}
}
/*
class VAlias implements Value{
}
*/
