interface Ruleval{
	readonly rules?: Rule[];
	putval(sym: Sym): Value;
}

class RBool implements Ruleval{
	readonly def: boolean;

	constructor(def: boolean = false){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VBool(this, sym);
	}
}
class RInteger implements Ruleval{
	readonly def: number | null;

	constructor(def: number | null = null){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VInteger(this, sym);
	}
}
class RPropor implements Ruleval{
	readonly def: number | null;

	constructor(def: number | null = null){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VPropor(this, sym);
	}
}
class RFloat implements Ruleval{
	readonly def: number | null;

	constructor(def: number | null = null){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VFloat(this, sym);
	}
}
class RString implements Ruleval{
	readonly def: string | null;

	constructor(def: string | null = null){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VString(this, sym);
	}
}
/*
class RVector implements Ruleval{
	readonly nelem: number;

	constructor(nelem: number = 1){
		this.nelem = nelem;
	}
	putval(sym: Sym): Value{
		return new VVector(this, sym);
	}
}
*/
class RVerbatim implements Ruleval{
	constructor(){
	}
	putval(sym: Sym): Value{
		return new VVerbatim(this, sym);
	}
}
class RFile implements Ruleval{
	constructor(){
	}
	putval(sym: Sym): Value{
		return new VFile(this, sym);
	}
}
class RAny implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VAny(this, sym);
	}
}
class ROnce implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VOnce(this, sym);
	}
}
class RParam implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VParam(this, sym);
	}
}
class ROne implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VOne(this, sym);
	}
}
class RRef implements Ruleval{
	readonly refname: string;
	readonly rule: Rule;
	readonly ref: Ref;

	constructor(refname: string, rule: Rule){
		this.refname = refname;
		this.rule = rule;
		if(!reftab.hasOwnProperty(refname))
			reftab[refname] = new Ref(refname);
		this.ref = reftab[refname];
	}
	putval(sym: Sym): Value{
		return new VRef(this, sym);
	}
}
class RAnyRef implements Ruleval{
	readonly refname: string;
	readonly rules: Rule[];
	readonly ref: Ref;

	constructor(refname: string, rules: Rule[]){
		this.refname = refname;
		this.rules = rules;
		if(!reftab.hasOwnProperty(refname))
			reftab[refname] = new Ref(refname);
		this.ref = reftab[refname];
	}
	putval(sym: Sym): Value{
		return new VAnyRef(this, sym);
	}
}
class Rule{
	readonly label: string;
	readonly rsym: string;
	readonly mandatory: boolean;
	readonly inheritname: boolean;
	readonly val: Ruleval | null;

	constructor(label: string, rsym: string, val: Ruleval | null = null, mandatory: boolean = false, inheritname: boolean = false){
		this.label = label;
		this.rsym = rsym;
		this.val = val;
		this.mandatory = mandatory;
		this.inheritname = inheritname;
	}
	putval(sym: Sym): Value{
		if(this.val === null)
			fatal("rule " + this.label + ": cannot create from null value");
		return this.val!.putval(sym);
	}
}
