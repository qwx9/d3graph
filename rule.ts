type RType = RSelect | RList | RFileObj | RObj | RString | RFloat | RPropor | RInteger | RBool;

class RBool{
	readonly default: bool;

	constructor(default: bool = false){
		this.default = default;
	}
	new(sym: Sym){
		return new VBool(this, sym);
	}
}
class RInteger{
	readonly default: number;

	constructor(default: number = 0){
		this.default = default;
	}
	new(sym: Sym){
		return new VInteger(this, sym);
	}
}
class RPropor{
	readonly default: number;

	constructor(default: number = 0){
		this.default = default;
	}
	new(sym: Sym){
		return new VPropor(this, sym);
	}
}
class RFloat{
	readonly default: number;

	constructor(default: number = 0){
		this.default = default;
	}
	new(sym: Sym){
		return new VFloat(this, sym);
	}
}
class RString{
	readonly default: string;

	constructor(default: string = ""){
		this.default = default;
	}
	new(sym: Sym){
		return new VString(this, sym);
	}
}
class RObj{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	new(sym: Sym){
		return new VObj(this, sym);
	}
}
class RFileObj{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	new(sym: Sym){
		return new VFileObj(this, sym);
	}
}
class RList{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
}
class RSelect{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
}
class Rule{
	label: string;
	sym: string;
	val: RType | null;

	constructor(label: string, sym: string, val: RType | null = null){
		this.label = label;
		this.sym = sym;
		this.val = val;
	}
	new(): VType {
		if(this.val === null)
			fatal("rule " + this.label + ": cannot create from null value");
		return this!.val.new();
	}
}
