

/* judicious use of inheritance would simplify a lot of the copypasta and
 * enforce more rules when implementing a new Value type.
 *
 * contorsions are sometimes required to avoid silly typescript annoyances,
 * especially for union types.
 */
interface Value{
	readonly sym: Sym;
	val: any;
	set(val: any): boolean;
	compile(pref?: string): string;
	pop(): void;
	/* .el.popchild must ALWAYS be called last, once clean up is effective
	 * otherwise sym refs will be stale AFTER element update and cannot be relied upon */
	popchild?(sym: Sym): void;
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
	val: number | null;

	constructor(r: RInteger, sym: Sym){
		this.val = r.def;
		this.sym = sym;
		this.el = new VIntegerElem(this);
	}
	set(val: number){
		this.val = Math.floor(val);
		return true;
	}
	compile(){
		if(this.val === null){
			pusherror(this.sym.ref() + ": uninitialized value", this);
			return "=(null)";
		}
		return "=" + this.val.toString();
	}
	pop(){
		this.el.pop();
	}
}
class VPropor implements Value{
	readonly el: VProporElem;
	readonly sym: Sym;
	val: number | null;

	constructor(r: RPropor, sym: Sym){
		this.val = r.def;
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
		if(this.val === null){
			pusherror(this.sym.ref() + ": uninitialized value", this);
			return "=(null)";
		}
		return "=" + this.val.toString();
	}
	pop(){
		this.el.pop();
	}
}
class VFloat implements Value{
	readonly el: VFloatElem;
	readonly sym: Sym;
	val: number | null;

	constructor(r: RFloat, sym: Sym){
		this.val = r.def;
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
		if(this.val === null){
			pusherror(this.sym.ref() + ": uninitialized value", this);
			return "=(null)";
		}
		return "=" + this.val.toString();
	}
	pop(){
		this.el.pop();
	}
}
class VString implements Value{
	readonly el: VStringElem;
	readonly sym: Sym;
	val: string | null;

	constructor(r: RString, sym: Sym){
		this.val = r.def;
		this.sym = sym;
		this.el = new VStringElem(this);
	}
	set(val: string){
		this.val = val;
		return true;
	}
	compile(){
		if(this.val === null){
			pusherror(this.sym.ref() + ": uninitialized value", this);
			return "=(null)";
		}
		return "=" + this.val;
	}
	pop(){
		this.el.pop();
	}
}
/*
class VVector implements Value{
	readonly el: VVectorElem;
	readonly sym;
	readonly dim;
	val: number[];

	constructor(r: RVector, sym: Sym){
		this.dim = r.nelem;
		this.sym = sym;
		this.val = [];
		for(let i=0; i<r.nelem; i++)
			this.val.push([]);
		this.el = new VVectorElem(this);
	}
	set(dim: number, val: number[]){
		if(dim >= this.dim)
			fatal(this.sym.ref() + ": invalid dimension " + dim + " (max " + this.dim + ")");
		this.val[dim] = val;
		return true;
	}
	compile(){
		let s = "=";
		if(this.dim > 1)
			s += "(";
		for(let i=0; i<this.dim; i++){
			if(this.val[i].length === 0){
				pusherror(this.sym.ref() + ": uninitialized vector, index " + i, this);
				return "=(null)";
			}
			if(i > 0)
				s += ",";
			s += "(" + this.val[i].toString() + ")";
		}
		if(this.dim > 1)
			s += ")";
		return s;
	}
	pop(){
		this.el.pop();
	}
}
*/
class VVerbatim implements Value{
	readonly el: VVerbatimElem;
	readonly sym: Sym;
	val: string | null;

	constructor(r: RVerbatim, sym: Sym){
		(r);
		this.val = "";
		this.sym = sym;
		this.el = new VVerbatimElem(this);
	}
	set(val: string){
		this.val = val;
		return true;
	}
	compile(){
		if(this.val === null){
			pusherror(this.sym.ref() + ": uninitialized value", this);
			return "=(null)";
		}
		return this.val;
	}
	pop(){
		this.el.pop();
	}
}
class VFile implements Value{
	readonly el: VFileElem;
	readonly sym: Sym;
	val: string | null;

