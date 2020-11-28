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
		(sym);
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
class VObj implements Value{
	readonly el: VObjElem;
	readonly sym: Sym;
	readonly robj: RObj;
	parms: { [name: string]: Sym; };

	constructor(r: RObj, sym: Sym){
		this.sym = sym;
		this.robj = (sym.rule.val as RObj);
		this.parms = {};
		this.el = new VObjElem(this);
	}
	set(i: number){
		if(i >= this.robj.rules.length)
			fatal(this.sym.ref() + ".set: index out of bounds: " + i);
		const parm = this.robj.rules[i];
		const sym = parm.sym;
		if(this.parms.hasOwnProperty(sym)){
			this.parms[sym].pop();
			delete this.parms[sym];
		}
		this.parms[sym] = new Sym(this.sym, parm, this);
		return true;
	}
	compile(){
		let s = "(";
		const k = Object.keys(this.parms);
		for(let i = 0; i<k.length; i++){
			s += this.parms[k[i]].compile();
			if(i < k.length - 1)
				s += ", ";
		}
		return s + ")";
	}
	pop(){
		for(let k in this.parms){
			this.parms[k].pop();
		}
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
class VFileObj implements Value{
	readonly el: VFileObjElem;
	readonly sym: Sym;
	readonly rfobj: RFileObj;
	parms: { [name: string]: Sym; };

	constructor(r: RFileObj, sym: Sym){
		this.sym = sym;
		this.rfobj = (sym.rule.val as RFileObj);
		this.parms = {};
		this.el = new VFileObjElem(this);
	}
	set(i: number){
		if(i >= this.rfobj.rules.length)
			fatal(this.sym.ref() + ".set: index out of bounds: " + i);
		const parm = this.rfobj.rules[i];
		const sym = parm.sym;
		if(this.parms.hasOwnProperty(sym)){
			this.parms[sym].pop();
			delete this.parms[sym];
		}
		this.parms[sym] = new Sym(this.sym, parm, this);
		return true;
	}
	compile(){
		let s = "(";
		const k = Object.keys(this.parms);
		for(let i = 0; i<k.length; i++){
			s += this.parms[k[i]].compile();
			if(i < k.length - 1)
				s += ", ";
		}
		return s + ")";
	}
	pop(){
		for(let k in this.parms){
			this.parms[k].pop();
		}
		this.el.pop();
	}
	popchild(sym: Sym){
		const ssym = sym.rule.sym;
		this.el.popchild(ssym);
		if(!this.parms.hasOwnProperty(ssym))
			fatal(this.sym.ref() + ".pop: no such param " + ssym);
		delete this.parms[ssym];
	}
}
/*
class VAlias implements Value{
}
*/
