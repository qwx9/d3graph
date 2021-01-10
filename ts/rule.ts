/* ruleset classes: specification tree for each type of expression (option).
 * these classes implement the types of rule nodes, specifying what type of
 * values an expression can be built off. they may store default values for
 * primitive types, or arrays of other rules for functions, or references,
 * in which case a pointer to a ref table is stored. the rule trees are
 * intended to be read-only and set at start up. ui-wise, the rules specify
 * the possible options for each expression. for instance:
 *
 *	key = {value1|value2}
 * 
 * will be specified by a top rule *key* allowing multiple exclusive options,
 * and its value is an array of rules of a certain type, like integers.
 * rules store attributes such as labels.
 * 
 * through user interaction, a rule may be "instanciated" by spawning a
 * symbol (Sym) from it in a separate mutable graph, a symbol tree.
 *
 * rather than complexifying code with more and more exceptions, it is
 * simpler to just define more types, though this results in some copypasta
 * and swells up the code more and more, and increases complexity in rule
 * specification instead. */

/* common interface for all rule values, partly to comply with typescript
 * behavior. Value types corresponding to each rule type use their
 * attributes during instanciation, for instance to set default value,
 * or to set rules[], an array of subrules to implement arrays, and lists
 * of certain types. putval instanciates a value subrule; it requires a
 * pointer to its associated Sym and returns the instanciated Value. */
interface Ruleval{
	readonly rules?: Rule[];
	putval(sym: Sym): Value;
}

/* primitive types. */
/* booleans, with mandatory default value. */
class RBool implements Ruleval{
	readonly def: boolean;

	constructor(def: boolean = false){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VBool(this, sym);
	}
}
/* integers, with optional default value. */
class RInteger implements Ruleval{
	readonly def: number | null;

	constructor(def: number | null = null){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VInteger(this, sym);
	}
}
/* floats of range [0,1], with optional default value. */
class RPropor implements Ruleval{
	readonly def: number | null;

	constructor(def: number | null = null){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VPropor(this, sym);
	}
}
/* floats, with optional default value. */
class RFloat implements Ruleval{
	readonly def: number | null;

	constructor(def: number | null = null){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VFloat(this, sym);
	}
}
/* strings, with optional default value. */
class RString implements Ruleval{
	readonly def: string | null;

	constructor(def: string | null = null){
		this.def = def;
	}
	putval(sym: Sym): Value{
		return new VString(this, sym);
	}
}

/* complex types. */
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
/* verbatim strings: free-form text directly injected into compiled
 * text. used for arbitrary parameters. */
class RVerbatim implements Ruleval{
	constructor(){
	}
	putval(sym: Sym): Value{
		return new VVerbatim(this, sym);
	}
}
/* files: used to select a single file on the filesystem. */
class RFile implements Ruleval{
	constructor(){
	}
	putval(sym: Sym): Value{
		return new VFile(this, sym);
	}
}

/* arrays and lists. */
/* any-list: list of rules any of which can be instanciated any
 * number of times. used for top-level options which allow it,
 * for instance for spawning multiple models of the same type. */
class RAny implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VAny(this, sym);
	}
}
/* once-list: list of rules any of which can be instanciated only
 * once. mostly used for top-level options, for specific handling. */
class ROnce implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VOnce(this, sym);
	}
}
/* parameter lists: list of rules any of which can be instanciated
 * only once. similar semantics to once-lists, but used in a different
 * context, mostly function parameters. */
class RParam implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VParam(this, sym);
	}
}
/* single-lists: lists of rules only one of which may be instanciated
 * at any given time. used for setting a single value to a top-level
 * option, or parameter. */
class ROne implements Ruleval{
	readonly rules: Rule[];

	constructor(rules: Rule[]){
		this.rules = rules;
	}
	putval(sym: Sym): Value{
		return new VOne(this, sym);
	}
}

/* references (pointers). */
/* value-reference: pointer to a single value of the same name. used
 * for instance to alias parameters of the same type defined before.
 * these must either instanciate a new value of the given type, or set
 * or a reference to an old one. they wrap a subrule which is the
 * actual value that can be set.
 * 
 * perhaps this could be simplified by always referencing everything
 * in separate entries even if unused? */
class RRef implements Ruleval{
	readonly refname: string;
	readonly rule: Rule;
	readonly ref: Ref;

	constructor(refname: string, rule: Rule){
		/* key for the reftable. used to collect references to
		 * new values instanciated from subrule, or to alias to
		 * one of them. */
		this.refname = refname;
		/* actual value that can be instanciated. */
		this.rule = rule;
		/* create an entry in the reftable if it doesn't already
		 * exist, and save a pointer to it. */
		if(!reftab.hasOwnProperty(refname))
			reftab[refname] = new Ref(refname);
		this.ref = reftab[refname];
	}
	putval(sym: Sym): Value{
		return new VRef(this, sym);
	}
}
/* pointer-reference: pointer to a ref rule with the behavior of a
 * parameter list. allows pointing to any referenced value in a
 * reftable entry, for instance to provide a reference to a *model*
 * in a *process* expression. */
class RAnyRef implements Ruleval{
	readonly refname: string;
	readonly rules: Rule[];
	readonly ref: Ref;

	/* same semantics as RRef. */
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

/* main ruleset tree node type. a rule specifies attributes for
 * a symbol which may be spawned, and the ruleval corresponding
 * to the symbol's possible values. */
class Rule{
	readonly label: string;		/* user display label */
	readonly rsym: string;		/* internal bpp label */
	readonly mandatory: boolean;	/* must at least one such symbol be defined? */
	/* this is another exception in some bpp expressions,
	 * where a parameter name must refer to a parent:
	 * for instance: Fun(value1.rate, value2.rate) */
	readonly inheritname: boolean;	/* concatenate parent sym name during compilation? */
	readonly val: Ruleval | null;

	constructor(label: string, rsym: string, val: Ruleval | null = null, mandatory: boolean = false, inheritname: boolean = false){
		this.label = label;
		this.rsym = rsym;
		this.val = val;
		this.mandatory = mandatory;
		this.inheritname = inheritname;
	}
	/* call Ruleval's .putval to instanciate the value. if
	 * this is called, it is assumed the rule can have a
	 * value, so it is a bug if it doesn't. */
	putval(sym: Sym): Value{
		if(this.val === null)
			fatal("rule " + this.label + ": cannot create from null value");
		return this.val!.putval(sym);
	}
}