	constructor(r: RFile, sym: Sym){
		(r);
		this.val = null;
		this.sym = sym;
		this.el = new VFileElem(this);
	}
	set(val: string){
		this.val = val;
		return true;
	}
	compile(){
		if(this.sym.parent instanceof BppOpt){
			fatal(this.sym.ref() + ": bug: RFile cannot be a root element");
			return "";
		}else if(this.val === null || this.val === ""){
			pusherror(this.sym.ref() + ": uninitialized value", this);
			return "=(null)";
		}
		files[this.sym.parent.ref()] = this.el.getfile();
		return "=" + this.sym.parent.ref();
	}
	pop(){
		if(this.sym.parent instanceof BppOpt)
			fatal(this.sym.ref() + ": bug: RFile cannot be a root element");
		else if(this.val !== "")
			delete files[this.sym.parent.ref()];
		this.el.pop();
	}
}

class VAny implements Value{
	readonly el: VAnyElem;
	readonly sym: Sym;
	readonly rules: Rule[];
	val: Sym[];

	constructor(r: RAny, sym: Sym){
		this.sym = sym;
		this.rules = r.rules as Rule[];
		this.val = [];
		this.el = new VAnyElem(this);
	}
	set(i: number){
		if(i >= this.rules.length)
			fatal(this.sym.ref() + ".set: index out of bounds: " + i);
		this.val.push(new Sym(this.sym, this.rules[i]));
		return true;
	}
	compile(pref: string){
		/* at least one */
		for(let i=0; i<this.rules.length; i++){
			const r = this.rules[i];
			if(r.mandatory){
				let j;
				for(j=0; j<this.val.length; j++)
					if(this.val[j].rule === r)
						break;
				if(j === this.val.length)
					pusherror(this.sym.ref() + ": undefined mandatory parameter " + r.rsym, this);
			}
		};
		pref += this.sym.rule.rsym;
		let s: string = "";
		this.val.forEach((v, i) => {
			s += pref + (i+1) + "=" + v.compile() + "\n";
		});
		return s;
	}
	index(sym: Sym){
		for(let i=0; i<this.val.length; i++)
			if(this.val[i] === sym)
				return i;
		fatal(this.sym.ref() + ": orphaned sym!");
		return -1;
	}
	nuke(){
		/* assumes .popchild will be called by element itself */
		while(this.val.length > 1)
			this.val[0].pop();
	}
	popchild(sym: Sym){
		const i = this.index(sym);
		this.val.splice(i, 1);
		this.el.popchild(i);
	}
	pop(){
		this.nuke();
		this.el.pop();
	}
}
class VOnce implements Value{
	readonly el: VOnceElem;
	readonly sym: Sym;
	readonly rules: Rule[];
	val: { [name: string]: Sym; };

	constructor(r: ROnce, sym: Sym){
		this.sym = sym;
		this.rules = r.rules as Rule[];
		this.val = {};
		this.el = new VOnceElem(this);
	}
	set(i: number){
		if(i >= this.rules.length)
			fatal(this.sym.ref() + ".set: index out of bounds: " + i);
		const r = this.rules[i];
		if(this.val.hasOwnProperty(r.rsym))
			this.val[r.rsym].pop();
		this.val[r.rsym] = new Sym(this.sym, r);
		return true;
	}
	compile(pref: string){
		const k = Object.keys(this.val);
		for(let i=0; i<this.rules.length; i++){
			const r = this.rules[i];
			if(r.mandatory){
				let j;
				for(j=0; j<k.length; j++)
					if(this.val[k[j]].rule === r)
						break;
				if(j === k.length)
					pusherror(this.sym.ref() + ": undefined mandatory parameter " + r.rsym, this);
			}
		};
		pref += this.sym.rule.rsym;
		let s: string = "";
		k.forEach((k) => {
			s += pref + this.sym.rule.rsym + "=" + this.val[k].compile() + "\n";
		});
		return s;
	}
	nuke(){
		Object.keys(this.val).forEach((k) => {
			this.val[k].pop();
		});
	}
	popchild(sym: Sym){
		const rsym = sym.rule.rsym;
		if(!this.val.hasOwnProperty(rsym))
			fatal(this.sym.ref() + ".popchild: no such element " + rsym);
		delete this.val[rsym];
		this.el.popchild(rsym);
	}
	pop(){
		this.nuke();
		this.el.pop();
	}
}
class VParam implements Value{
	readonly el: VParamElem;
	readonly sym: Sym;
	readonly rules: Rule[];
	val: { [name: string]: Sym; };

