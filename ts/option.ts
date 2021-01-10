/* root class containing a tree of expressions of a certain type,
 * as children of its root sym. */
class BppOpt{
	readonly el: BppOptElem;	/* associated visual element */
	readonly name: string;		/* label */
	readonly rule: Rule;		/* associated rule tree */
	readonly rootsym: Sym;		/* root symbol */

	/* set label, retrieve rules for this expression type, create
	 * a visual element, and a new root symbol to be used for
	 * creating new expressions */
	constructor(name: string){
		this.name = name;
		this.rule = rules[name];
		this.el = new BppOptElem(this);
		this.rootsym = new Sym(this, this.rule);
	}
	/* compile symbol tree into expressions */
	compile(): string{
		/* sanity check: rootsym must have a non-empty value to be
		 * considered as defined and containing a valid expression.
		 * if it's an array or list, it must not be empty. this
		 * avoids invalid partial definitions. if it is not
		 * mandatory, then just ignore it. */
		if(this.rootsym.val === null
		|| this.rootsym.val.val === null
		|| this.rootsym.val.val instanceof Array && this.rootsym.val.val.length === 0
		|| this.rootsym.val.val instanceof Object && Object.keys(this.rootsym.val.val).length === 0){
			if(this.rule.mandatory){
				pusherror(this.name + ": undefined mandatory value " + this.rule.label, this);
				return "=(null)";
			}else
				return "";
		/* otherwise, compile from root sym */
		}else
			/* FIXME: ??? */
			return this.rootsym.compile() + (this.name === "alphabet" ? "\n" : "");
	}
}
