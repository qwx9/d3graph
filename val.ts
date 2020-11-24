type VType = VFileObj | VObj | VString | VFloat | VPropor | VInteger | VBool | VAlias;

class VBool{
	readonly el: VBoolElem;
	readonly sym: Sym;
	val: bool;

	constructor(r: RBool){
		this.val = r.default;
		this.el = new VBoolElem(this);
	}
	set(val: bool): bool{
		this.val = val;
		this.el.redraw();
		return true;
	}
	pop(){
		this.el.pop();
	}
}
class VInteger{
	readonly el: VIntegerElem;
	readonly sym: Sym;
	val: number;

	constructor(r: RInteger, sym: Sym){
		this.val = r.default;
		this.sym = sym;
		this.el = new VIntegerElem(this);
	}
	set(val: number): bool{
		this.val = Math.floor(val);
		this.el.redraw();
		return true;
	}
	pop(){
		this.el.pop();
	}
}
class VPropor{
	readonly el: VProporElem;
	readonly sym: Sym;
	val: number;

	constructor(r: RPropor, sym: Sym){
		this.val = r.default;
		this.sym = sym;
		this.el = new VProporElem(this);
	}
	set(val: number): bool{
		if(val <= 0 || val >= 1)
			return false;
		this.val = val;
		this.el.redraw();
		return true;
	}
	pop(){
		this.el.pop();
	}
}
class VFloat{
	readonly el: VFloatElem;
	readonly sym: Sym;
	val: number;

	constructor(r: RFloat, sym: Sym){
		this.val = r.default;
		this.sym = sym;
		this.el = new VFloatElem(this);
	}
	set(val: number): bool{
		this.val = val;
		this.el.redraw();
		return true;
	}
	pop(){
		this.el.pop();
	}
}
class VString{
	readonly el: VStringElem;
	readonly sym: Sym;
	val: string;

	constructor(r: RString, sym: Sym){
		this.val = r.default;
		this.sym = sym;
		this.el = new VStringElem(this);
	}
	set(val: string): bool{
		this.val = val;
		this.el.redraw();
		return true;
	}
	pop(){
		this.el.pop();
	}
}
class VObj{
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
	set(sym: Sym, i: number){
		if(i >= this.robj.rule.length)
			fatal("this.sym.ref() + ".set: index out of bounds: " + i);
		const parm = this.robj.rule[i];
		const sym = parm.sym;
		if(sym in this.parms){
			this.parms[sym].pop();
			delete this.parms[sym];
		}
		this.parms[sym] = new Sym(this.sym, parm, this.popchild);
		this.el.redraw();
	}
	pop(){
		this.parms.forEach((p) => {
			p.pop();
		});
		this.el.pop();
	}
	function popchild(sym: Sym){
		const ssym = sym.rule.sym;
		if(!(ssym in this.parms))
			fatal("this.sym.ref() + ".pop: no such param " + ssym);
		this.parms[ssym].pop();
		delete this.parms[ssym];
		this.el.redraw();
	}
}
class VFileObj{
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
	set(sym: Sym, i: number){
		if(i >= this.robj.rule.length)
			fatal("this.sym.ref() + ".set: index out of bounds: " + i);
		const parm = this.rfobj.rule[i];
		const sym = parm.sym;
		if(sym in this.parms){
			this.parms[sym].pop();
			delete this.parms[sym];
		}
		this.parms[sym] = new Sym(this.sym, parm, this.popchild);
		this.el.redraw();
	}
	pop(){
		this.parms.forEach((p) => {
			p.pop();
		});
		this.el.pop();
	}
	function popchild(sym: Sym){
		const ssym = sym.rule.sym;
		if(!(ssym in this.parms))
			fatal("this.sym.ref() + ".pop: no such param " + ssym);
		delete this.parms[ssym];
		this.el.redraw();
	}
}
class VAlias{
/*
	readonly el: VAliasElem;
	readonly sym: Sym;

	constructor(..., sym: Sym){
		...
		this.sym = sym;
		this.el = new VAliasElem(this);
	}
	set(){
		...
	}
	pop(){
		...
	}
*/
}