	constructor(r: RParam, sym: Sym){
		this.sym = sym;
		this.rules = r.rules as Rule[];
		this.val = {};
		this.el = new VParamElem(this);
	}
	set(i: number){
		if(i >= this.rules.length)
			fatal(this.sym.ref() + ".set: index out of bounds: " + i);
		const r = this.rules[i];
		if(this.val.hasOwnProperty(r.rsym))
			this.val[r.rsym].pop();
		this.val[r.rsym] = new Sym(this.sym, r);
		return true;
	}
	compile(){
		const k = Object.keys(this.val);
		for(let i=0; i<this.rules.length; i++){
			const r = this.rules[i];
			if(r.mandatory){
				let j;
				for(j=0; j<k.length; j++)
					if(this.val[k[j]].rule === r)
						break;
				if(j === k.length)
					pusherror(this.sym.ref() + ": undefined mandatory parameter " + r.rsym, this);
			}
		};
		let s = "(";
		for(let i=0; i<k.length; i++){
			if(i > 0)
				s += ", ";
			s += this.val[k[i]].compile();
		}
		return s + ")";
	}
	nuke(){
		Object.keys(this.val).forEach((k) => {
			this.val[k].pop();
		});
	}
	popchild(sym: Sym){
		const rsym = sym.rule.rsym;
		if(!this.val.hasOwnProperty(rsym))
			fatal(this.sym.ref() + ".popchild: no such element " + rsym);
		delete this.val[rsym];
		this.el.popchild(rsym);
	}
	pop(){
		this.nuke();
		this.el.pop();
	}
}
class VOne implements Value{
	readonly el: VOneElem;
	readonly sym: Sym;
	readonly rules: Rule[];
	val: Sym | null;

	constructor(r: ROne, sym: Sym){
		this.sym = sym;
		this.rules = r.rules as Rule[];
		this.val = null;
		this.el = new VOneElem(this);
	}
	set(i: number){
		if(i >= this.rules.length)
			fatal(this.sym.ref() + ".set: index out of bounds: " + i);
		this.nuke();
		this.val = new Sym(this.sym, this.rules[i]);
		return true;
	}
	compile(){
		if(this.val === null){
			pusherror(this.sym.ref() + ": uninitialized value", this);
			return "=(null)";
		}
		return "=" + this.val!.compile();
	}
	nuke(){
		if(this.val !== null)
			this.val.pop();
	}
	popchild(sym: Sym){
		if(this.val !== sym)
			fatal(this.sym.ref() + ".popchild: no such element " + sym.ref());
		this.val = null;
		this.el.popchild();
	}
	pop(){
		this.nuke();
		this.el.pop();
	}
}

class VRef implements Value{
	readonly el: VRefElem;
	readonly rref: RRef;
	readonly sym: Sym;
	valref: Sym | null;
	val: Sym | null;

