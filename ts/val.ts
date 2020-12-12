/* judicious use of inheritance would simplify a lot of the copypasta and
 * enforce more rules when implementing a new Value type
 */
interface Value{
	readonly sym: Sym;
	val: any;
	set(val: any): boolean;
	compile(): string;
	pop(): void;
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
class VVerbatim implements Value{
	readonly el: VVerbatimElem;
	readonly sym: Sym;
	val: string;

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
		return this.val;
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
		if(this.sym.parent instanceof BppOpt)
			fatal(this.sym.ref() + ": bug: RFile cannot be a root element");
		else if(this.val !== "")
			files[this.sym.parent.ref()] = this.el.getfile();
		return "=" + this.val;
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
	compile(){
		let s: string = "";
		this.val.forEach((v, i) => {
			s += this.sym.rule.rsym + (i+1) + "=" + v.compile() + "\n";
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
		this.el.popchild(i);
		this.val.slice(i, 1);
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
		if(this.val.hasOwnProperty(r.rsym)){
			this.val[r.rsym].pop();
			delete this.val[r.rsym];
		}
		this.val[r.rsym] = new Sym(this.sym, r);
		return true;
	}
	compile(){
		let s: string = "";
		Object.keys(this.val).forEach((k) => {
			s += this.sym.rule.rsym + "=" + this.val[k].compile() + "\n";
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
		if(this.val.hasOwnProperty(r.rsym)){
			this.val[r.rsym].pop();
			delete this.val[r.rsym];
		}
		this.val[r.rsym] = new Sym(this.sym, r);
		return true;
	}
	compile(){
		let s = "(";
		const k = Object.keys(this.val);
		for(let i=0; i<k.length; i++){
			s += this.val[k[i]].compile();
			if(i < k.length - 1)
				s += ", ";
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
		if(this.val === null)
			fatal(this.sym.ref() + ": uninitialized value");
		return "=" + this.val!.compile();
	}
	nuke(){
		if(this.val !== null)
			this.val.pop();
	}
	popchild(sym: Sym){
		if(this.val !== sym)
			fatal(this.sym.ref() + ".popchild: no such element " + sym.ref());
		this.el.popchild();
		this.val = null;
	}
	pop(){
		this.nuke();
		this.el.pop();
	}
}

class VRef implements Value{
	readonly el: VRefElem;
	readonly sym: Sym;
	readonly rule: Rule;
	readonly refidx: string;
	readonly reftab: Sym[];
	val: Sym | null;
	ref: Sym | null;

	constructor(r: RRef, sym: Sym){
		this.sym = sym;
		this.rule = r.rule;
		this.refidx = sym.rule.rsym;
		if(!reftab.hasOwnProperty(this.refidx))
			reftab[this.refidx] = [];
		this.reftab = reftab[this.refidx];
		this.val = null;
		this.ref = null;
		this.el = new VRefElem(this);
	}
	set(i: number | null){
		this.popchild();
		if(i !== null){
			if(i >= this.reftab.length)
				fatal(this.sym.ref() + ".set: index out of bounds: " + i);
			this.ref = this.reftab[i];
		}else{
			this.val = new Sym(this.sym, this.rule);
			this.reftab.push(this.val);
		}
		return true;
	}
	compile(){
		if(this.val !== null)
			return "=" + this.val.compile();
		else if(this.ref !== null){
			return "=" + this.ref.ref();
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
			this.val.pop();
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
