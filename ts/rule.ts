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
	readonly def: number;

	constructor(def: number = 0){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VInteger(this, sym);
	}
}
class RPropor implements Ruleval{
	readonly def: number;

	constructor(def: number = 0){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VPropor(this, sym);
	}
}
class RFloat implements Ruleval{
	readonly def: number;

	constructor(def: number = 0){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VFloat(this, sym);
	}
}
class RString implements Ruleval{
	readonly def: string;

	constructor(def: string = ""){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VString(this, sym);
	}
}
class RObj implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VObj(this, sym);
	}
}
class RFileObj implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VFileObj(this, sym);
	}
}
class RSelect implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VSelect(this, sym);
	}
}
class Rule{
	readonly label: string;
	readonly sym: string;
	readonly val: Ruleval | null;

	constructor(label: string, sym: string, val: Ruleval | null = null){
		this.label = label;
		this.sym = sym;
		this.val = val;
	}
	putval(sym: Sym): Value{
		if(this.val === null)
			fatal("rule " + this.label + ": cannot create from null value");
		return this.val!.putval(sym);
	}
}