	constructor(rref: RRef, sym: Sym){
		this.sym = sym;
		this.rref = rref;
		rref.ref.addref(this);
		this.valref = null;
		this.val = null;
		this.el = new VRefElem(this);
	}
	set(sym: Sym){
		/* FIXME: can be fooled by $
		if(sym.rule.rsym !== this.rref.ref.name)
			fatal(this.sym.ref() + ".setref: phase error: wrong reftable for sym " + sym.ref());
		*/
		/* FIXME: no, children
		const rs = this.rref.ref.syms;
		let i;
		for(i=0; i<rs.length; i++)
			if(rs[i] === sym)
				break;
		if(i === rs.length)
			fatal(this.sym.ref() + ".setref: phase error: no such sym in reftable " + sym.ref());
		*/
		this.nuke();
		this.valref = sym;
		return true;
	}
	pushval(){
		this.nuke();
		this.val = new Sym(this.sym, this.rref.rule);
		return true;
	}
	addsymref(sym: Sym){
		this.el.addsymref(sym);
	}
	removesymref(sym: Sym){
		this.el.removesymref(sym);
		this.nuke();
	}
	compile(){
		if(this.val !== null)
			/* shunt this.val.compile() to skip ref name */
			return this.val.val!.compile();
		else if(this.valref !== null)
			return "=" + this.valref.ref();
		else{
			pusherror(this.sym.ref() + ": uninitialized value", this);
			return "=(null)";
		}
	}
	nuke(){
		if(this.val !== null)
			this.val.pop();
		this.valref = null;
	}
	popchild(sym: Sym){
		this.val = null;
		this.el.popchild(sym);
	}
	pop(){
		this.nuke();
		this.el.pop();
	}
}
class VAnyRef implements Value{
	readonly el: VAnyRefElem;
	readonly rref: RAnyRef;
	readonly sym: Sym;
	readonly rules: Rule[];
	symref: Sym | null;
	/* syms depending on referenced sym */
	val: { [name: string]: Sym; };

	constructor(rref: RAnyRef, sym: Sym){
		this.sym = sym;
		this.rref = rref;
		rref.ref.addref(this);
		this.rules = rref.rules;
		this.symref = null;
		this.val = {};
		this.el = new VAnyRefElem(this);
	}
	set(sym: Sym){
		/* FIXME: can be fooled by $
		if(sym.rule.rsym !== this.rref.ref.name)
			fatal(this.sym.ref() + ".setref: phase error: wrong reftable for sym " + sym.ref());
		*/
		/* FIXME: no, children
		const rs = this.rref.ref.syms;
		let i;
		for(i=0; i<rs.length; i++)
			if(rs[i] === sym)
				break;
		if(i === rs.length)
			fatal(this.sym.ref() + ".setref: phase error: no such sym in reftable " + sym.ref());
		*/
		this.nuke();
		this.symref = sym;
		return true;
	}
	pushval(i: number){
		(i);
		/* FIXME:
		 * - embedded rules are linked to this ref
		 * - if the rule is ROnce, then there is only one such SIBLING to this ref, with a corresponding SIZE (vector)
		 * - if the rule is RAny, then there are as many such SIBLINGS as there are such REFS
		 * - for this, we need to:
		 * 	. implement pushval, pop, popchild here
		 * 	. implement them in the dom
		 * 	. allow setting these values in the dom without all these hoops
		 * 	. implement DynVector + dom
		 * 	. implement compilation of this garbage
		 * 	. sacrifice goat and pray
		 */
	}
	addsymref(sym: Sym){
		this.el.addsymref(sym);
	}
	removesymref(sym: Sym){
		this.el.removesymref(sym);
		this.nuke();
	}
	compile(){
		if(this.symref === null){
			pusherror(this.sym.ref() + ": uninitialized value", this);
			return "=(null)";
		}
		let s = "=";
		s += (((this.symref.parent as Sym).val as VAny).index(this.symref) + 1);
		/* FIXME: compilation of linked rules, see above */
		return s;
	}
	nuke(){
		/* FIXME: nuke semantics for subrules */
		this.val = {};
		this.symref = null;
	}
	popchild(sym: Sym){
		/* FIXME: popchild semantics for subrules */
		this.el.popchild(sym);
	}
	pop(){
		this.nuke();
		this.el.pop();
	}
}
